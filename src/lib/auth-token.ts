import { auth } from "@/auth";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  accessToken: string;
}

/**
 * Retrieves the current authenticated user's token and ID from NextAuth.
 * Works uniformly inside Next.js Server Components, Server Actions, and Route Handlers.
 */
export async function getAuthToken(): Promise<{
  accessToken: string;
  userId: string;
} | null> {
  try {
    const jwtObject = await getToken({
      req: {
        headers: await headers(),
      },
      secret: process.env.AUTH_SECRET,
    });

    const accessToken = jwtObject?.accessToken;
    if (!accessToken) {
      return null;
    }

    const userId = (jwtObject.id as string) || (jwtObject.sub as string) || "";
    return { accessToken, userId };
  } catch {
    return null;
  }
}

/**
 * Prepares the standard authorization headers required by Route Misr E-Commerce API.
 * The Route backend requires `token: <JWT>` in the headers.
 */
export async function getAuthHeaders(): Promise<{
  token: string;
  "Content-Type": string;
} | null> {
  const authData = await getAuthToken();
  if (!authData?.accessToken) {
    return null;
  }

  return {
    token: authData.accessToken,
    "Content-Type": "application/json",
  };
}
