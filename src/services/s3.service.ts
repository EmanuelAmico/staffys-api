import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { envs } from "../config/env/env.config";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadedFile } from "express-fileupload";

const {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_S3_PUBLIC_KEY,
  AWS_S3_SECRET_KEY,
} = envs;

class S3Service {
  static client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: AWS_S3_PUBLIC_KEY,
      secretAccessKey: AWS_S3_SECRET_KEY,
    },
  });
  static async uploadFile(file: UploadedFile, _id: string) {
    const stream = fs.createReadStream(file.tempFilePath);
    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: _id + "." + file.name.split(".").at(-1),
      Body: stream,
    };
    const command = new PutObjectCommand(uploadParams);
    return await this.client.send(command);
  }
  static async getFiles() {
    const command = new ListObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
    });
    return await this.client.send(command);
  }
  static async getFile(_id: string) {
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: _id,
    });
    return await this.client.send(command);
  }

  static async getFileURL(_id: string) {
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: _id,
    });
    return await getSignedUrl(this.client, command, { expiresIn: 3600 });
  }
}

export { S3Service };
