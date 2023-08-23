import { NextRequest, NextResponse } from 'next/server';
import { s3 } from '@/configs/aws';

const AWS_BUCKET = process.env.AWS_BUCKET_NAME || '';

// returns AWS upload id for file upload in chunks
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { fileName } = reqBody;
    const params = {
      Bucket: AWS_BUCKET,
      Key: fileName,
    };
    const upload = await s3.createMultipartUpload(params).promise();
    return NextResponse.json({ uploadId: upload.UploadId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: 'Error initializing upload',
    });
  }
}
