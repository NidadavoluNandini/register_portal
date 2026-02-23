import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Express } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UploadsService } from '../uploads/uploads.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly uploadsService: UploadsService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    body: CreateUserDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Resume file required');
    }

    const normalizedEmail = body.email.trim().toLowerCase();

    const { url: resumeUrl, key: resumeKey } =
      await this.uploadsService.uploadResume(file);

    const existingUser = await this.userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      existingUser.firstName = body.firstName;
      existingUser.middleName = body.middleName;
      existingUser.lastName = body.lastName;
      existingUser.phone = body.phone;
      existingUser.resumeUrl = resumeUrl;
      existingUser.resumeKey = resumeKey;
      existingUser.emailVerified = true;

      await existingUser.save();
      return existingUser;
    }

    return this.userModel.create({
      ...body,
      email: normalizedEmail,
      resumeUrl,
      resumeKey,
      emailVerified: true,
    });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.trim().toLowerCase() });
  }

  async login(email: string) {
    const userWithResume = await this.getCurrentUser(email.trim().toLowerCase());

    const accessToken = await this.jwtService.signAsync({
      sub: userWithResume._id,
      email: userWithResume.email,
    });

    return {
      accessToken,
      user: userWithResume,
    };
  }

  async getCurrentUser(email: string) {
    const user = await this.userModel.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      throw new NotFoundException('User not found. Please register first.');
    }

    if (!user.resumeUrl) {
      throw new BadRequestException('Resume not uploaded yet.');
    }

    const resumeKey = user.resumeKey ?? this.extractResumeKey(user.resumeUrl);

    if (!resumeKey) {
      throw new BadRequestException('Could not resolve resume key.');
    }

    const signedResumeUrl = await this.uploadsService.getSignedResumeUrl(
      resumeKey,
    );

    const userObject = user.toObject();
    return {
      ...userObject,
      resumeUrl: signedResumeUrl,
    };
  }

  private extractResumeKey(resumeUrl: string) {
    try {
      const parsed = new URL(resumeUrl);
      const parts = parsed.pathname.split('/').filter(Boolean);

      if (parts.length >= 2) {
        return decodeURIComponent(parts.slice(1).join('/'));
      }

      return null;
    } catch {
      return null;
    }
  }
}
