import React, { createContext, useState, useContext } from "react";

const FormContext = createContext();

export const modes = {
  VIEW: "view",
  EDIT: "edit",
  ADD: "add",
  INFO: "info",
};

export const useMode = () => useContext(FormContext);

export const ModeProvider = ({ children }) => {
  const [mode, setmode] = useState(modes.VIEW);
  return (
    <FormContext.Provider value={[mode, setmode]}>
      {children}
    </FormContext.Provider>
  );
};
