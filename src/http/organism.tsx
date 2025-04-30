import axios from "./axios";
import { organism } from "../types/organism";

export function getOrganismAll() {
  return axios.get("/organisms?limit=100000");
}

export function createOrganism(data: organism) {
  return axios.post("/organisms", data);
}

export function updateOrganism(id: string, data: organism) {
  return axios.patch(`/organisms/${id}`, data);
}

export function deleteOrganism(id: string) {
  return axios.delete(`/organisms/${id}`);
}
