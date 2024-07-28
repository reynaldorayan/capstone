import { verifyJwt } from "@/lib/session";
import { AUTH_COOKIE_NAME } from "@/constants";
import { type NextRequest, NextResponse as response } from "next/server";

export async function GET(req: NextRequest) {
  const authCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!authCookie) {
    return response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { user } = await verifyJwt(authCookie);

    return response.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return response.json(
      {
        error: "Invalid or expired session",
      },
      {
        status: 401,
      }
    );
  }
}
