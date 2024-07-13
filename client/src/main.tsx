import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// locals
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
