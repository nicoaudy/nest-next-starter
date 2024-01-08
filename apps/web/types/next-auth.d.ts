import NextAuth from "next-auth";

interface IUser extends DefaultUser {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}

declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
