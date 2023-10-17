import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function VerificationForm() {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [cookies] = useCookies(["userId"]);
  const navigate = useNavigate();
  const userId = cookies.userId;

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleInputChange = (index, value) => {
    const updatedCode = [...verificationCode];
    updatedCode[index] = value;
    setVerificationCode(updatedCode);

    if (value.length === 0 && index > 0) {
      // Se o usuário deletar um caractere e não for o primeiro input
      inputRefs[index - 1].current.focus(); // Foca no input anterior
    } else if (value.length === 1 && index < inputRefs.length - 1) {
      // Se um caractere for digitado e não for o último input
      inputRefs[index + 1].current.focus(); // Foca no próximo input
    }
  };

  const handleVerification = async () => {
    const code = verificationCode.join("");

    try {
      const response = await axios.post("http://44.204.7.86/verification", {
        verificationCode: code,
        userId,
      });
      setMessage(response.data.message);

      if (response.data.message === "Código de verificação correto!") {
        navigate("/petreg");
      }
    } catch (error) {
      setMessage("Erro ao verificar o código de verificação.");
    }
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData("text");
      const pastedChars = pastedText.slice(0, 6).split("");

      if (pastedChars.length === 6) {
        setVerificationCode(pastedChars);
        e.preventDefault();
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="verification">
      <motion.div className="input-holder w-11/12 md:w-1/2 lg:w-1/4" initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", duration: 0.5 }}>
        <h1>Verificar Email</h1>
        <div className="verification-code-inputs">
          {verificationCode.map((char, index) => (
            <input
              key={index}
              type="text"
              value={char}
              onChange={(e) => handleInputChange(index, e.target.value)}
              maxLength={1}
              ref={inputRefs[index]}
            />
          ))}
        </div>
        <motion.button
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
          transition={{ ease: "easeInOut" }}
          onClick={handleVerification}
        >
          Verificar
        </motion.button>
        <p>{message}</p>
      </motion.div>
    </div>
  );
}

export default VerificationForm;
