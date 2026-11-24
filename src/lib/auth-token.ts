import { auth } from "@/auth";

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  accessToken: string;
}

export async function getAuthToken(): Promise<{
  accessToken: string;
  userId: string;
} | null> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return null;
    }

    return {
      accessToken: session.accessToken,
      userId: session.user?.id || "",
    };
  } catch (error) {
    console.error("Error retrieving authentication session:", error);
    return null;
  }
}

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
