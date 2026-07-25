import { Global, Module } from '@nestjs/common';

/**
 * CryptoModule — makes AES-GCM util functions available app-wide.
 * The util functions (encryptString/decryptString) are plain functions,
 * so no providers are needed — this module is a logical grouping marker.
 * Import this module wherever you need to signal the crypto dep boundary.
 */
@Global()
@Module({})
export class CryptoModule {}
