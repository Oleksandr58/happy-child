import * as React from "react";
import { getOrganismAll } from "../http";
import { organism } from "../types/organism";

interface ArgsContext {
  organisms: organism[];
  getOrganisms: () => void;
  setOrganismId: (id: string | null) => void;
  organism?: organism;
}

const OrganismContext = React.createContext<ArgsContext>({
  organisms: [],
  getOrganisms: () => {},
  setOrganismId: () => {},
});

interface Args {
  children: React.ReactElement;
}

function OrganismProvider({ children }: Args) {
  const [organisms, setOrganisms] = React.useState<organism[]>([]);
  const [organismId, setOrganismId] = React.useState<string | null>(null);

  const getOrganisms = async () => {
    const { data } = await getOrganismAll();
    setOrganisms(data);
  };

  const organism = organisms?.data?.find(({ id }) => organismId === id);

  const value = { organisms, getOrganisms, setOrganismId, organism };

  return (
    <OrganismContext.Provider value={value}>
      {children}
    </OrganismContext.Provider>
  );
}

function useOrganismContext() {
  const context = React.useContext(OrganismContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a OrganismProvider");
  }

  return context;
}

export { OrganismProvider, useOrganismContext };
