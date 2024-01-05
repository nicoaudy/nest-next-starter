import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import * as bcrypt from 'bcrypt';
import { saltRounds } from '@/modules/auth/auth.service';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/dto/user.dto';
import { QueryDto } from '@/modules/user/dto/query.dto';

@Injectable()
export default class UsersService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAll(query: QueryDto) {
    let builder = this.knex.queryBuilder();

    if (query.search && query.search !== '') {
      builder = builder
        .where('name', 'like', `%${query.search}%`)
        .orWhere('email', 'like', `%${query.search}%`);
    }

    const users = await builder.from('users').paginate({
      isLengthAware: true,
      perPage: query.limit || 10,
      currentPage: query.page || 1,
    });

    return users;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(createUserDto.password, saltRounds);
      const user = await this.knex.table('users').insert(
        {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hash,
        },
        '*',
      );

      return user;
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException(`User ${id} does not exist`);
    }
    const user = await this.knex.table('users').where('id', id).first();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const email = await this.knex
        .table('users')
        .whereNot('id', id)
        .where('email', updateUserDto.email)
        .first();

      if (email) {
        throw new BadRequestException(
          `User with email ${updateUserDto.email} already exists`,
        );
      }

      const user = await this.knex.table('users').where('id', id).update({
        name: updateUserDto.name,
        email: updateUserDto.email,
        updated_at: new Date(),
      });

      return user;
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  async remove(id: number) {
    if (!id) {
      throw new NotFoundException(`User ${id} does not exist`);
    }
    await this.knex.table('users').where('id', id).delete();
  }
}
