import "next-auth";

declare module "next-auth" {
  interface User {
    name?: string;
    email: string;
    role: string;
    accessToken: string;
  }

  interface Session {
    user: {
      name?: string;
      email: string;
      role: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string;
    email: string;
    role: string;
    accessToken: string;
  }
}
