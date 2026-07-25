import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

// Transforms and validates page/limit query parameters
@Injectable()
export class ParsePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, _metadata: ArgumentMetadata): PaginationQuery {
    const page = Math.max(1, parseInt(value?.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(value?.limit || '20', 10)));

    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('page and limit must be numbers');
    }

    return { page, limit, skip: (page - 1) * limit };
  }
}
