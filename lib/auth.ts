import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gereklidir");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email as string },
        });

        if (!admin) {
          throw new Error("Geçersiz email veya şifre");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          admin.password
        );

        if (!isPasswordValid) {
          throw new Error("Geçersiz email veya şifre");
        }

        return {
          id: admin.id,
          email: admin.email,
          name: `${admin.firstName} ${admin.lastName}`,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/giris",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
