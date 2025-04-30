import TLS from "./TLS";
import Channel from "./channel";
import Key from "./key";
import RAS from "./RAS";
import RadioType from "./radioType";
import Organism from "./organism";
import Firmware from "./firmware";
import Radio from "./radio";
import RadioCheck from "./radioCheck";
import RadioGiving from "./radioGiving";
import { ModalProvider, useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";

export default function Modals() {
  return (
    <>
      <Radio />
      <Firmware />
      <Key />
      <RAS />
      <TLS />
      <RadioType />
      <Organism />
      <Channel />
      <RadioCheck />
      <RadioGiving />
    </>
  );
}

export { ModalProvider, useModalContext, MODAL_KEYS };
