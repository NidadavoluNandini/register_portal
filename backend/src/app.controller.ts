import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  healthCheck() {
    return {
      status: 'Backend running ✅',
      service: 'Register Portal API',
    };
  }
}
