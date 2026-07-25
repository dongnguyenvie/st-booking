import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PoliciesGuard } from '../@core/guards/policies.guard';
import { CurrentUser } from '../@core/decorators/current-user.decorator';
import { TwoFactorService } from './two-factor.service';
import { TwoFactorMethod } from '@repo/core';
import { TwoFactorSetupInitOutput } from './dto/two-factor-setup-init.output';
import { TwoFactorSetupVerifyInput } from './dto/two-factor-setup-verify.input';
import { TwoFactorDisableInput } from './dto/two-factor-disable.input';
import { TwoFactorResultOutput } from './dto/two-factor-result.output';

interface AuthUser {
  id: string;
  email: string;
}

@Resolver()
export class TwoFactorResolver {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  /**
   * Initialise 2FA setup.
   * TOTP: returns secret + qrCodeDataUrl.
   * EMAIL: sends OTP and returns challengeId.
   */
  @PoliciesGuard()
  @Mutation(() => TwoFactorSetupInitOutput)
  async twoFactorSetupInit(
    @Args('method', { type: () => TwoFactorMethod }) method: TwoFactorMethod,
    @CurrentUser() user: AuthUser,
  ): Promise<TwoFactorSetupInitOutput> {
    return this.twoFactorService.setupInit(user.id, method);
  }

  /**
   * Verify the setup code and activate 2FA for the authenticated user.
   */
  @PoliciesGuard()
  @Mutation(() => TwoFactorResultOutput)
  async twoFactorSetupVerify(
    @Args('input') input: TwoFactorSetupVerifyInput,
    @CurrentUser() user: AuthUser,
  ): Promise<TwoFactorResultOutput> {
    await this.twoFactorService.setupVerify(user.id, input.method, input.code);
    return { success: true };
  }

  /**
   * Disable 2FA. Requires current password.
   * TOTP method also requires a valid TOTP code.
   * EMAIL method: password alone is sufficient (v1).
   */
  @PoliciesGuard()
  @Mutation(() => TwoFactorResultOutput)
  async twoFactorDisable(
    @Args('input') input: TwoFactorDisableInput,
    @CurrentUser() user: AuthUser,
  ): Promise<TwoFactorResultOutput> {
    await this.twoFactorService.disable(user.id, input.password, input.code);
    return { success: true };
  }
}
