import { NextRequest, NextResponse } from 'next/server';
import { s3 } from '@/configs/aws';
import { S3, AWSError } from 'aws-sdk';

const AWS_BUCKET = process.env.AWS_BUCKET_NAME || '';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const fileName = req.nextUrl.searchParams.get('fileName');
    const uploadId = req.nextUrl.searchParams.get('uploadId');

    const s3Params = {
      Bucket: AWS_BUCKET,
      Key: fileName,
      UploadId: uploadId,
    };

    return new Promise((resolve, reject) => {
      s3.listParts(s3Params, (err, data) => {
        if (err) {
          reject(new Error(err.message));
        }

        const parts = [];
        data?.Parts?.forEach((part) => {
          parts.push({
            ETag: part.ETag,
            PartNumber: part.PartNumber,
          });
        });

        s3Params.MultipartUpload = {
          Parts: parts,
        };

        s3.completeMultipartUpload(
          s3Params,
          (err: AWSError, data: S3.Types.CompleteMultipartUploadOutput) => {
            if (err) {
              reject(new Error(err.message));
            }

            resolve(
              NextResponse.json({
                success: true,
                message: 'Upload complete',
                data: data.Location,
              })
            );
          }
        );
      });
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      err,
    });
  }
}
