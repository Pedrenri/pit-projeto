import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookies } from 'react-cookie';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import PetRegister from './pages/PetRegister';
import VerificationForm from './pages/Verification';

const AnimatedRoutes = () => {
  const [cookies] = useCookies(['user']);
  const authToken = cookies.AuthToken;

  return (
    <AnimatePresence mode='sync'>
      <Routes>
        <Route path="/" element={<Home />} />
        {authToken && (
          <Route path="/dashboard" element={<Dashboard />} />
        )}
        {authToken && (
          <Route path="/onboarding" element={<Onboarding />} />
        )}
        {authToken && (
          <Route path="/verification" element={<VerificationForm />} />
        )}
        {authToken && (
          <Route path="/petreg" element={<PetRegister />} />
        )}
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default App;