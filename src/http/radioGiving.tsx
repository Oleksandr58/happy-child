import axios from "./axios";
import { radioGiving } from "../types/radioGiving";

export function createRadioGiving(data: radioGiving) {
  return axios.post("/persons", data);
}

export function deleteRadioGiving(id: string) {
  return axios.delete(`/persons/${id}`);
}
