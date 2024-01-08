import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/common/prisma.service';

export const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(payload: RegisterDto) {
    const exist = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (exist) {
      throw new BadRequestException('User already exists');
    }

    const hash = await bcrypt.hash(payload.password, saltRounds);
    const user = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hash,
        active: true,
      },
    });

    return user;
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not exist');
    }

    const valid = await bcrypt.compare(payload.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Password is not valid');
    }

    const userPayload = {
      email: user.email,
      sub: user.id,
    };

    return {
      user,
      accessToken: await this.generateToken(
        userPayload,
        process.env.ACCESS_TOKEN_EXPIRATION_TIME,
        process.env.JWT_SECRET,
      ),
      refreshToken: await this.generateToken(
        userPayload,
        process.env.REFRESH_TOKEN_EXPIRATION_TIME,
        process.env.JWT_REFRESH_KEY,
      ),
    };
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.sub,
    };

    return {
      user,
      accessToken: await this.generateToken(
        payload,
        process.env.ACCESS_TOKEN_EXPIRATION_TIME,
        process.env.JWT_SECRET,
      ),
      refreshToken: await this.generateToken(
        payload,
        process.env.REFRESH_TOKEN_EXPIRATION_TIME,
        process.env.JWT_REFRESH_KEY,
      ),
    };
  }

  private async generateToken(payload, expiresIn: string, secret: string) {
    const token = await this.jwt.signAsync(payload, {
      expiresIn,
      secret,
    });

    return token;
  }
}
