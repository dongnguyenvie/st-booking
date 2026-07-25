import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInInput } from './dtos/sign-in.dto';
import { RegisterUserInput } from './dtos/register-user.dto';
import { CurrentUser } from '../@core/decorators/current-user.decorator';
import { PoliciesGuard } from '../@core/guards/policies.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  register(@Body() dto: RegisterUserInput) {
    return this.authService.register(dto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  signIn(@Body() dto: SignInInput) {
    return this.authService.signIn(dto);
  }

  @PoliciesGuard()
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@CurrentUser() user: { id: string }) {
    console.log('🚀 ~ AuthController ~ getMe ~ user:', user);
    return this.authService.getMe(user.id);
  }
}
