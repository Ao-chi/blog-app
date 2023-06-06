import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import { userLogin } from "../../../controllers/userController";
import axios from "axios";

import { getToken } from "next-auth/jwt";

export default NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" },
            },
            async authorize(credentials, req) {
                const { username, email, password } = credentials;

                //check if password is undefined
                if (!password) {
                    throw new Error("Password is required");
                }
                //check if username || email is undefined
                if (!username && !email) {
                    throw new Error("Username or Email is required");
                }

                await connectDB();
                const user = await userLogin(credentials);

                if (!user) {
                    return Error;
                }
                return user;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (trigger === "signIn") {
                token.id = user.id;
                token.username = user.username;
                token.bio = user.bio;
                token.location = user.location;
            }
            if (trigger === "update") {
                return { ...token, ...session?.user };
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user = token;
            }
            // session.user.id = token.id;
            // session.user.username = token.username;

            return session;
        },
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 30,
    },
});
