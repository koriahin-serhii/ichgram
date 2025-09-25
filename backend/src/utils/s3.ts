import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.S3_BUCKET!;

export async function uploadProfileImageToS3(
  fileBuffer: Buffer,
  mimetype: string,
  userId: string
): Promise<string> {
  const fileExt = mimetype.split('/')[1] || 'jpg';
  const key = `profile-images/${userId}-${uuidv4()}.${fileExt}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype
  });
  await s3.send(command);
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function deleteProfileImageFromS3(imageUrl: string) {
  // Extract the key from the URL
  const url = new URL(imageUrl);
  const key = url.pathname.slice(1); // delete leading '/'
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await s3.send(command);
}

// Upload image for post
export async function uploadPostImageToS3(fileBuffer: Buffer, mimetype: string, userId: string): Promise<string> {
  const fileExt = mimetype.split('/')[1] || 'jpg';
  const key = `post-images/${userId}-${uuidv4()}.${fileExt}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  });
  await s3.send(command);
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// Delete post image from S3
export async function deletePostImageFromS3(imageUrl: string) {
  const url = new URL(imageUrl);
  const key = url.pathname.slice(1);
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await s3.send(command);
}
