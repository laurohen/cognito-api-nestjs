import { BadRequestException, Body, Controller, Post, ValidationPipe, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CredentialsDto } from './dto/credentials.dto';
import { ResendcodeDto } from './dto/resendcode.dto';
import { ConfirmcodeDto } from './dto/confirmcode.dto';
import { AuthenticateDto } from './dto/authenticate.dto';

@ApiTags('cognito')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ) {
    return await this.authService.registerUser(credentiaslsDto);
  }

  @Post('resendCodeUser')
  async resendCodeUser(
    @Body(ValidationPipe) resendcodeDto: ResendcodeDto,
  ) {
    return await this.authService.resendCodeUser(resendcodeDto);
  }

  @Post('confirmcode')
  async confirmcode(
    @Body(ValidationPipe) confirmcodeDto: ConfirmcodeDto,
  ) {
    return await this.authService.confirmUser(confirmcodeDto);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) authenticateDto: AuthenticateDto,
  ) {
    try {
      return await this.authService.authenticateUser(authenticateDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
