import { useMemo, useState } from "react";

import { useRouter } from "next/router";

import dayjs from "dayjs";
import { CaretLeft, CaretRight } from "phosphor-react";

import { api } from "@/lib/axios";
import getWeekDays from "@/utils/getWeekDays";
import { useQuery } from "@tanstack/react-query";

import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./styles";

interface CalendarWeekDay {
  date: dayjs.Dayjs;
  disabled: boolean;
}

interface CalendarProps {
  selectedDate?: Date;
  onDateSelected: (date: Date) => void;
}

interface BlockedWeekDays {
  blockedWeekDays: number[];
  blockedDates: number[];
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs();
  });

  const username = String(router.query.username);
  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const shortWeekDays = getWeekDays({ short: true });

  const monthAndYear = useMemo(() => {
    return {
      month: dayjs(selectedDate).get("month"),
      year: dayjs(selectedDate).get("year"),
    };
  }, [selectedDate]);

  const { data: blockedDates, status: blockedDatesStatusRequest } =
    useQuery<BlockedWeekDays>(["availability", monthAndYear], async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          month: monthAndYear.month + 1,
          year: monthAndYear.year,
        },
      });

      return response.data;
    });

  const isLoading = blockedDatesStatusRequest === "loading";

  const calendarWeeks = useMemo(() => {
    const daysInMonth = Array.from({ length: currentDate.daysInMonth() }).map(
      (_, index) => {
        return currentDate.set("date", index + 1);
      }
    );

    const firstWeekDay = daysInMonth[0].get("day");
    const lastWeekDay = daysInMonth[daysInMonth.length - 1].get("day");

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => {
        return currentDate.subtract(index + 1, "day");
      })
      .reverse();

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => {
      return currentDate.add(1, "month").add(index, "day");
    });

    const allDaysArray: CalendarWeekDay[] = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
      ...daysInMonth.map((date) => {
        return {
          date,
          disabled:
            date.endOf("day").isBefore(new Date()) ||
            !!blockedDates?.blockedWeekDays.includes(date.get("day")) ||
            !!blockedDates?.blockedDates.includes(date.get("date")),
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
    ];

    return allDaysArray.reduce(
      (resultArray: CalendarWeekDay[][], item, index) => {
        const chunkIndex = Math.floor(index / 7);

        if (!resultArray[chunkIndex]) {
          // eslint-disable-next-line no-param-reassign
          resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      },
      []
    );
  }, [blockedDates?.blockedDates, blockedDates?.blockedWeekDays, currentDate]);

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, "month");
    setCurrentDate(previousMonthDate);
  };

  const handleNextMonth = () => {
    const previousMonthDate = currentDate.add(1, "month");
    setCurrentDate(previousMonthDate);
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            type="submit"
            onClick={handlePreviousMonth}
            title="Previous month"
          >
            <CaretLeft />
          </button>
          <button type="submit" onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      {!isLoading && (
        <CalendarBody>
          <thead>
            <tr>
              {shortWeekDays.map((wd) => (
                <th key={wd}>{wd}.</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {calendarWeeks.map((week, weekIndex) => (
              <tr key={`week-${weekIndex + 1}`}>
                {week.map((weekDay) => (
                  <td key={weekDay.date.format("YYYY-MM-DD")}>
                    <CalendarDay
                      onClick={() => onDateSelected(weekDay.date.toDate())}
                      disabled={weekDay.disabled}
                    >
                      {weekDay.date.format("DD")}
                    </CalendarDay>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </CalendarBody>
      )}
    </CalendarContainer>
  );
}
