import Providers from "@/components/Providers";
import { cn } from "@/utils";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/constants";
import { verifyJwt } from "@/lib/session";
import { Fira_Sans } from "next/font/google";

const APP_NAME = "Happy homes";
const APP_DEFAULT_TITLE = "Happy homes";
const APP_TITLE_TEMPLATE = "%s - Smartbook";
const APP_DESCRIPTION = "A smartbook booking system";

const fira = Fira_Sans({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authCookie = cookies().get(AUTH_COOKIE_NAME)?.value;

  let user = null;

  if (authCookie) {
    try {
      const { user: _user } = await verifyJwt(authCookie);
      user = _user;
    } catch (error) {
      console.error("Root Layout: Invalid or expired session");
    }
  }

  return (
    <html lang="en">
      <body
        className={cn(fira.className, {
          "debug-screens": process.env.NODE_ENV === "development",
        })}
      >
        <Providers user={user}>{children}</Providers>
      </body>
    </html>
  );
}
