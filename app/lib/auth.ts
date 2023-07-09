import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"

const { GITHUB_ID = '', GITHUB_SECRET = '' } = process.env;

const handler = NextAuth({
  providers: [
    GithubProvider({
        clientId: GITHUB_ID,
        clientSecret: GITHUB_SECRET,
    })
  ]
})

export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = { id: "1", name: "Admin", email: "admin@admin.com" };
                return user;
            },
        }),
        GithubProvider({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
        }),
    ],
  };
  