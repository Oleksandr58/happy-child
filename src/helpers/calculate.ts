import dayjs, { Dayjs } from "dayjs";
import ACTIONS from "../data/actions";
import { getIsCheckAction } from "./store";
import { action, actionView, actionsArrItem } from '../types/action';
import { STANDART_DATE_FORMAT } from '../helpers/date'


const createIdFromAction = (date: Dayjs, action: actionView | action, index?: number) => {
  let id = `${date.format(STANDART_DATE_FORMAT)}-${action.id}`;

  if (index !== undefined) {
    id = `${id}-${index}`;
  }

  return id;
};

const getActionsArrFromOBj = (action: action, date: Dayjs): actionView[] => {
  const arr: actionView[] = [];

  if (action.types) {
    for (let index = 0; index < action.types.length; index++) {
      const id = createIdFromAction(date, action, index);
      const element = action.types[index];

      arr.push({
        name: `${action.name} ${element}`,
        id,
        isChecked: getIsCheckAction(
          id
        ),
      });
    }
  } else {
    const id = createIdFromAction(date, action);
    arr.push({
      name: `${action.name}`,
      id,
      isChecked: getIsCheckAction(id),
    });
  }

  return arr;
};

const getActionsForDate = (date: Dayjs) => {
  let actions: actionView[] = [];

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

const getActionsForDates = (dateStart: string, dateEnd: string): actionsArrItem[] => {
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

export { getActionsForDate, getActionsForDates, createIdFromAction };
export default {};
