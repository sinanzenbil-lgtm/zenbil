import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          console.log("[AUTH] Authorize called with:", { email: credentials?.email });
          
          if (!credentials?.email || !credentials?.password) {
            console.log("[AUTH] Missing credentials");
            return null;
          }

          console.log("[AUTH] Querying database...");
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email as string },
          });

          if (!admin) {
            console.log("[AUTH] Admin not found");
            return null;
          }

          console.log("[AUTH] Admin found, checking password...");
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            admin.password
          );

          if (!isPasswordValid) {
            console.log("[AUTH] Invalid password");
            return null;
          }

          console.log("[AUTH] Login successful");
          return {
            id: admin.id,
            email: admin.email,
            name: `${admin.firstName} ${admin.lastName}`,
            role: "ADMIN",
          };
        } catch (error) {
          console.error("[AUTH] Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/giris",
  },
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
});

