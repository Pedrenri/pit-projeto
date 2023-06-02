import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import UpdateAcc from "../pages/UpdateAccount";

const ChatHeader = ({ user }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [wasClicked, setWasclicked] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate();

  const logout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    window.location.reload();
  };
  const changeUser = () => {
   setShowModal(true)
  }


  return (
    <div className="chat-container-header">
      <div className="profile" onClick={changeUser}>
        <div className="img-container">
          <img src={user.url} alt={"photo of "} />
        </div>
        <h3>{user.user_name}</h3>
      </div>
      <i className="log-out-icon" onClick={logout} title="Sair">
        ⇦
      </i>
      {showModal && <UpdateAcc/>}
    </div>
  );
};

export default ChatHeader;
