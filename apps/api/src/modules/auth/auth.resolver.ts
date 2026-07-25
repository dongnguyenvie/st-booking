import { Mutation, Query, Args, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../@core/decorators/current-user.decorator';
import { PoliciesGuard } from '../@core/guards/policies.guard';
import { AuthService } from './auth.service';
import { Auth0TokenValidatorService } from './services/auth0-token-validator.service';
import { SignInByAuth0Input, SignInByAuth0DataOutput } from './dtos/sign-in-by-auth0.dto';
import { RegisterUserInput, RegisterUserDataOutput } from './dtos/register-user.dto';
import { SignInInput, SignInDataOutput } from './dtos/sign-in.dto';
import { GetUsersOutput } from './dtos/list-users.dto';
import { PaginationInput } from '@modules/@shared/dtos/pagination.input';
import { GetDashboardStatsDataOutput } from './dtos/dashboard-stats.dto';
import { MyAccessDataOutput } from './dtos/my-access.dto';
import { UpdateUserPrivilegesInput, UpdateUserPrivilegesDataOutput } from './dtos/update-user-privileges.dto';
import { VerifyTwoFactorInput, VerifyTwoFactorDataOutput } from './dtos/verify-two-factor.input';
import { ResendTwoFactorEmailInput, ResendTwoFactorEmailOutput } from './dtos/resend-two-factor-email.dto';
import { User } from '@generated-dto/user/user.model';
import { Privilege } from '@repo/core';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly auth0Validator: Auth0TokenValidatorService,
  ) {}

  /** Sign in with email and password. Returns 2FA challenge or full session. */
  @Mutation(() => SignInDataOutput)
  async signIn(@Args('input') input: SignInInput): Promise<SignInDataOutput> {
    return { data: await this.authService.signIn(input) };
  }

  /** Complete 2FA verification — exchanges preAuthToken + code for a real JWT. */
  @Mutation(() => VerifyTwoFactorDataOutput)
  async verifyTwoFactor(@Args('input') input: VerifyTwoFactorInput): Promise<VerifyTwoFactorDataOutput> {
    return { data: await this.authService.verifyTwoFactor(input.preAuthToken, input.code) };
  }

  /** Resend email OTP — rate-limited to 3 per 5-minute window. */
  @Mutation(() => ResendTwoFactorEmailOutput)
  async resendTwoFactorEmail(
    @Args('input') input: ResendTwoFactorEmailInput,
  ): Promise<ResendTwoFactorEmailOutput> {
    return this.authService.resendEmailChallenge(input.preAuthToken);
  }

  /** Register a new user — creates account in both Auth0 and local DB. */
  @Mutation(() => RegisterUserDataOutput)
  async registerUser(@Args('input') input: RegisterUserInput): Promise<RegisterUserDataOutput> {
    return { data: await this.authService.register(input) };
  }

  /**
   * Exchange an Auth0 access token for an internal JWT.
   * Validates the token against Auth0 JWKS, then finds or creates the user.
   */
  @Mutation(() => SignInByAuth0DataOutput)
  async signInByAuth0(@Args('input') input: SignInByAuth0Input): Promise<SignInByAuth0DataOutput> {
    const auth0Payload = await this.auth0Validator.validate(input.accessToken);
    return { data: await this.authService.signInByAuth0(auth0Payload) };
  }

  /**
   * Update a user's numeric privileges — SUPER_ADMIN only.
   *
   * Deliberately NOT `user:manage`: the only meaningful privilege is
   * SUPER_ADMIN, which bypasses every permission check, so gating this on a
   * grantable permission would let any admin holding it promote themselves out
   * of the RBAC system entirely.
   */
  @PoliciesGuard({ privileges: [Privilege.SUPER_ADMIN] })
  @Mutation(() => UpdateUserPrivilegesDataOutput)
  async updateUserPrivileges(
    @Args('input') input: UpdateUserPrivilegesInput,
    @CurrentUser() actor: { id: string },
  ): Promise<UpdateUserPrivilegesDataOutput> {
    return {
      data: await this.authService.updateUserPrivileges(input.userId, input.privileges, actor.id),
    };
  }

  /** Get current authenticated user — includes twoFactorEnabled, twoFactorMethod. */
  @PoliciesGuard()
  @Query(() => User)
  async me(@CurrentUser() currentUser: { id: string }): Promise<User | null> {
    return this.authService.getMe(currentUser.id);
  }

  /** Current user's roles + permissions — for client routing and UI gating. */
  @PoliciesGuard()
  @Query(() => MyAccessDataOutput, { description: 'Current user roles and permissions' })
  async myAccess(@CurrentUser() currentUser: { id: string }): Promise<MyAccessDataOutput> {
    return { data: await this.authService.getMyAccess(currentUser.id) };
  }

  /** List all users — requires authentication. */
  @PoliciesGuard()
  @Query(() => GetUsersOutput, { description: 'List all users' })
  async getUsers(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<GetUsersOutput> {
    return this.authService.listUsers(pagination);
  }

  /** Dashboard summary stats — requires authentication. */
  @PoliciesGuard()
  @Query(() => GetDashboardStatsDataOutput, { description: 'Get dashboard statistics' })
  async getDashboardStats(): Promise<GetDashboardStatsDataOutput> {
    return { data: await this.authService.getDashboardStats() };
  }
}
