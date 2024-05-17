import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';

class S3Service {
  private s3: S3;
  private bucket: string;
  constructor() {
    this.s3 = new S3({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET,
      signatureVersion: 'v4',
    });
    this.bucket = process.env.S3_BUCKET_NAME;
  }
  async uploadFile(file: fs.ReadStream, path: string) {
    const upload = this.s3.upload({
      Bucket: this.bucket,
      Key: path,
      Body: file,
    });

    return upload.promise();
  }

  async deleteFile(path: string) {
    const del = this.s3.deleteObject({
      Bucket: this.bucket,
      Key: path,
    });
    return del.promise();
  }
}

export default S3Service;
