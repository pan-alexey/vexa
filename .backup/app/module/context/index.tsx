import React from "react";

export const $context = [];

export const MainContext: React.FC<{children: React.ReactNode}> = ({children}) => {
  return <>{children}</>
}