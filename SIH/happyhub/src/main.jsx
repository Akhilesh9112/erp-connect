import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ⬅️ import AuthProvider
import { ChakraProvider } from '@chakra-ui/react';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>   {/* ⬅️ wrap your whole app */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
