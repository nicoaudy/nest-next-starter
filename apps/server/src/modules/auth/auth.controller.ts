import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshJwtGuard } from './guards/jwt-refresh-guard.guard';
import { ResponseSuccess } from '@/common/dto/response.dto';
import { IResponse } from '@/common/interfaces/response.interface';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() payload: RegisterDto): Promise<IResponse<User>> {
    const register = await this.authService.register(payload);
    return new ResponseSuccess('AUTH.REGISTER', register);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginDto): Promise<IResponse> {
    const login = await this.authService.login(payload);
    return new ResponseSuccess('AUTH.LOGIN', login);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  async profile(@CurrentUser() user: User): Promise<IResponse<User>> {
    return new ResponseSuccess('AUTH.PROFILE', user);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('/refresh')
  async refreshToken(@Req() req: any) {
    const refresh = await this.authService.refreshToken(req.user);
    return new ResponseSuccess('AUTH.REFRESH_TOKEN', refresh);
  }
}
