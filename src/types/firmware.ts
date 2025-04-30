import { tls } from "./tls";
import { channel } from "./channel";
import { radio } from "./radio";

interface firmware {
  firmwareId?: string;
  idOnRadio: string;
  isChild: boolean;
  isMain: boolean;
  isScan: boolean;
  firmwareVersion: string;
  lastFirmware?: string;
  updates?: string[];
  radio?: string | radio;
  encryption?: string | tls;
  channels?: string[] | channel[];
}

export { type firmware };
