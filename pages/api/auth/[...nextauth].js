import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import MongoDbClient from "../../../utils/mongo_client";
import { UserSchema } from "../../../schemas";


export default NextAuth({
    session: {
        jwt: true
    },
    site: process.env.NEXT_PUBLIC_BASE_URL,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const db = new MongoDbClient();
                await db.initClient();

                try {
                    const user = await UserSchema.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error('User not found');
                    }
                    if (!user.authenticate(credentials.password)) {
                        throw new Error('Invalid email or password');
                    }
                    return {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        quizzesEnrolled: user.quizzesEnrolled,
                    }
                } catch (err) {
                    console.log(err)
                    throw new Error(err)
                } finally {
                    await db.disconnectClient();
                }
            }
        })
    ],
  pages: {
    signOut: '/login',
  },
    secret: process.env.NEXT_PUBLIC_SECRET ,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log(user)
                token.user = user;
            }
            return token
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        }
    }
})