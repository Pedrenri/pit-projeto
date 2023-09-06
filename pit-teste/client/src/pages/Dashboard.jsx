import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { MenuIcon } from "@heroicons/react/outline"; // Importe o ícone do Heroicons
import ChatContainer from "../components/ChatContainer"



import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [lastDirection, setLastDirection] = useState();
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado para controlar se o ChatContainer está aberto

  const userId = cookies.PetID;
  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/dog", {
        params: { userId },
      });
      setPet(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const petID = cookies.PetID;
  console.log(pet)

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gendered-users", {
        params: { gender: pet?.gender_interest },
      });
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        petID,
        matchedUserId,
      });
      getUser();
    } catch (err) {
      console.log(err);
    }
  };

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = pet?.matches
    .map(({ id }) => id)
    .concat(petID);

  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser) => !matchedUserIds?.includes(genderedUser.id)
  );

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const canShowChat = isChatOpen || window.innerWidth > 768
  console.log(canShowChat)
  const canShowbutton = window.innerWidth > 768

  return (
    <>
      {pet && (
        <div className="dashboard">
          {canShowChat  && <ChatContainer user={pet} />} {/* Renderize o ChatContainer se isChatOpen for verdadeiro */}
          <div className="fixed top-4 left-4 z-50"> {/* Adicione a classe "fixed" para posicionar o botão no canto superior esquerdo */}
            {!canShowbutton && <button
              className="p-2 text-white rounded-full focus:outline-none"
              onClick={handleChatToggle} // Alterne o estado isChatOpen quando o botão for clicado
            >
              <MenuIcon className="w-6 h-6" /> {/* Adicione o ícone do Chat usando o Heroicons */}
            </button> }
          </div>
          <div className="swipe-container w-full">
            <div className="card-container">
              {filteredGenderedUsers?.map((character) => (
                <TinderCard
                  className="swipe"
                  key={character.user_id}
                  onSwipe={(dir) => swiped(dir, character.user_id)}
                  onCardLeftScreen={() => outOfFrame(character.first_name)}
                >
                  <div
                    style={{ backgroundImage: "url(" + character.url + ")" }}
                    className="card w-72 md:w-96 h-96"
                  >
                    <h3>{character.user_name}</h3>
                  </div>
                </TinderCard>
              ))}
              {!filteredGenderedUsers && (
                <p>Ops! Parece que você já viu tudo aqui!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
