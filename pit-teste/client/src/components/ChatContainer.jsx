import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";
import { useState } from "react";
import { motion } from "framer-motion";
import AddPet from "./addPet";

const ChatContainer = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);

  return (
    <motion.div
      initial={{ x: -500 }}
      animate={{ x: 0, transition: {duration: 0.5} }}
      className="chat-container w-full absolute md:static h-full md:h-screen md:w-1/2 lg:w-2/5 xl:w-3/12"
    >
      <ChatHeader user={user} />
      <div>
        <button className="option" onClick={() => setClickedUser(null)}>
          Matches
        </button>
        <button className="option" disabled={!clickedUser}>
          Chats
        </button>
      </div>

      {!clickedUser && (
        <MatchesDisplay
          matches={user.matches}
          setClickedUser={setClickedUser}
        />
      )}
      {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser} />}
    </motion.div>
  );
};

export default ChatContainer;
