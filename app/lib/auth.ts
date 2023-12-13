import type { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb-connect-db";
import { secret } from "@aws-amplify/backend"

import Auth0Provider from "next-auth/providers/auth0";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github"
import RedditProvider from "next-auth/providers/reddit";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    providers: [
        Auth0Provider({
            clientId: process.env.REACT_APP_AUTH0_CLIENT_ID ?? '',
            clientSecret: process.env.REACT_APP_AUTH0_CLIENT_SECRET ?? '',
            issuer: process.env.REACT_APP_AUTH0_ISSUER ?? ''
        }),
        DiscordProvider({
            clientId: process.env.REACT_APP_DISCORD_CLIENT_ID ?? '',
            clientSecret: process.env.REACT_APP_DISCORD_CLIENT_SECRET ?? ''
        }),
        FacebookProvider({
            clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID ?? '',
            clientSecret: process.env.REACT_APP_FACEBOOK_CLIENT_SECRET ?? ''
        }),
        GithubProvider({
            clientId: process.env.REACT_APP_GITHUB_ID ?? '',
            clientSecret: process.env.REACT_APP_GITHUB_SECRET ?? '',
        }),
        GoogleProvider({
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET ?? ''
        }),
        RedditProvider({
            clientId: process.env.REACT_APP_REDDIT_CLIENT_ID ?? '',
            clientSecret: process.env.REACT_APP_REDDIT_CLIENT_SECRET ?? '',
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
            const userId = token.sub;
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
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
                };
            }
            return token;
        },
    },
};
