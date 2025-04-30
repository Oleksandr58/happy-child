import { key } from "./Key";

interface channel {
  id?: string;
  name: string;
  notes?: string;
  isRepeater: boolean;
  RX: number;
  TX: number;
  key: string | key;
  deleted?: boolean;
}

export { type channel };
