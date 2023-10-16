import NextAuth from 'next-auth';
import bcrypt from 'bcryptjs';
import prisma from '@/app/utils/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';

const credentialsProviderParams = {
  id: 'credentials',
  name: 'Credentials',
  async authorize(credentials) {
    try {
      const { workspace, email, password, role } = credentials;
      if (!workspace || !email || !password || !role) {
        throw new Error('Invalid login credentials');
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user || !user.id) {
        throw new Error('User not found');
      }

      const dbWorkspace = await prisma.workspace.findUnique({
        where: { name: workspace },
      });
      if (!dbWorkspace || !dbWorkspace.id) {
        throw new Error('Workspace not found');
      }

      if (role.toLowerCase() === 'admin') {
        const workspaceAdmin = await prisma.workspaceAdmin.findUnique({
          where: { workspaceId: dbWorkspace.id },
        });
        if (!workspaceAdmin || !workspaceAdmin.id) {
          throw new Error('Admin not found');
        }
      }

      if (role.toLowerCase() === 'editor') {
        const workspaceEditor = await prisma.workspaceEditor.findUnique({
          where: {
            workspaceEditorIdentifier: {
              workspaceId: dbWorkspace.id,
              userId: user.id,
            },
          },
        });
        if (!workspaceEditor || !workspaceEditor.id) {
          throw new Error('Editor not found');
        }
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) {
        return { role, workspace, ...user };
      }

      throw new Error('Invalid email or password');
    } catch (err) {
      throw new Error(err);
    }
  },
};

export const authOptions = {
  providers: [CredentialsProvider(credentialsProviderParams)],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.workspace = user.workspace;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.workspace = token.workspace;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
