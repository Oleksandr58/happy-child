import axios from "./axios";

export function exportDB() {
  return axios.get("/export", {timeout: 60000});
}

export function importDB(data) {
  return axios.post("/import", data, {timeout: 60000});
}
