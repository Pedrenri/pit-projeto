const AuthModal = ({ setShowModal }) => {
  const handleClick = () => {
    setShowModal(false);
  };

  return (
    <div className="authmodal">
      <div onClick={handleClick}>⨂</div>
      AUTH MODAL
    </div>
  );
};

export default AuthModal;
