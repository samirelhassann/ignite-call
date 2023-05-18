/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable camelcase */

import dayjs from "dayjs";
import { google } from "googleapis";

import { prisma } from "./prisma";

export async function getGoogleOAuthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: "google",
      user_id: userId,
    },
  });

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  const { access_token, refresh_token, expires_at: expiry_date } = account;

  auth.setCredentials({
    access_token,
    refresh_token,
    expiry_date: expiry_date ? expiry_date * 1000 : null,
  });

  if (!expiry_date) {
    return auth;
  }

  const isTokenExpired = dayjs(expiry_date * 1000).isBefore(new Date());

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken();

    const {
      access_token: refreshedAccessToken,
      refresh_token: refreshedRefreshToken,
      expiry_date: refreshedExpiryDate,
      id_token: refreshedIdToken,
      scope: refreshedScope,
      token_type: refreshedTokenType,
    } = credentials;

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token: refreshedAccessToken,
        refresh_token: refreshedRefreshToken,
        expires_at: refreshedExpiryDate
          ? Math.floor(refreshedExpiryDate / 1000)
          : null,
        id_token: refreshedIdToken,
        scope: refreshedScope,
        token_type: refreshedTokenType,
      },
    });

    auth.setCredentials({
      access_token: refreshedAccessToken,
      refresh_token: refreshedRefreshToken,
      expiry_date: refreshedExpiryDate,
    });
  }

  return auth;
}
