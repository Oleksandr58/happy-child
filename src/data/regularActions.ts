import { action } from "../types/action";

const washEyes = {
  id: "washEyes",
  types: ["щоранку"],
  name: "Вмивання очей",
  period: 1,
  startDate: "02.05.2025",
};

const washFullBody = {
  id: "washFullBody",
  types: ["раз в 2 дні"],
  name: "Купання",
  period: 2,
  startDate: "02.05.2025",
};

const vitamidD = {
  id: "vitamidD",
  types: ["щоранку"],
  name: "Вітамін Д",
  period: 1,
  startDate: "02.05.2025",
};

const vitamidK = {
  id: "vitamidK",
  types: ["щоп'ятниці"],
  name: "Вітамін К",
  period: 7,
  startDate: "02.05.2025",
};

const bakteriiaVitamin = {
  id: "bakteriiaVitamin",
  types: ["щоранку"],
  name: "Дати вітамінки з бактеріями для пузіка",
  period: 1,
  startDate: "08.05.2025",
};

const training = {
  id: "training",
  types: ["щоранку"],
  name: "Зарядка",
  period: 1,
  startDate: "02.05.2025",
};

const swapBelly = {
  id: "swapBelly",
  types: ["щоранку", "в обід", "щовечора"],
  name: "Перевертання на пузіко",
  period: 1,
  startDate: "02.05.2025",
};

const manageBelly = {
  id: "manageBelly",
  types: ["щоранку", "щовечора"],
  name: "Обробити пупчик",
  period: 1,
  startDate: "02.05.2025",
};

const cleanNose = {
  id: "cleanNose",
  types: ["щоранку"],
  name: "Промивання носика",
  period: 1,
  startDate: "02.05.2025",
};

const walking = {
  id: "walking",
  types: ["щовечора"],
  name: "Прогулянка",
  period: 1,
  startDate: "02.05.2025",
};

const REGULAR_ACTIONS: action[] = [
  washEyes,
  washFullBody,
  vitamidD,
  vitamidK,
  bakteriiaVitamin,
  training,
  swapBelly,
  manageBelly,
  cleanNose,
  walking,
];

export default REGULAR_ACTIONS;
