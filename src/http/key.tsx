import axios from "./axios";
import { key } from "../types/Key";

export function getKeyAll() {
  return axios.get("/keys?limit=100000");
}

export function createKey(data: key) {
  return axios.post("/keys", data);
}

export function updateKey(id: string, data: key) {
  return axios.patch(`/keys/${id}`, data);
}

export function deleteKey(id: string) {
  return axios.delete(`/keys/${id}`);
}
