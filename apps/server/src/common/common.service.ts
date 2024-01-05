import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class CommonService {
  constructor(@InjectModel() private readonly knex: Knex) {}
}
