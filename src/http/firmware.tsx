import axios from "./axios";
import { firmware } from "../types/firmware";

export function getFirmwareAll() {
  return axios.get("/firmwares?limit=100000");
}

export function getFirmware(id: string) {
  return axios.get(`/firmwares/${id}`);
}

export function createFirmware(data: firmware) {
  return axios.post("/firmwares", data);
}

export function updateFirmware(id: string, data: firmware) {
  return axios.patch(`/firmwares/${id}`, data);
}

export function deleteFirmware(id: string) {
  return axios.delete(`/firmwares/${id}`);
}
