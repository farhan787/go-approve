import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/app/utils/prisma';
import bcrypt from 'bcryptjs';

const generateRandomPassword = (length) =>
  Array.from(
    { length },
    () =>
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
        Math.floor(Math.random() * 62)
      ]
  ).join('');

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession(authOptions);
    const { email: sessionEmail, role: sessionRole, workspace } = session?.user;

    const reqBody = await req.json();
    const { email: editorEmail } = reqBody;

    const dbWorkspace = await prisma.workspace.findUnique({
      where: { name: workspace },
    });
    if (!dbWorkspace || !dbWorkspace.id) {
      return NextResponse.json(
        { success: false, message: 'Workspace not found' },
        { status: 404 }
      );
    }

    const dbWorkspaceAdmin = await prisma.workspaceAdmin.findUnique({
      where: { workspaceId: dbWorkspace?.id, email: sessionEmail },
    });
    if (
      !dbWorkspaceAdmin ||
      !dbWorkspaceAdmin.id ||
      dbWorkspaceAdmin.email !== sessionEmail
    ) {
      return NextResponse.json(
        { success: false, message: 'Unauthorised' },
        { status: 401 }
      );
    }

    const editorUser = await prisma.user.findUnique({
      where: { email: editorEmail },
    });

    const editorUserAlreadyExist =
      editorUser && editorUser.id && editorUser.password?.length;

    let newEditorUser = null;
    const hashedTempPassword = await bcrypt.hash(generateRandomPassword(10), 5);
    if (!editorUserAlreadyExist) {
      newEditorUser = await prisma.user.create({
        data: { email: editorEmail, password: hashedTempPassword },
      });
    }

    await prisma.workspaceEditor.create({
      data: {
        email: editorEmail,
        workspaceId: dbWorkspace.id,
        userId: editorUserAlreadyExist ? editorUser.id : newEditorUser?.id,
      },
    });

    const resData: any = {};
    if (!editorUserAlreadyExist) {
      resData.passwordSetUrl = `http://127.0.0.1:3000/update-password?tempPassword=${hashedTempPassword}`;
    }

    return NextResponse.json(
      { success: true, message: 'Editor added successfully', data: resData },
      { status: 201 }
    );

    /**
     * TODO:
     * 1. Check if editor is already a user and has password setup
     * 2. Check if editor already exist on this workspace
     * 3. If existing user then do nothing else return a signal to client that force update password (with callback url to login)
     *      and create a user for this editor and create an entry in editor's table
     */
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
