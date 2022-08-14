import React from "react";
import { hydrate } from "react-dom";
import { createRoot } from "react-dom/client";

const App: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <div>
      <div>App.</div>
      <div>clidren:</div>
      <div>{children}</div>
    </div>
  );
};

(async () => {
  const container = document.getElementById("root");
  if (!container) {
    return "";
  }
  if (container.hasChildNodes()) {
    console.log("hydrate");
    hydrate(<App>123</App>, container);
  } else {
    console.log("render");
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    root.render(<App />);
  }
})();
