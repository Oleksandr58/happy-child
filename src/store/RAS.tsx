import * as React from "react";
import { getRASAll } from "../http";
import { ras } from "../types/ras";

interface ArgsContext {
  rass: ras[];
  getRass: () => void;
  setRasId: (id: string | null) => void;
  ras?: ras;
}

const RASContext = React.createContext<ArgsContext>({
  rass: [],
  getRass: () => {},
  setRasId: () => {},
});

interface Args {
  children: React.ReactElement;
}

function RASProvider({ children }: Args) {
  const [rass, setRass] = React.useState<ras[]>([]);
  const [rasId, setRasId] = React.useState<string | null>(null);

  const getRass = async () => {
    const { data } = await getRASAll();
    setRass(data);
  };

  const ras = rass?.data?.find(({ id }) => rasId === id);

  const value = { rass, getRass, setRasId, ras };

  return <RASContext.Provider value={value}>{children}</RASContext.Provider>;
}

function useRASContext() {
  const context = React.useContext(RASContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a RASProvider");
  }

  return context;
}

export { RASProvider, useRASContext };
