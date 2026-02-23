import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }

  @Get()
  healthCheck() {
    return {
      status: 'Backend running ✅',
      service: 'Register Portal API',
    };
  }
}
