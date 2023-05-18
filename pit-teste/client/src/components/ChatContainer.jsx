import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";

const ChatContainer = () => {
  return (
    <div className="chat-container">
      <ChatHeader/>
      <div>
          <button className="option">
            Matches
          </button>
          <button className="option">
            Chats
          </button>
      </div>

      <MatchesDisplay/>
      <ChatDisplay/>

    </div>
  )
};

export default ChatContainer;
