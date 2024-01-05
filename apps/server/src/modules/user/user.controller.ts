import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/dto/user.dto';
import UsersService from '@/modules/user/user.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth-guard.guard';
import { QueryDto } from '@/modules/user/dto/query.dto';
import { IResponse } from '@/common/interfaces/response.interface';
import { ResponseSuccess } from '@/common/dto/response.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: QueryDto): Promise<IResponse> {
    const users = await this.usersService.findAll(query);
    return new ResponseSuccess('USER.ALL', users);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    const user = await this.usersService.create(createUserDto);
    return new ResponseSuccess('USER.UPDATE', user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponse> {
    const user = await this.usersService.findOne(+id);
    return new ResponseSuccess('USER.UPDATE', user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse> {
    const user = await this.usersService.update(+id, updateUserDto);
    return new ResponseSuccess('USER.UPDATE', user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IResponse> {
    await this.usersService.remove(+id);
    return new ResponseSuccess('USER.DELETE');
  }
}
