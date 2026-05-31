"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { createContext, PropsWithChildren, useContext } from "react";

interface PrivacyContextType {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: PropsWithChildren) {
  const { storedValue: isPrivacyMode, setValue: setIsPrivacyMode } =
    useLocalStorage<boolean>(
      "privacyMode",
      true, // Default: privacy ACTIVATED (values hidden)
    );

  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => !prev);
  };

  return (
    <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error("usePrivacy must be used within a PrivacyProvider");
  }
  return context;
}
