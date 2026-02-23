import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadsService {

 private r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
  forcePathStyle: true,   // ⭐ VERY IMPORTANT FOR R2
});


  async uploadResume(file: Express.Multer.File) {

    const fileKey =
      `resumes/${randomUUID()}-${file.originalname}`;

    await this.r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key: fileKey,
      url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${fileKey}`,
    };
  }

  async getSignedResumeUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    });

    return getSignedUrl(this.r2Client, command, { expiresIn: 60 * 60 });
  }
}
