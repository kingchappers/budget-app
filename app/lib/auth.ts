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
  };
  