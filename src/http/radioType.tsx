import axios from "./axios";
import { radioType } from "../types/radioType";

export function getRadioTypeAll() {
  return axios.get("/radio-types?limit=100000");
}

export function createRadioType(data: radioType) {
  return axios.post("/radio-types", data);
}

export function updateRadioType(id: string, data: radioType) {
  return axios.patch(`/radio-types/${id}`, data);
}

export function deleteRadioType(id: string) {
  return axios.delete(`/radio-types/${id}`);
}
