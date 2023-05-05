// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    avatar_url: string;
  }

  interface Session {
    user: User;
  }
}
