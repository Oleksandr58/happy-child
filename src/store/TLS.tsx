import * as React from "react";
import { getTLSAll } from "../http";
import { tls } from "../types/tls";

interface ArgsContext {
  tlss: tls[];
  getTlss: () => void;
  setTlsId: (id: string | null) => void;
  tls?: tls;
}

const TLSContext = React.createContext<ArgsContext>({
  tlss: [],
  getTlss: () => {},
  setTlsId: () => {},
});

interface Args {
  children: React.ReactElement;
}

function TLSProvider({ children }: Args) {
  const [tlss, setTlss] = React.useState<tls[]>([]);
  const [tlsId, setTlsId] = React.useState<string | null>(null);

  const getTlss = async () => {
    const { data } = await getTLSAll();
    setTlss(data);
  };

  const tls = tlss?.data?.find(({ id }) => tlsId === id);

  const value = { tlss, getTlss, setTlsId, tls };

  return <TLSContext.Provider value={value}>{children}</TLSContext.Provider>;
}

function useTLSContext() {
  const context = React.useContext(TLSContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a TLSProvider");
  }

  return context;
}

export { TLSProvider, useTLSContext };
