import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import UpdateAcc from "./UpdateAccount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


const ChatHeader = ({ user, setClickedUser }) => {
  const [cookies, removeCookie] = useCookies(["user"]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Função para limpar a variável clickedUser
  const handleLogoutClick = () => {
    setClickedUser(null);
  };

  // Determine qual usuário exibir com base na prop clickedUserProfile
  const displayUser =  user;

  return (
    <div className="chat-container-header">
      <div className="profile">
        <div className="img-container-nm">
          <img src={displayUser.url} alt={"profile_pic"} />
        </div>
        <h3>{displayUser.name}</h3>
      </div>

      {/* Adicione a função de limpeza ao botão log-out-icon */}
      <FontAwesomeIcon
        icon={faArrowLeft}
        className="cursor-pointer"
        onClick={handleLogoutClick}
        title="Voltar para conversas"
      />
      {showModal && displayUser && <UpdateAcc setShowModal={setShowModal} />}
    </div>
  );
};

export default ChatHeader;
