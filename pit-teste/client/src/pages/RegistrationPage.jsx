import React, { useState } from "react";
import Onboarding from "./Onboarding"; // Importe a primeira página
import VerificationForm from "./Verification"; // Importe a segunda página
import PetRegister from "./PetRegister"; // Importe a terceira página

const RegistrationPage = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="registration-page">
      {step === 1 && <Onboarding nextStep={nextStep} />}
      {step === 2 && <VerificationForm nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <PetRegister prevStep={prevStep} />}
    </div>
  );
};

export default RegistrationPage;
