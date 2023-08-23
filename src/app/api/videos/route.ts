import { NextRequest, NextResponse } from 'next/server';
// import { s3 } from '@/configs/aws';
// import { AWSError, S3 } from 'aws-sdk';

// const AWS_BUCKET = process.env.AWS_BUCKET_NAME || '';

export async function GET(req: NextRequest, res: NextResponse) {
  const videoKey = req.nextUrl.searchParams.get('key') || '';

  try {
    // For now, serve the video directly from CloudFront CDN
    const videoUrl = `${process.env.AWS_CLOUDFRONT_DOMAIN}/${videoKey}`;
    return NextResponse.json({ success: true, data: { videoUrl } });

    // const s3Params: S3.Types.UploadPartRequest = {
    //   Bucket: AWS_BUCKET,
    //   Key: videoKey,
    // };

    // return new Promise((resolve, reject) => {
    //   s3.getObject(s3Params, (err: AWSError, data) => {
    //     if (err) {
    //       reject(new Error(err.message));
    //     }
    //     console.log('data:', data.Body?.valueOf());
    //     resolve(NextResponse.json({ success: true, data: data.Body }));
    //   });
    // });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: 'Something went wrong',
    });
  }
}
