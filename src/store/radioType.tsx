import * as React from "react";
import { getRadioTypeAll } from "../http";
import { radioType } from "../types/radioType";

interface ArgsContext {
  radioTypes: radioType[];
  getRadioTypes: () => void;
  setRadioTypeId: (id: string | null) => void;
  radioType?: radioType;
}

const RadioTypeContext = React.createContext<ArgsContext>({
  radioTypes: [],
  getRadioTypes: () => {},
  setRadioTypeId: () => {},
});

interface Args {
  children: React.ReactElement;
}

function RadioTypeProvider({ children }: Args) {
  const [radioTypes, setRadioTypes] = React.useState<radioType[]>([]);
  const [radioTypeId, setRadioTypeId] = React.useState<string | null>(null);

  const getRadioTypes = async () => {
    const { data } = await getRadioTypeAll();
    setRadioTypes(data);
  };

  const radioType = radioTypes?.data?.find(({ id }) => radioTypeId === id);

  const value = { radioTypes, getRadioTypes, setRadioTypeId, radioType };

  return (
    <RadioTypeContext.Provider value={value}>
      {children}
    </RadioTypeContext.Provider>
  );
}

function useRadioTypeContext() {
  const context = React.useContext(RadioTypeContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a RadioTypeProvider");
  }

  return context;
}

export { RadioTypeProvider, useRadioTypeContext };
