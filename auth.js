import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      await prisma.user.upsert({
        where: {
          email: user.email,
        },
        update: {
          name: user.name,
        },
        create: {
          email: user.email,
          name: user.name,
        },
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        if (dbUser) {
          token.userId = dbUser.id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
});
