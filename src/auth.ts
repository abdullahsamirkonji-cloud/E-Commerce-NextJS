import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export interface RouteUser {
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  user: RouteUser;
  token: string;
}

declare module "next-auth" {
  interface User {
    id: string;
    accessToken: string;
    role?: string;
  }
  interface Session {
    accessToken: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  }
}

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password";
  status = "fail";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Route",
      credentials: {
        email: { type: "email", label: "Email", placeholder: "Enter Email" },
        password: {
          type: "password",
          label: "password",
          placeholder: "Enter password",
        },
      },
      async authorize(credentials) {
        const response = await fetch(
          `https://ecommerce.routemisr.com/api/v1/auth/signin`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              "content-type": "application/json",
            },
          },
        );
        const data: LoginResponse = await response.json();
        if (!response.ok || data.message !== "success") {
          throw new InvalidLoginError();
        }

        let userId = data.user.email;
        try {
          const payload = JSON.parse(
            Buffer.from(data.token.split(".")[1], "base64").toString(),
          );
          if (payload.id) {
            userId = payload.id;
          }
        } catch {
          // fallback to email
        }

        return {
          id: userId,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          accessToken: data.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.role = (user as { role?: string }).role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        if (token.role) session.user.role = token.role as string;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
