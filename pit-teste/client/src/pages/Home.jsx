import Nav from "../components/Nav";
import { useState } from "react";
import AuthModal from "../components/authmodal";
import { motion } from "framer-motion";

const Home = () => {
  const authToken = false;

  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleClick = () => {
    console.log("clicked");
    setShowModal(true);
    setIsSignUp(true);
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
        <h1 className="text-white text-6xl md:text-8xl mb-10">OLÁ, AUMIGO</h1>
        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05, transition: {duration:.6} }}
          transition={{ ease: "easeInOut" }}
          className="primary-button"
          onClick={handleClick}
        >
          {authToken ? "SignOut" : "Create Account"}
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
