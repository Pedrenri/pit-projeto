import Nav from "../components/Nav";
import { useState } from "react";
import AuthModal from "../components/authmodal";
import { motion } from "framer-motion";
import { useCookies } from "react-cookie";

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const authToken = cookies.AuthToken;

  const handleClick = () => {
    console.log("clicked");
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
    } else {
      setShowModal(true);
      setIsSignUp(true);
    }
  };

  return (
    <div className="overlay w-screen h-screen fixed">
      <Nav
        minimal={false}
        authToken={authToken}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
      />
      <div className="home mt-10 px-10 md:px-0">
        <h1 className="text-white text-6xl md:text-9xl mb-10">OLÁ, AUMIGO</h1>
        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.6 } }}
          transition={{ ease: "easeInOut" }}
          className="primary-button"
          onClick={handleClick}
        >
          {authToken ? "Sair" : "Criar Conta"}
        </motion.button>
        {showModal && (
          <AuthModal
            setShowModal={setShowModal}
            setIsSignUp={setIsSignUp}
            isSignUp={isSignUp}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
