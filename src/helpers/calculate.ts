import dayjs from "dayjs";
import ACTIONS from "../data/actions";
import { getIsCheckAction } from "./store";

const STANDART_DATE_FORMAT = "DD.MM.YYYY";

const getActionsArrFromOBj = (action, date) => {
  const arr = [];

  if (action.types) {
    for (let index = 0; index < action.types.length; index++) {
      const element = action.types[index];

      arr.push({
        name: `${action.name} ${element}`,
        id: `${action.id}-${index}`,
        isChecked: getIsCheckAction(
          `${date.format("DD.MM.YYYY")}-${action.id}-${index}`
        ),
      });
    }
  } else {
    arr.push({
      name: `${action.name}`,
      id: `${action.id}`,
      isChecked: getIsCheckAction(`${date.format("DD.MM.YYYY")}-${action.id}`),
    });
  }

  return arr;
};

const getActionsForDate = (date) => {
  let actions = [];

  for (let index = 0; index < ACTIONS.length; index++) {
    const element = ACTIONS[index];

    if (
      dayjs(element.startDate, STANDART_DATE_FORMAT).diff(date, "day") %
        element.period ===
      0
    ) {
      actions = [...actions, ...getActionsArrFromOBj(element, date)];
    }
  }

  return {
    date,
    actions,
  };
};

const getActionsForDates = (dateStart, dateEnd) => {
  let dateCalculateDayjs = dayjs(dateStart, STANDART_DATE_FORMAT);
  const dateEndDayjs = dayjs(dateEnd, STANDART_DATE_FORMAT);
  const actionsArr = [];

  while (
    dateCalculateDayjs.isBefore(dateEndDayjs) ||
    dateCalculateDayjs.isSame(dateEndDayjs)
  ) {
    actionsArr.push(getActionsForDate(dateCalculateDayjs));

    dateCalculateDayjs = dateCalculateDayjs.add(1, "day");
  }

  return actionsArr;
};

export { getActionsForDate, getActionsForDates };
export default {};
