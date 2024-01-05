import { DynamicModule, Module } from '@nestjs/common';
import { KnexModule, KnexModuleOptions } from 'nest-knexjs';
import knexfile from '../../knexfile';
import { attachPaginate } from 'knex-paginate';

@Module({})
export class DatabaseModule {
  private static getConnectionOptions(): KnexModuleOptions {
    //@ts-ignore
    const configOptions = knexfile[process.env.NODE_ENV || 'local'];
    attachPaginate();

    return {
      name: process.env.NODE_ENV || 'local',
      config: configOptions,
      retryAttempts: 4,
      retryDelay: 20000,
    };
  }

  public static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        KnexModule.forRootAsync({
          imports: [],
          useFactory: () => DatabaseModule.getConnectionOptions(),
          inject: [],
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
