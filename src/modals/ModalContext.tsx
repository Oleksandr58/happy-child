import * as React from "react";

interface ArgsContext {
  openedModalsKeys: string[];
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
}

const modalContext = React.createContext<ArgsContext>({
  openedModalsKeys: [],
  openModal: (key) => {
    console.log(key);
  },
  closeModal: (key) => {
    console.log(key);
  },
});

interface Args {
  children: React.ReactElement;
}

function ModalProvider({ children }: Args) {
  const [openedModalsKeys, setOpenedModalsKeys] = React.useState<string[]>([]);

  const openModal = React.useCallback(
    (key: string) => {
      setOpenedModalsKeys([...openedModalsKeys, key]);
    },
    [openedModalsKeys]
  );

  const closeModal = React.useCallback(
    (key: string) => {
      setOpenedModalsKeys(
        openedModalsKeys.filter((modalKey) => modalKey !== key)
      );
    },
    [openedModalsKeys]
  );

  const value = { openedModalsKeys, openModal, closeModal };

  return (
    <modalContext.Provider value={value}>{children}</modalContext.Provider>
  );
}

function useModalContext() {
  const context = React.useContext(modalContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }

  return context;
}

export { ModalProvider, useModalContext };
