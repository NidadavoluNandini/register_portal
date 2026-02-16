import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { Express } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post('create')
@UseInterceptors(FileInterceptor('resume'))
async createUser(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: CreateUserDto,
) {
  console.log("BODY RECEIVED:", body);
  console.log("FILE RECEIVED:", file);

  return this.usersService.create(body, file);
}

}
