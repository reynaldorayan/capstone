import { AUTH_COOKIE_NAME } from "@/constants";
import { User } from "@prisma/client";
import { CookieSerializeOptions } from "cookie";
import dayjs from "dayjs";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.NEXT_PUBLIC_SESSION_SECRET;

export type Payload<P> = P & {
  user: User;
  expires: Date;
} & JWTPayload;

async function generateJwt<P>(payload: Payload<P>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expires)
    .sign(new TextEncoder().encode(SECRET));
}

export async function verifyJwt<P>(input: string): Promise<Payload<P>> {
  const { payload } = await jwtVerify(input, new TextEncoder().encode(SECRET), {
    algorithms: ["HS256"],
  });
  return payload as Payload<P>;
}

const defaultCookieConfig: CookieSerializeOptions = {
  httpOnly: false,
  sameSite: "lax",
  secure: false,
};

export async function createCookieSession(user: User) {
  const expires = dayjs().add(14, "day").toDate();

  const token = await generateJwt({ user, expires });

  cookies().set({
    name: AUTH_COOKIE_NAME,
    value: token,
    expires,
    ...defaultCookieConfig,
  });
}

export async function updateCookieSession(request: NextRequest) {
  const previousToken = request.cookies.get(AUTH_COOKIE_NAME)?.value!;

  if (!previousToken) return;

  const parsed = await verifyJwt(previousToken);

  parsed.expires = dayjs().add(14, "day").toDate();

  const response = NextResponse.next();

  const token = await generateJwt({ ...parsed });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    expires: parsed.expires,
    ...defaultCookieConfig,
  });

  return response;
}

export async function getSession(): Promise<Payload<{}> | null> {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  return await verifyJwt(token);
}
