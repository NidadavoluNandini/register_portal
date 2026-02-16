import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {

  constructor(private uploadsService: UploadsService) {}

  @Post('resume')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // IMPORTANT
    }),
  )
  uploadResume(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadResume(file);
  }
}
