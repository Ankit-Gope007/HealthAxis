import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/src/lib/prisma"
import bcrypt from "bcryptjs"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // google provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent"
        }
      }
    }),
    // credentials provider
    CredentialsProvider({
      // name of the provider
      name: "credentials",
      // credentials to be used for login
      credentials: {
        email: {
          label: "Email",
          type: "email"

        },
        password: {
          label: "Password",
          type: "password",

        },
      },
      async authorize(credentials) {
        // type assertion for credentials
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        // checking if email is already registered
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // if user is not found, throw an error
        if (!user) throw new Error("User not found");

        // if user is found, check the password
        const isCorrect = await bcrypt.compare(password, user.password!);

        // if password is incorrect, throw an error
        if (!isCorrect) throw new Error("Invalid password");

        // if everything is correct, return the user
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt", // or "database" for stateful sessions
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      // First time login with Google or Credentials
      if (user) {
        // Try to find user in DB
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Use default or extract from signIn() params if needed
          const role = (account as any)?.params?.role ?? "PATIENT";


          // Create user
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              role: role,
              accessToken: account?.access_token ?? null,
              refreshToken: account?.refresh_token ?? null,
            },
          });

          token.id = newUser.id;
          token.email = newUser.email;
          token.role = newUser.role;
        } else {
          if (account?.provider === "google") {
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                accessToken: account.access_token ,
                refreshToken: account.refresh_token,
              },
            });
          }
          token.id = existingUser.id;
          token.email = existingUser.email;
          token.role = existingUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      (session.user as any).id = token.id;
      (session.user as any).role = token.role;
      (session.user as any).accessToken = token.accessToken;
      (session.user as any).refreshToken = token.refreshToken;
      (session.user as any).expiresAt = token.expiresAt;
      return session;
    }
  },
});