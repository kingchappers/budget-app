import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github"

const { GITHUB_ID = '', GITHUB_SECRET = '' } = process.env;

export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt",
    },
    providers: [
        GithubProvider({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            console.log("Session Callback", { session, token });
            return {
                ...session,
                user: {
                  ...session.user,
                  id: token.id,
                  randomKey: token.randomKey,
                },
            };
        },
        jwt: ({ token, user }) => {
            console.log("JWT Callback", { token, user });
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    randomKey: u.randomKey,
                };
            }
            return token;
        },
    },
  };
  