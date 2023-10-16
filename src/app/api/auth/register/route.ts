import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';
import bcrypt from 'bcryptjs';

/*
  Only Admin can signup directly, editor can only be added by admins and
  when editor is added first time to any workspace then we ask editor to update his/her password
*/
export const POST = async (req: NextRequest) => {
  try {
    const { workspace, email, password } = await req.json();
    if (!workspace || !email || !password) {
      throw new Error('Invalid signup credentials');
    }
    console.log('server sign up:', workspace, email, password);

    const workspaceExist = await prisma.workspace.findFirst({
      where: {
        name: workspace,
      },
    });

    if (workspaceExist && workspaceExist?.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Workspace name already registered by someone else',
        }),
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    // TODO: handle cases if any db create query fails, options: transaction query or retry queue for failed queries
    const userCreated = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const workspaceCreatead = await prisma.workspace.create({
      data: {
        name: workspace,
      },
    });
    const _ = await prisma.workspaceAdmin.create({
      data: {
        email,
        userId: userCreated.id,
        workspaceId: workspaceCreatead.id,
      },
    });

    return new NextResponse('User has been created', { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: 'Something failed while signing up, please try after sometime',
      },
      { status: 500 }
    );
  }
};
