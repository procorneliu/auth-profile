import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
      endpoint: this.configService.getOrThrow('AWS_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
  }

  async uploadFile(key: string, file: Express.Multer.File): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }),
    );

    return `${this.configService.getOrThrow('AWS_PUBLIC_ENDPOINT')}/${this.bucket}/${key}`;
  }
}
