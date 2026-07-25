import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Auth0TokenValidatorService } from './services/auth0-token-validator.service';
import { Auth0ManagementService } from './services/auth0-management.service';
import { PreAuthTokenService } from './services/pre-auth-token.service';
import { TwoFactorModule } from '../two-factor/two-factor.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        privateKey: config.get<string>('jwt.privateKey'),
        publicKey: config.get<string>('jwt.publicKey'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: config.get<number>('jwt.expiresIn'),
        },
      }),
    }),
    TwoFactorModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthResolver,
    Auth0TokenValidatorService,
    Auth0ManagementService,
    JwtStrategy,
    PreAuthTokenService,
  ],
  exports: [AuthService, JwtModule, Auth0ManagementService],
})
export class AuthModule {}
