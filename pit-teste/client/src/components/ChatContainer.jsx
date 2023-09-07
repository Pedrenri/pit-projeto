import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";
import { useState } from "react";
import { motion } from "framer-motion";
import AddPet from "./addPet";

const ChatContainer = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);

  const transition = {
    type: "spring",
    damping: 20,
    stiffness: 100,
  };

  return (
    <motion.div
      initial={{ x: -500 }}
      animate={{ x: 0, transition: { duration: 0.5 } }}
      className="chat-container w-full absolute md:static h-full md:h-screen md:w-1/2 lg:w-2/5 xl:w-5/12"
    >
      {!clickedUser && (
        <motion.div
          initial={{ y: -500 }}
          animate={{ y: 0, transition }}
          exit={{ y: -500, transition }}
        >
          <div className="bg-gray-200 text-gray-500 font-semibold text-2xl flex items-center justify-center h-full">
            Minhas Matches
          </div>
        </motion.div>
      )}

      {!clickedUser && (
        <motion.div
          initial={{ x: -500 }}
          animate={{ x: 0, transition }}
          exit={{ x: -500, transition }}
        >
          <MatchesDisplay
            matches={user.matches}
            setClickedUser={setClickedUser}
          />
        </motion.div>
      )}
      {clickedUser && (
        <motion.div
          initial={{ y: -500 }}
          animate={{ y: 0, transition }}
          exit={{ y: -500, transition }}
        >
          <ChatHeader user={clickedUser} setClickedUser={setClickedUser} />
        </motion.div>
      )}
      {clickedUser && (
        <motion.div
          initial={{ x: -500 }}
          animate={{ x: 0, transition }}
          exit={{ x: -500, transition }}
        >
          <ChatDisplay user={user} clickedUser={clickedUser} />{" "}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatContainer;
