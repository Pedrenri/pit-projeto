import React from 'react';


const VerificationModal = () => {
  return (
    <div className="modal-wrapper">
      <div className="modal-content">
        <h2>Verificação de E-mail</h2>
        <p>Por favor, insira seu endereço de e-mail para continuar:</p>
        <input type="email" placeholder="Digite seu e-mail" />
      </div>
    </div>
  );
};

export default VerificationModal;
