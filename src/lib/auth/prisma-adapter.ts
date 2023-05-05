/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { Adapter } from "next-auth/adapters";

import { destroyCookie, parseCookies } from "nookies";

import { User } from "@prisma/client";

import { prisma } from "../prisma";

interface PrismaAdapterProps {
  req: NextApiRequest | NextPageContext["req"];
  res: NextApiResponse | NextPageContext["res"];
}

const PrismaAdapter = ({ req, res }: PrismaAdapterProps): Adapter => {
  const prismaUserToAdapterUser = (user: User) => {
    return {
      id: user.id,
      name: user.complete_name,
      username: user.username,
      email: user.email!,
      avatar_url: user.avatar_url!,
      emailVerified: null,
    };
  };

  return {
    async createUser(user) {
      const { "@ignitecall:userId": userIdOnCookies } = parseCookies({ req });

      if (!userIdOnCookies) {
        throw new Error("User ID not found on cookies");
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          complete_name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      });

      destroyCookie({ res }, "@ignitecall:userId", {
        path: "/",
      });

      return prismaUserToAdapterUser(prismaUser);
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return null;
      }

      return prismaUserToAdapterUser(user);
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.complete_name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },

        include: {
          user: true,
        },
      });

      if (!account) {
        return null;
      }

      const { user } = account;

      return prismaUserToAdapterUser(user);
    },

    async updateUser(user) {
      const userUpdated = await prisma.user.update({
        where: {
          id: user.id!,
        },
        data: {
          complete_name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      });

      return prismaUserToAdapterUser(userUpdated);
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      });
    },

    async createSession({ sessionToken, userId, expires }) {
      const createdSession = await prisma.session.create({
        data: {
          user_id: userId,
          session_Token: sessionToken,
          expires,
        },
      });

      return {
        userId: createdSession.user_id,
        sessionToken: createdSession.session_Token,
        expires: createdSession.expires,
      };
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_Token: sessionToken,
        },
      });
    },

    async getSessionAndUser(sessionToken) {
      const foundedSession = await prisma.session.findUnique({
        where: {
          session_Token: sessionToken,
        },
        include: {
          user: true,
        },
      });

      if (!foundedSession) {
        return null;
      }

      const { user, ...session } = foundedSession;

      const userInfos = prismaUserToAdapterUser(user);

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_Token,
        },
        user: { ...userInfos },
      };
    },

    async updateSession({
      sessionToken: sessionTokenToUpdate,
      userId: userIdToUpdate,
      expires: expiresToUpdate,
    }) {
      const {
        session_Token: sessionToken,
        user_id: userId,
        expires,
      } = await prisma.session.update({
        where: {
          session_Token: sessionTokenToUpdate,
        },
        data: {
          user_id: userIdToUpdate,
          expires: expiresToUpdate,
        },
      });

      return {
        sessionToken,
        userId,
        expires,
      };
    },
  };
};

export default PrismaAdapter;
