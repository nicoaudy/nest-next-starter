import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

export const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectModel() private knex: Knex,
  ) {}

  async register(payload: RegisterDto) {
    const exist = await this.knex('users')
      .where('email', payload.email)
      .first();

    if (exist) {
      throw new BadRequestException('User already exists');
    }

    const trx = await this.knex.transaction();
    try {
      const hash = await bcrypt.hash(payload.password, saltRounds);

      const user = await trx('users').insert(
        {
          name: payload.name,
          email: payload.email,
          password: hash,
          active: true,
        },
        '*',
      );

      trx.commit();
      return user[0];
    } catch (error) {
      trx.rollback();
      throw new InternalServerErrorException(error);
    }
  }

  async login(payload: LoginDto) {
    const user = await this.knex('users').where('email', payload.email).first();

    if (!user) {
      throw new UnauthorizedException('User not exist');
    }

    const valid = await bcrypt.compare(payload.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Password is not valid');
    }

    const userPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwt.signAsync(userPayload, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
        secret: process.env.JWT_SECRET,
      }),
      refreshToken: await this.jwt.signAsync(userPayload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
        secret: process.env.JWT_REFRESH_KEY,
      }),
    };
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.sub,
    };

    return {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
        secret: process.env.JWT_SECRET,
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
        secret: process.env.JWT_REFRESH_KEY,
      }),
    };
  }
}
