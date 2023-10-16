import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // url -> editorPasswordSignup?workspace=hk_yt
    // body -> { email, tempPassword, newPassword }
    const reqBody = await req.json();
    const { email, tempPassword, newPassword } = reqBody;
    console.log(email, tempPassword, newPassword);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
