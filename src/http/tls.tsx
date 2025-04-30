import axios from "./axios";
import { tls } from "../types/tls";

export function getTLSAll() {
  return axios.get("/encryptions?limit=100000");
}

export function createTLS(data: tls) {
  return axios.post("/encryptions", data);
}

export function updateTLS(id: string, data: tls) {
  return axios.patch(`/encryptions/${id}`, data);
}

export function deleteTLS(id: string) {
  return axios.delete(`/encryptions/${id}`);
}
