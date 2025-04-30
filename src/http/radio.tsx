import axios from "./axios";
import { radio } from "../types/radio";

export function getRadioAll() {
  return axios.get("/radios?limit=100000");
}

export function createRadio(data: radio) {
  return axios.post("/radios", { ...data, firmwares: [] });
}

export function updateRadio(id: string, data: radio) {
  return axios.patch(`/radios/${id}`, data);
}

export function deleteRadio(id: string) {
  return axios.delete(`/radios/${id}`);
}
