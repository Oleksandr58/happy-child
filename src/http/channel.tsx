import axios from "./axios";
import { channel } from "../types/channel";

export function getChannelAll() {
  return axios.get("/channels?limit=100000");
}

export function createChannel(data: channel) {
  const dataTransformed = {
    ...data,
    deleted: Boolean(data.deleted),
  };
  return axios.post("/channels", dataTransformed);
}

export function updateChannel(id: string, data: channel) {
  return axios.patch(`/channels/${id}`, data);
}

export function deleteChannel(id: string) {
  return axios.delete(`/channels/${id}`);
}
