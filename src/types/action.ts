import { Dayjs } from "dayjs";

interface action {
  id: string,
  types?: string[],
  name: string,
  period: number,
  startDate?: string,
}

interface actionView {
  id: string,
  name: string,
  isChecked: boolean,
}

interface actionsArrItem {
  date: Dayjs,
  actions: actionView[],
}

export { type action, type actionView, type actionsArrItem };
