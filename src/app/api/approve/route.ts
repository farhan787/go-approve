import { NextRequest, NextResponse } from 'next/server';
import { s3 } from '@/configs/aws';
import { google } from 'googleapis';
import oAuth2Client from '@/configs/googleAuth';

const AUTHORIZATION_SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const AWS_BUCKET = process.env.AWS_BUCKET_NAME || '';

export async function GET(req: NextRequest, res: NextResponse) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: AUTHORIZATION_SCOPES,
  });
  console.log('authUrl:', authUrl);
  return NextResponse.json({ success: true, data: { authUrl } });
}

async function uploadVideoToYoutubeFromS3({ videoKey, title, description }) {
  const s3data = {
    Bucket: AWS_BUCKET,
    Key: videoKey,
  };
  const videoReadStream = s3.getObject(s3data).createReadStream();

  const youtube = google.youtube('v3');
  const youtubeInsertObj = {
    auth: oAuth2Client,
    part: 'snippet, status',
    requestBody: {
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: 'private',
      },
    },
    media: {
      body: videoReadStream,
    },
  };
  youtube.videos.insert(youtubeInsertObj);

  // TODO: notify once it upload completes on the server
  // TODO: also send error notification in-case anything fails
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const videoKey = req.nextUrl.searchParams.get('key') || '';
    const authCode = req.nextUrl.searchParams.get('authCode') || '';

    const token = await oAuth2Client.getToken(authCode);
    oAuth2Client.setCredentials(token.tokens);

    uploadVideoToYoutubeFromS3({
      videoKey,
      title: 'video title',
      description: 'video description',
    });

    return NextResponse.json({
      success: true,
      message: 'uploading to youtube from s3 storage',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: 'uploading to youtube from s3 storage',
    });
  }
}
