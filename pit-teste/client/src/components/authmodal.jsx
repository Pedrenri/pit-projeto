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
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  let navigate = useNavigate();

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
        {
          email,
          password,
        }
      );

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);

      const success = response.status === 201;

      if (success && isSignUp) navigate("/onboarding");
      if (success && !isSignUp) navigate("/dashboard");
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
      exit={{ opacity: 0 }}
      className="authmodal"
    >
      <div className="close-icon float-right" onClick={handleClick}>
        ⨂
      </div>
      <h2>{isSignUp ? "Create Account" : "Log In"}</h2>
      <p>
        Mussum Ipsum, cacilds vidis litro abertis. Praesent vel viverra nisi.
        Mauris aliquet nunc non turpis scelerisque, eget.
      </p>
      <form className="flex flex-col" action="" onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="Confirm Password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <input className="secondary-button" type="submit" />

        <p>{error}</p>
      </form>
      <hr />
      <h2>GET THE APP</h2>
    </motion.div>
  );
};

export default AuthModal;
