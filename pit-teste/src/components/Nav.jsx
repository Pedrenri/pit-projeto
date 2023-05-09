import whitelogo from "../assets/tinder_white.png";
import colorlogo from "../assets/tinder-color.png";

const Navbar = ({ minimal, authToken, setShowModal, showModal }) => {
  const handleClick = () => {
    setShowModal(true);
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
          Log in
        </button>
      )}
    </nav>
  );
};

export default Navbar;
