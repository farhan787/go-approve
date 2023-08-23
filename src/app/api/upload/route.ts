import { NextResponse } from 'next/server';
import { s3 } from '@/configs/aws';
import { AWSError, S3 } from 'aws-sdk';

const AWS_BUCKET = process.env.AWS_BUCKET_NAME || '';

export async function POST(req: Request, res: NextResponse) {
  try {
    const queryParams = new URL(req.url).searchParams;
    const uploadId = queryParams.get('uploadId') || '';

    const formData = await req.formData();
    const index = formData.get('index');
    const fileName = formData.get('fileName');
    const fileChunk = formData.get('fileChunk');

    const arrayBuffer = await fileChunk?.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const s3Params: S3.Types.UploadPartRequest = {
      Bucket: AWS_BUCKET,
      Key: fileName,
      Body: buffer,
      PartNumber: Number(index) + 1,
      UploadId: uploadId,
    };

    return new Promise((resolve, reject) => {
      s3.uploadPart(
        s3Params,
        (err: AWSError, data: S3.Types.UploadPartOutput) => {
          if (err) {
            reject(new Error(err.message));
          }

          resolve(
            NextResponse.json({
              success: true,
              message: 'Chunk uploaded successfully',
            })
          );
        }
      );
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      err,
    });
  }
}
