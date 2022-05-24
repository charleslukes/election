import { createContext, useContext } from "react";
import { useWallet } from "../hooks/useWallet";

const AppContext: any = createContext({});

export function AppWrapper({ children }: any) {
  const { getPools, connectWallet, walletData, polls, isConnected, address } = useWallet();

  return (
    <AppContext.Provider
      value={{
        getPools,
        connectWallet,
        walletData,
        polls,
        isConnected,
        address,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
