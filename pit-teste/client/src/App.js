import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCookies } from "react-cookie";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import PetRegister from "./pages/PetRegister";
import VerificationForm from "./pages/Verification";
import MyPetsPage from "./pages/MyPetsPage";
import LoadingAnimation from "./components/LoadingAnimation"; // Importando o componente de animação de carregamento

const App = () => {
  const [cookies] = useCookies(["user"]);
  const authToken = cookies.AuthToken;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando um tempo de carregamento (você pode substituir isso pela sua própria lógica)
    setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Tempo de carregamento simulado de 2 segundos
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingAnimation />}{" "}
        {/* Renderizando a animação de carregamento enquanto estiver carregando */}
        {!isLoading && (
          <Routes>
            <Route path="/" element={<Home />} />
            {authToken && <Route path="/dashboard" element={<Dashboard />} />}
            {authToken && <Route path="/mypets" element={<MyPetsPage />} />}
            {authToken && <Route path="/onboarding" element={<Onboarding />} />}
            {authToken && (
              <Route path="/verification" element={<VerificationForm />} />
            )}
            {authToken && <Route path="/petreg" element={<PetRegister />} />}
          </Routes>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
};

export default App;
