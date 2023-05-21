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

  console.log(email, password, confirmPassword);

  const handleClick = () => {
    setShowModal(false);
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

      window.location.reload()

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(password, email, confirmPassword);

  return (
    <motion.div
      key="modal"
      initial={{ y: 500 }}
      animate={{ y: 0 }}
      exit={{ y: 500 }}
      className="authmodal h-4/5 xl:h-1/2 top-24 xl:top-52"
    >
      <div className="close-icon float-right" onClick={handleClick}>
        ⓧ
      </div>
      <h2>{isSignUp ? "Criar Conta" : "Log In"}</h2>
      <p>
      Ao clicar em LogIn, você aceita nossos termos. Veja comos cuidamos de seus dados em nossa Política de Privacidade e Política de Cookies.
      </p>
      <form className="flex flex-col" action="" onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
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
      <p>{error}</p>
    </motion.div>
  );
};

export default AuthModal;
