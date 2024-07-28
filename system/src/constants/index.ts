const {
  NEXT_PUBLIC_PAYMONGO_URL,
  NEXT_PUBLIC_PAYMONGO_AUTH_BASIC,
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
} = process.env;

// if (!NEXT_PUBLIC_PAYMONGO_AUTH_BASIC || !NEXT_PUBLIC_PAYMONGO_URL) {
//   throw new Error("Missing required PayMongo environment variables");
// }

// if (!NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
//   throw new Error("Missing required Mapbox environment variables");
// }

export const PAYMONGO_URL = NEXT_PUBLIC_PAYMONGO_URL;
export const PAYMONGO_AUTH_BASIC = NEXT_PUBLIC_PAYMONGO_AUTH_BASIC;
export const MAPBOX_ACCESS_TOKEN = NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const UPLOADS_DIR = "storage";
export const AUTH_COOKIE_NAME = "auth-session";
