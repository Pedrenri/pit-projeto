import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthModal = ({ setShowModal, setIsSignUp, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  let navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };

  const changeModal = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Passwords need to match!");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
        { email, password }
      );

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);

      console.log(response.data.userId);

      const success = response.status === 201;
      
      if (success && isSignUp) navigate("/onboarding");
      if (success && !isSignUp) navigate("/dashboard");

      window.location.reload();

      window.location.reload();
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  return (
    <motion.div
      key="modal"
      initial={{ y: 500 }}
      animate={{ y: 0 }}
      exit={{ y: 500 }}
      className="authmodal h-4/5 xl:h-2/3 top-24 xl:top-48"
    >
      <div className="close-icon float-right" onClick={handleClick}>
        ⓧ
      </div>
      <h2>{isSignUp ? "Criar Conta" : "Login"}</h2>
      <p className="py-5">
        Ao clicar em Enviar, você aceita nossos termos. Veja comos cuidamos de
        seus dados em nossa Política de Privacidade e Política de Cookies.
      </p>
      <form className="flex flex-col" action="" onSubmit={handleSubmit}>
        <input
          type={isSignUp?"email":"text"}
          id="email"
          name="email"
          placeholder={isSignUp?"Email":"Email ou Nome de Usuário"}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Senha"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="Confirme sua senha"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <input className="secondary-button" type="submit" />
      </form>
      <hr />
      {isSignUp && (
        <p className="pt-2">
          Já tem uma conta?{" "}
          <a href="#" className="text-sky-600 underline" onClick={changeModal}>
            Faça Login!
          </a>
        </p>
      )}
      {!isSignUp && (
        <>
          <p className="pt-2 mb-2">
            Não tem uma conta?{" "}
            <a
              href="#"
              className="text-sky-600 underline"
              onClick={changeModal}
            >
              Cadastre-se!
            </a>
          </p>
          <a href="#" className="text-purple-600	 underline">
            Esqueceu sua senha?
          </a>

        </>
      )}
      <p className="text-red-600 pt-5">{error}</p>
    </motion.div>
  );
};

export default AuthModal;
