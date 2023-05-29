import whitelogo from "../assets/white_logo.png";
import colorlogo from "../assets/tinder-color.png";

const Nav = ({ minimal, authToken, setShowModal, showModal, setIsSignUp }) => {
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false)
  };

  return (
    <nav className="flex justify-between w-full">
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
    </nav>
  );
};

export default Nav;
