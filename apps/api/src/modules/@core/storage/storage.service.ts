import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface HeadResult {
  exists: boolean;
  sizeBytes?: number;
  contentType?: string;
}

/**
 * S3-compatible object storage (AWS S3 / MinIO / R2) — presigned URLs only; the
 * backend never proxies bytes. Lazily constructed so the app boots fine without
 * storage config; the first storage call then fails loudly with a clear message.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client: S3Client | null = null;

  constructor(private readonly config: ConfigService) {}

  get bucket(): string {
    return this.config.get<string>('storage.bucket') ?? '';
  }

  get isConfigured(): boolean {
    return Boolean(
      this.bucket &&
        this.config.get<string>('storage.accessKeyId') &&
        this.config.get<string>('storage.secretAccessKey'),
    );
  }

  /** Presigned PUT — the client uploads directly to the bucket. */
  presignPut(key: string, contentType: string, expiresInS?: number): Promise<string> {
    return getSignedUrl(
      this.getClient(),
      new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType }),
      { expiresIn: expiresInS ?? this.presignTtlS },
    );
  }

  /** Presigned GET — short-lived view/download link. */
  presignGet(key: string, expiresInS?: number): Promise<string> {
    return getSignedUrl(this.getClient(), new GetObjectCommand({ Bucket: this.bucket, Key: key }), {
      expiresIn: expiresInS ?? this.presignTtlS,
    });
  }

  /** HEAD — verify the client actually uploaded before flipping PENDING → UPLOADED. */
  async headObject(key: string): Promise<HeadResult> {
    try {
      const res = await this.getClient().send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return { exists: true, sizeBytes: res.ContentLength, contentType: res.ContentType };
    } catch (e) {
      const name = (e as { name?: string }).name;
      if (
        name === 'NotFound' ||
        name === 'NoSuchKey' ||
        (e as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404
      ) {
        return { exists: false };
      }
      throw e;
    }
  }

  /** Best-effort delete — callers log and continue on failure. */
  async deleteObject(key: string, bucket?: string): Promise<void> {
    await this.getClient().send(new DeleteObjectCommand({ Bucket: bucket ?? this.bucket, Key: key }));
  }

  get presignTtlS(): number {
    return this.config.get<number>('storage.presignTtlS') ?? 900;
  }

  private getClient(): S3Client {
    if (!this.isConfigured) {
      throw new ServiceUnavailableException(
        'Object storage is not configured (S3_BUCKET / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY)',
      );
    }
    if (!this.client) {
      const endpoint = this.config.get<string>('storage.endpoint');
      this.client = new S3Client({
        region: this.config.get<string>('storage.region') ?? 'us-east-1',
        ...(endpoint ? { endpoint } : {}),
        forcePathStyle: this.config.get<boolean>('storage.forcePathStyle') ?? Boolean(endpoint),
        credentials: {
          accessKeyId: this.config.get<string>('storage.accessKeyId') ?? '',
          secretAccessKey: this.config.get<string>('storage.secretAccessKey') ?? '',
        },
      });
      this.logger.log(
        `Storage client ready (bucket=${this.bucket}${endpoint ? `, endpoint=${endpoint}` : ''})`,
      );
    }
    return this.client;
  }
}
