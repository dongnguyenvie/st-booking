import './modules/@shared/enums/register-graphql-enums';

import { Module } from '@nestjs/common';
import { CoreModule } from './modules/@core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { JobsModule } from './modules/@jobs/jobs.module';
import { GraphqlModule } from './modules/@core/graphql/graphql.module';
import { RoleModule } from './modules/role/role.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { SeedModule } from './modules/@core/seed/seed.module';
import { TwoFactorModule } from './modules/two-factor/two-factor.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    JobsModule,
    GraphqlModule,
    // Feature modules
    RoleModule,
    ApiKeyModule,
    SeedModule,
    TwoFactorModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
