import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import AuthModal from "../components/authmodal";
import { motion } from "framer-motion";
import { useCookies } from "react-cookie";

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const authToken = cookies.AuthToken;
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 500);
  const [index, setIndex] = useState(1);
  const toRotate = [
    "OLÁ, AUMIGO!",
    "Somos a PetMatch!"
  ];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => 100);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(100);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleClick = () => {
    console.log("clicked");
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      removeCookie("PetID", cookies.PetID);
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
        <h1 className="text-white text-6xl md:text-9xl mb-10">{text}&nbsp;</h1>
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
