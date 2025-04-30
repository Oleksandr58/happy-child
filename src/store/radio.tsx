import * as React from "react";
import { getRadioAll, getFirmware } from "../http";
import { radio } from "../types/radio";
import { firmware } from "../types/firmware";

interface ArgsContext {
  radios: radio[];
  getRadios: () => void;
  setRadioId: (id: string | null) => void;
  radio?: radio;
  storeFirmwareCache: (id: string | null) => void;
  setIsRewriteFirmware: (isRewrite: boolean) => void;
  isRewriteFirmware: boolean;
  firmwareCache: firmware | null;
}

const RadioContext = React.createContext<ArgsContext>({
  radios: [],
  getRadios: () => {},
  setRadioId: () => {},
  storeFirmwareCache: () => {},
  setIsRewriteFirmware: () => {},
  isRewriteFirmware: false,
  firmwareCache: null,
});

interface Args {
  children: React.ReactElement;
}

function RadioProvider({ children }: Args) {
  const [radios, setRadios] = React.useState<radio[]>([]);
  const [firmwareCache, setFirmwareCache] = React.useState<firmware | null>(
    null
  );
  const [firmwareCacheId, setFirmwareCacheId] = React.useState<string | null>(
    null
  );
  const [radioId, setRadioId] = React.useState<string | null>(null);
  const [isRewriteFirmware, setIsRewriteFirmware] = React.useState(false);

  const storeFirmwareCache = (id: string) => {
    localStorage.setItem("firmwareId", id);
    setFirmwareCacheId(id);
  };

  const getCachedFirmware = async () => {
    const firmwareId = localStorage.getItem("firmwareId");

    if (firmwareId) {
      setFirmwareCacheId(firmwareId);
      const firmware = await getFirmware(firmwareId);

      setFirmwareCache(firmware.data.data);
    } else if (firmwareCache) {
      setFirmwareCache(null);
    }
  };

  React.useEffect(() => {
    getCachedFirmware();
  }, [firmwareCacheId]);

  const getRadios = async () => {
    const { data } = await getRadioAll();
    setRadios(data);
  };

  const radio = radios?.data?.find(({ id }) => radioId === id);
  const radioTransformed = {
    ...radio,
    type: radio?.type?.id,
    organism: radio?.organism?.id,
  };

  const value = {
    radios,
    getRadios,
    setRadioId,
    radio: radioTransformed,
    storeFirmwareCache,
    setIsRewriteFirmware,
    isRewriteFirmware,
    firmwareCache,
  };

  return (
    <RadioContext.Provider value={value}>{children}</RadioContext.Provider>
  );
}

function useRadioContext() {
  const context = React.useContext(RadioContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a RadioProvider");
  }

  return context;
}

export { RadioProvider, useRadioContext };
