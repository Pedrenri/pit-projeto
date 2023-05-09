import Navbar from "../components/Nav";
import { useState } from "react";
import AuthModal from "../components/authmodal";

const Home = () => {
  const authToken = false;

  const handleClick = () => {
    console.log("clicked");
    setShowModal(true);
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="overlay w-screen h-screen fixed">
      <Navbar
        minimal={false}
        authToken={authToken}
        setShowModal={setShowModal}
        showModal={showModal}
      />
      <div className="home">
        <h1>Swipe Right</h1>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "SignOut" : "Create Account"}
        </button>
        {showModal && <AuthModal setShowModal={setShowModal} />}
      </div>
    </div>
  );
};

export default Home;
