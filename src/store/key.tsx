import * as React from "react";
import { getKeyAll } from "../http";
import { key } from "../types/Key";

interface ArgsContext {
  keys: key[];
  getKeys: () => void;
  setKeyId: (id: string | null) => void;
  key?: key;
}

const KeyContext = React.createContext<ArgsContext>({
  keys: [],
  getKeys: () => {},
  setKeyId: () => {},
});

interface Args {
  children: React.ReactElement;
}

function KeyProvider({ children }: Args) {
  const [keys, setKeys] = React.useState<key[]>([]);
  const [keyId, setKeyId] = React.useState<string | null>(null);

  const getKeys = async () => {
    const { data } = await getKeyAll();
    setKeys(data);
  };

  const key = keys?.data?.find(({ id }) => keyId === id);

  const value = { keys, getKeys, setKeyId, key };

  return <KeyContext.Provider value={value}>{children}</KeyContext.Provider>;
}

function useKeyContext() {
  const context = React.useContext(KeyContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a KeyProvider");
  }

  return context;
}

export { KeyProvider, useKeyContext };
