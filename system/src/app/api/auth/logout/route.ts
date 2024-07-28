import { NextResponse as response } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/constants";

export async function POST() {
  cookies().delete(AUTH_COOKIE_NAME);

  return response.json({ success: true });
}
