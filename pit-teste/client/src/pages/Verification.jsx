import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function VerificationForm() {
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [cookies] = useCookies(["userId"]);
  const navigate = useNavigate();
  const userId = cookies.UserId;
  console.log(verificationCode);

  const handleVerification = async () => {
    try {
      const response = await axios.post("http://localhost:8000/verification", {
        verificationCode,
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

  return (
    <div className="verification">
      <div className="input-holder w-11/12 md:w-1/2 lg:w-1/4">
        <h1>Verificar Email</h1>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Insira o código de verificação!"
        />
        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
          transition={{ ease: "easeInOut" }}
          onClick={handleVerification}
        >
          Verificar
        </motion.button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default VerificationForm;
