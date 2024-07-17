import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// locals
import App from "./App.tsx";
import "./index.css";

// contexts
import { SocketProvider } from "./contexts/socketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </StrictMode>
);
