import React, { createContext, useContext, useEffect, useState } from "react";

interface CryptoContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  symbol: string;
}

const Crypto = createContext<CryptoContextType>({
  currency: "INR",
  setCurrency: () => {},
  symbol: "₹"
});

interface Props {
  children: React.ReactNode;
}

const CryptoContext = ({ children }: Props) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);
  return (
    <Crypto.Provider value={{ currency, setCurrency, symbol }}>
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};