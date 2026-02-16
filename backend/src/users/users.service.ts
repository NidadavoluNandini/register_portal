import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Express } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(
    body: CreateUserDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Resume file required');
    }

    // temporary resume URL
    const resumeUrl = `uploads/${file.originalname}`;

    return this.userModel.create({
      ...body,
      resumeUrl,
    });
  }
}
