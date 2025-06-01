import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

// Плагіни
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

// Вхідні дати
const birthDate = dayjs("10.04.2025 12-35", "DD.MM.YYYY HH-mm"); // або new Date('2022-03-15T10:30:00')
const now = dayjs(); // сьогодні

// Обчислення компонентів
const years = now.diff(birthDate, "year");
const months = now.diff(birthDate.add(years, "year"), "month");
const days = now.diff(birthDate.add(years, "year").add(months, "month"), "day");
const hours = now.diff(
  birthDate.add(years, "year").add(months, "month").add(days, "day"),
  "hour"
);

// Форматований рядок
const resultBirthDate =
  `${years ? `${years} ${pluralize(years, "рік", "роки", "років")} ` : ""}` +
  `${months} ${pluralize(months, "місяць", "місяці", "місяців")} ` +
  `${days} ${pluralize(days, "день", "дні", "днів")} ` +
  `${hours} ${pluralize(hours, "година", "години", "годин")}`;

// Функція для множини
function pluralize(n: number, one: string, few: string, many: string): string {
  if (n % 10 === 1 && n % 100 !== 11) return one;
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return few;
  return many;
}

const START_CALCULATION_DATE = "02.05.2025";
const STANDART_DATE_FORMAT = "DD.MM.YYYY";

export { START_CALCULATION_DATE, STANDART_DATE_FORMAT, resultBirthDate };
