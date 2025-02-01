import { Buffer } from 'buffer';
import { action } from "../_generated/server"; // change from mutation to action
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadResume = action(async (ctx, args: {
  fileName: string,
  fileContent: string,
  fileType: string,
  fileSize: number,
  uploadDate: string
}) => {
  const { fileName, fileContent, fileType, fileSize } = args;

  const base64Data = fileContent.includes("base64,")
    ? fileContent.split("base64,")[1]
    : fileContent;
  
  const fileBuffer = Buffer.from(base64Data, "base64");

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const objectKey = `resumes/${Date.now()}_${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
    Body: fileBuffer,
    ContentType: fileType,
    ContentLength: fileSize,
  });

  await s3.send(command);

  if (!process.env.AWS_ENDPOINT_URL_S3) {
    throw new Error("AWS_ENDPOINT_URL_S3 environment variable is not set");
  }
  const fileUrl = `${process.env.AWS_ENDPOINT_URL_S3.replace(/^https?:\/\//, "https://")}/${objectKey}`;

  return { fileUrl };
});
