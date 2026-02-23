import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Express } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return this.usersService.login(body.email);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req: { user: { email: string } }) {
    return this.usersService.getCurrentUser(req.user.email);
  }

@Post('create')
@UseInterceptors(
  FileInterceptor('resume', {
    storage: multer.memoryStorage(),
  }),
)
async createUser(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: CreateUserDto,
) {
  return this.usersService.create(body, file);
}

}
