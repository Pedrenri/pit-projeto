import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function VerificationForm() {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [cookies] = useCookies(["userId"]);
  const navigate = useNavigate();
  const userId = cookies.UserId;

  const handleVerification = async () => {
    const code = verificationCode.join(""); // Combine os 6 caracteres em um único código

    try {
      const response = await axios.post("http://localhost:8000/verification", {
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

  const handleInputChange = (index, value) => {
    const updatedCode = [...verificationCode];
    updatedCode[index] = value;
    setVerificationCode(updatedCode);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData("text");
      const pastedChars = pastedText.slice(0, 6).split("");

      if (pastedChars.length === 6) {
        setVerificationCode(pastedChars);
        e.preventDefault(); // Impede a colagem padrão
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="verification">
      <motion.div className="input-holder w-11/12 md:w-1/2 lg:w-1/4" initial={{ x: "100%" }} // Posição inicial fora da tela
        animate={{ x: 0 }} // Posição final na tela
        exit={{ x: "-100%" }} // Posição ao sair da tela
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
