/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";

import dayjs from "dayjs";
import { google } from "googleapis";
import { z } from "zod";

import { getGoogleOAuthToken } from "@/lib/google";
import { prisma } from "@/lib/prisma";

const schedulleBodySchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  email: z
    .string({
      required_error: "email is required",
    })
    .email(),
  observations: z.string(),
  date: z
    .string({
      required_error: "date is required",
    })
    .datetime(),
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const username = String(req.query.username);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const { name, email, observations, date } = schedulleBodySchema.parse(
    req.body
  );

  const schedulingDate = dayjs(date).startOf("hour");

  if (schedulingDate.isBefore(dayjs())) {
    return res.status(400).json({ message: "Invalid date" });
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      date: schedulingDate.toDate(),
    },
  });

  if (conflictingScheduling) {
    return res
      .status(400)
      .json({ message: "There is another scheduling in the same time" });
  }

  const { id: createdShedulledId } = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  });

  const calendar = google.calendar({
    version: "v3",
    auth: await getGoogleOAuthToken(user.id),
  });

  await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call - ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, "hour").format(),
      },
      attendees: [
        {
          email,
          displayName: name,
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: createdShedulledId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  return res.status(201).end();
}
