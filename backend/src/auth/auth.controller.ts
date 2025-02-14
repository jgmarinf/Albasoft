import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RegisterAdminDto } from './dto/register-admin-dto';
import { RegisterUserDto } from './dto/register-user-dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/admin')
  registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.authService.registerAdmin(registerAdminDto);
  }

  @Post('register/user')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  profile(
    @Request()
    req,
  ) {
    return req.user;
  }
}
