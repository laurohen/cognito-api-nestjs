import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerRequest: { name: string; username: string; password: string; email: string },
  ) {
    return await this.authService.registerUser(registerRequest);
  }

  @Post('confirmcode')
  async confirmcode(
    @Body() confirmRequest: { username: string; code: string; },
  ) {
    return await this.authService.confirmUser(confirmRequest);
  }

  @Post('login')
  async login(@Body() authenticateRequest: { username: string; password: string }) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
