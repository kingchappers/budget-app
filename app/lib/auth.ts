import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth";

import Auth0Provider from "next-auth/providers/auth0";
import GithubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord";


const { AUTH0_CLIENT_ID = '', AUTH0_CLIENT_SECRET = '', AUTH0_ISSUER ='', DISCORD_CLIENT_ID = '', DISCORD_CLIENT_SECRET = '', GITHUB_ID = '',  GITHUB_SECRET = '' } = process.env;

export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt",
    },
    providers: [
        Auth0Provider({
            clientId: AUTH0_CLIENT_ID,
            clientSecret: AUTH0_CLIENT_SECRET,
            issuer: AUTH0_ISSUER
          }),
        DiscordProvider({
            clientId: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET
        }),
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
  