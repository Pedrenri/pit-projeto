import whitelogo from "../assets/white_logo.png";
import colorlogo from "../assets/dark_logo.png";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";

const Nav = ({ minimal, authToken, setShowModal, showModal, setIsSignUp }) => {
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false)
  };

  const navigate = useNavigate()

  function handleMyProfile() {
    navigate("/mypets")
  }

  return (
    <nav className="flex justify-between px-4 w-full">
      <div className="logo-container">
        <img
          src={minimal ? colorlogo : whitelogo}
          alt=""
          className="logo w-full"
        />
      </div>
      {!authToken && !minimal && (
        <button
          className="nav-button m-2.5"
          onClick={handleClick}
          disabled={showModal}
        >
          Login
        </button>
      )}
      {authToken && <motion.button
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.6 } }}
            transition={{ ease: "easeInOut" }}
            className="nav-button m-2.5"
            onClick={handleMyProfile}
          >
            Meu perfil
          </motion.button>}
    </nav>
  );
};

export default Nav;
