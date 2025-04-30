import axios from "./axios";
import { ras } from "../types/ras";

export function getRASAll() {
  return axios.get("/ras?limit=100000");
}

export function createRAS(data: ras) {
  return axios.post("/ras", data);
}

export function updateRAS(id: string, data: ras) {
  return axios.patch(`/ras/${id}`, data);
}

export function deleteRAS(id: string) {
  return axios.delete(`/ras/${id}`);
}
