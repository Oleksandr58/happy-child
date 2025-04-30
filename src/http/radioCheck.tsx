import axios from "./axios";
import { radioCheck } from "../types/radioCheck";

export function createCheck(data: radioCheck) {
  const dataTransformed = {
    ...data,
    isSuccess: Boolean(data.isSuccess),
  };
  return axios.post("/checks", dataTransformed);
}
