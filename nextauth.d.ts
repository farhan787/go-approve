declare module 'next-auth' {
  interface User {
    role?: string;
    workspace?: string;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role?: string;
    workspace?: string;
  }
}
