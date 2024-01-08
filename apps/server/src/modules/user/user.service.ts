import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { saltRounds } from '@/modules/auth/auth.service';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/dto/user.dto';
import { QueryDto } from '@/modules/user/dto/query.dto';
import { PrismaService } from '@/common/prisma.service';

@Injectable()
export default class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryDto) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query.search || '' } },
          { email: { contains: query.search || '' } },
        ],
      },
      take: query.limit || 10,
      skip: ((query.page || 1) - 1) * (query.limit || 10),
    });

    return users;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const hash = await bcrypt.hash(createUserDto.password, saltRounds);
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hash,
      },
    });

    return user;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          NOT: {
            id: id,
          },
          email: updateUserDto.email,
        },
      });

      if (existingUser) {
        throw new BadRequestException(
          `User with email ${updateUserDto.email} already exists`,
        );
      }

      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
        },
      });

      return user;
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
