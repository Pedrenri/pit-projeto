import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function VerificationForm() {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [cookies] = useCookies(['userId']);
  const navigate = useNavigate();
  const userId = cookies.UserId;
  console.log(verificationCode)

  const handleVerification = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/verification',
        { verificationCode, userId }
      );
      setMessage(response.data.message);

      if (response.data.message === 'Código de verificação correto!') {
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage('Erro ao verificar o código de verificação.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerification}>Verificar</button>
      <p>{message}</p>
    </div>
  );
}

export default VerificationForm;
