import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { MenuIcon } from "@heroicons/react/outline"; // Importe o ícone do Heroicons
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import { motion } from "framer-motion";

import axios from "axios";

const Dashboard = () => {
  /* const [user, setUser] = useState(null); */
  const [pet, setPet] = useState(null);
  const [cookies] = useCookies(["user"]);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [lastDirection, setLastDirection] = useState();
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado para controlar se o ChatContainer está aberto
  const navigate = useNavigate();

  const userId = cookies.PetID;
  const getUser = async () => {
    try {
      const response = await axios.get("http://44.204.7.86/dog", {
        params: { petId: userId },
      });
      setPet(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const petID = cookies.PetID;

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://44.204.7.86/gendered-users", {
        params: {
          gender: pet?.gender_interest,
          owner_id: pet?.owner_id,
          breed: pet?.breed,
        },
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
    if (pet) {
      getGenderedUsers();
    }
  }, [pet]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://44.204.7.86/addmatch", {
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


  const matchedUserIds = pet?.matches?.map(({ id }) => id).concat(petID);

  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser) => !matchedUserIds.includes(genderedUser.id)
  );

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const mypets = () => {
    navigate("/mypets");
  };

  const canShowChat = isChatOpen || window.innerWidth > 768;

  const canShowbutton = window.innerWidth > 768;

  return (
    <>
      {pet && (
        <div className="dashboard">
          {canShowChat && <ChatContainer user={pet} />}{" "}
          <div className="fixed top-4 left-4 z-50">
            {" "}
            {!canShowbutton && (
              <button
                className="p-2 text-white rounded-full focus:outline-none"
                onClick={handleChatToggle}
              >
                <MenuIcon className="w-6 h-6" />{" "}
              </button>
            )}
          </div>
          <div className="absolute top-4 right-4 z-50">
            {pet && (
              <img
                src={pet.url} /* Use a URL do perfil selecionado */
                alt={pet.name}
                className="w-12 h-12 rounded-full object-cover log-out-icon"
                title="Trocar perfil"
                onClick={mypets}
              />
            )}
          </div>
          <div className="swipe-container w-full ">
            {filteredGenderedUsers?.map((character) => (
              <TinderCard
                className="swipe shadow-lg"
                key={character.id}
                onSwipe={(dir) => swiped(dir, character.id)}
                onCardLeftScreen={() => outOfFrame(character.name)}
              >
                <div className="card">
                  <div className="card-img">
                    <img
                      src={character.url}
                      alt="photo"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="card-info bg-white">
                  <h3 className=" drop-shadow-lg text-2xl text-left">
                    {character.name}, <span>{character.age}</span> <br />
                    <span className="text-lg">{character.breed}</span>
                  </h3>
                </div>
              </TinderCard>
            ))}
            {!filteredGenderedUsers && (
              <p>Ops! Parece que você já viu tudo aqui!</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
