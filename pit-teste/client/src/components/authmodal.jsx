import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthModal = ({ setShowModal, setIsSignUp, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [passwordStrength, setPasswordStrength] = useState("");

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
        setError("As senhas precisam ser iguais!");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
        { email, password }
      );

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);
      const hasUsername = response.data.userName;
      const isVerified = response.data.isVerified;

      const success = response.status === 201;

      if ((success && isSignUp) || (success && !isSignUp && !hasUsername))
        navigate("/onboarding");
      if (success && !isSignUp && hasUsername) navigate("/mypets");
      if (success && !isVerified && !isSignUp) navigate("/verification");

      window.location.reload();
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Verificação da força da senha em tempo real
    if (value.length < 6) {
      setPasswordStrength("Senha Fraca");
    } else if (value === email) {
      setPasswordStrength("Senha Inválida!");
    } else {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]+$/;
      if (passwordRegex.test(value)) {
        setPasswordStrength("Senha Forte");
      } else {
        setPasswordStrength("Senha Mediana");
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post("http://localhost:8000/forgot-password", { email });
      window.alert(
        "Um email de redefinição de senha foi enviado para o seu endereço de email!"
      );
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ y: 500, opacity: 0.7 }}
        animate={{ y: setShowModal ? 0 : 500, opacity: 1 }}
        exit={{ y: 500, opacity: 0 }}
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
            type={isSignUp ? "email" : "text"}
            id="email"
            name="email"
            placeholder={isSignUp ? "Email" : "Email ou Nome de Usuário"}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Senha"
            required
            onChange={handlePasswordChange}
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
            <a
              href="#"
              className="text-sky-600 underline"
              onClick={changeModal}
            >
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
            <a
              href="#"
              className="text-purple-600 underline"
              onClick={handleForgotPassword}
            >
              Esqueceu sua senha?
            </a>
          </>
        )}
        <p className="text-red-600 pt-5">{error}</p>
        {isSignUp && (
          <p
            className={
              passwordStrength === "Senha Fraca"
                ? "text-red-600 pt-5"
                : passwordStrength === "Senha Mediana"
                ? "text-yellow-600 pt-5"
                : passwordStrength === "Senha Forte"
                ? "text-green-600 pt-5"
                : "hidden"
            }
          >
            {passwordStrength}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
