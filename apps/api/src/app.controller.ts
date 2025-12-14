import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return 'Hola Mundo!';
  }

  @Get('health')
  health() {
    return { ok: true, service: 'api', time: new Date().toISOString() };
  }
}
