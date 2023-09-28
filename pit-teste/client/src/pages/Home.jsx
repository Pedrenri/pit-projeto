import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import AuthModal from "../components/authmodal";
import { motion } from "framer-motion";
import { useCookies } from "react-cookie";
import image4 from "../assets/image 4.svg";
import image5 from "../assets/image 5.svg";
import whitelogo from "../assets/white_logo.png";

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
  const toRotate = ["OLÁ, AUMIGO!", "Somos a PetMatch!"];
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
    <>
      <div className="overlay w-screen h-screen">
        <Nav
          minimal={false}
          authToken={authToken}
          setShowModal={setShowModal}
          showModal={showModal}
          setIsSignUp={setIsSignUp}
        />
        <div className="home mt-10 px-10 md:px-0">
          <h1 className="text-white text-6xl md:text-9xl mb-10">
            {text}&nbsp;
          </h1>
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
          <div className="custom-shape-divider-bottom-1694524354">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
                className="shape-fill"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div id="principal">
        <div id="pequena" className="shadow-2xl">
          <div className="texto">
            <h1 className="sobrenos"> SOBRE NÓS</h1>
            <p>
              {" "}
              Somos a PetMatch, o lugar <br /> onde corações peludos <br />
              encontram seus pares <br /> perfeitos! Somos uma
              <br /> plataforma de encontros para <br /> animais de estimação,{" "}
              <br /> inspirada em aplicativos de <br />
              namoro, mas com um toque <br /> especial para nossos amigos <br />{" "}
              de quatro patas e suas <br /> famílias amorosas. Estamos <br />{" "}
              aqui para ajudar a
              <br /> tornar a jornada de encontrar um novo <br /> amigo peludo
              divertida, fácil e <br /> emocionante!
            </p>
          </div>
          <div id="imagem">
            <img src={image4} alt="" id="cachorrinho1" width="320px" />
            <img src={image5} id="cachorrinho2" width="320" />
          </div>
        </div>
        
      </div>
      <div className="flex justify-center pt-4">
        <h1 className="texto" id="nossosvalores">
          {" "}
          NOSSOS VALORES{" "}
        </h1>
      </div>
      <div className="container-holder flex items-center justify-center">
        <div className="container">
          <div className="card">
            <div className="img"></div>

            <div className="content">
              <span className="title"></span>
              <p className="desc">
                Aqui, todos compartilham o mesmo amor pelos animais e desejam o
                melhor para seus pets.
              </p>
            </div>

            <div className="arrow">
              <span>&#8673;</span>
            </div>
          </div>
        </div>
        <div className="container2">
          <div className="card2">
            <div className="img2"></div>

            <div className="content2">
              <span className="title2"></span>
              <p className="desc2">
                Nossa plataforma é projetada para promover conexões genuínas
                entre pets e suas famílias, baseadas em interesses comuns e
                compatibilidade.
              </p>
            </div>

            <div className="arrow2">
              <span>&#8673;</span>
            </div>
          </div>
        </div>
        <div className="container3">
          <div className="card3">
            <div className="img3"></div>

            <div className="content3">
              <span className="title3"></span>
              <p className="desc3">
                Garantimos que todos os perfis sejam revisados para garantir a
                segurança e o bem-estar de todos os membros.
              </p>
            </div>

            <div className="arrow3">
              <span>&#8673;</span>
            </div>
          </div>
        </div>
      </div>

      <footer id="footer">
        {/* <form>
          <label htmlFor="fname" id="Fformm">
            {" "}
          </label>
          <br />
          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="Deixe aqui sua sugestao, reclamacao ou duvida"
          />
          <br />
          <input type="submit" />
        </form> */}
        <img src={whitelogo} id="logo" width="400px" /* height="60px" */ />
      </footer>
    </>
  );
};

export default Home;
