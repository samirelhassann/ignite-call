import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import PrismaAdapter from "@/lib/auth/prisma-adapter";

export const GOOGLE_PARAM_PERMISSION_NOT_GRANTED = "permissions_not_granted";

const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";
const GOOGLE_USER_INFO_PROFILE =
  "https://www.googleapis.com/auth/userinfo.profile";
const GOOGLE_USER_INFO_EMAIL = "https://www.googleapis.com/auth/userinfo.email";

export const buildNextAuthOptions = (
  req: NextApiRequest | NextPageContext["req"],
  res: NextApiResponse | NextPageContext["res"]
): NextAuthOptions => {
  return {
    adapter: PrismaAdapter({ req, res }),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        authorization: {
          params: {
            scope: `${GOOGLE_CALENDAR_SCOPE} ${GOOGLE_USER_INFO_PROFILE} ${GOOGLE_USER_INFO_EMAIL}`,
          },
        },
      }),
    ],

    callbacks: {
      async signIn({ account }) {
        const escope = account?.scope;

        if (!escope?.includes(GOOGLE_CALENDAR_SCOPE)) {
          return `/register/calendar-connect/?error=${GOOGLE_PARAM_PERMISSION_NOT_GRANTED}`;
        }

        return true;
      },

      async session({ session, user }) {
        return {
          ...session,
          user,
        };
      },
    },
  };
};

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, buildNextAuthOptions(req, res));
};

export default auth;
