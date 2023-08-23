import AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';

// js v3 sdk
const s3Client = new S3Client({ region: process.env.AWS_REGION });

// js v2 sdk
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  //   useAccelerateEndpoint: true,
});

export { s3, s3Client };
