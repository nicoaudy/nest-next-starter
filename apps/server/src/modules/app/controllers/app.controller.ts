import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('/health')
  getHealthCheck() {
    return {
      status: 'ok',
    };
  }
}
