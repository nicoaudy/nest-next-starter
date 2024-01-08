import { NextAuthOptions, Session } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        // fetch to api on port 3333
        const response = await fetch("http://localhost:3333/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          return null;
        }

        // Extract relevant information for the session
        const userResponse = await response.json();
        const { user, accessToken, refreshToken } = userResponse.data;

        return {
          ...user,
          accessToken,
          refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        return Promise.resolve({
          ...token,
          user,
          sub: token.sub,
        });
      }

      return Promise.resolve(token);
    },
    session: async ({ session, token }: { session: Session, token: any }) => {
      if (token) {
        session.user = token.user;
      }
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/", //sigin page
  },
};
