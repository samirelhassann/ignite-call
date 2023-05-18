/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const username = String(req.query.username);

  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: "Date not provided" });
  }

  const formatedMonth = month.toString().padStart(2, "0");

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  });

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (weekday) =>
      !availableWeekDays.some((available) => available.week_day === weekday)
  );

  const blockedDatedRaw: { date: number }[] = await prisma.$queryRaw`
    SELECT 
      EXTRACT(DAY from sc.date) AS date,
      COUNT(sc.date) AS amount,
      ((ut.time_end_in_minutes - ut.time_start_in_minutes) / 60) AS size

    FROM schedulings sc

    LEFT JOIN user_time_intervals ut
      ON ut.week_day = WEEKDAY(DATE_ADD(sc.date, INTERVAL 1 DAY))

    WHERE sc.user_id = ${user.id}
      AND DATE_FORMAT(sc.date, "%Y-%m") = ${`${year}-${formatedMonth}`}

    GROUP BY EXTRACT(DAY from sc.date),
      ((ut.time_end_in_minutes - ut.time_start_in_minutes) / 60)

    HAVING amount >= size 
  `;

  const blockedDates = blockedDatedRaw.map((blocked) => blocked.date);

  return res.json({ blockedWeekDays, blockedDates });
}
