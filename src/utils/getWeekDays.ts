interface GetWeekDaysParams {
  short?: boolean;
}

const getWeekDays = ({ short = false }: GetWeekDaysParams = {}) => {
  const formatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

  return Array.from(Array(7).keys())
    .map((key) => formatter.format(new Date(Date.UTC(2021, 5, key))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase();
      }

      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1));
    });
};

export default getWeekDays;
