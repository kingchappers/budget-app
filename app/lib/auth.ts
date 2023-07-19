import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth";

import Auth0Provider from "next-auth/providers/auth0";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github"
import RedditProvider from "next-auth/providers/reddit";
import GoogleProvider from "next-auth/providers/google";

const { 
    AUTH0_CLIENT_ID = '', 
    AUTH0_CLIENT_SECRET = '', 
    AUTH0_ISSUER = '', 
    DISCORD_CLIENT_ID = '', 
    DISCORD_CLIENT_SECRET = '', 
    FACEBOOK_CLIENT_ID = '',
    FACEBOOK_CLIENT_SECRET = '',
    GITHUB_ID = '',  
    GITHUB_SECRET = '', 
    GOOGLE_CLIENT_ID = '',
    GOOGLE_CLIENT_SECRET = '',
    REDDIT_CLIENT_ID = '',
    REDDIT_CLIENT_SECRET = '',
} = process.env;

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
        FacebookProvider({
            clientId: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET
          }),
        GithubProvider({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
          }),
        RedditProvider({
            clientId: REDDIT_CLIENT_ID,
            clientSecret: REDDIT_CLIENT_SECRET,
            authorization: {
                params: {
                    duration: 'permanent',
                },
            },
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
  