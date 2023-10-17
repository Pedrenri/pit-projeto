import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const MatchesDisplay = ({ matches, setClickedUser }) => {
  const matchedUserIds = matches.map(({ id }) => id);
  const [cookies] = useCookies(null);
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  /* const userId = cookies.UserId; */
  const petID = cookies.PetID;
  const [lastMessages, setLastMessages] = useState({}); // Estado para armazenar as últimas mensagens

  const getMatches = async () => {
    try {
      const response = await axios.get("http://44.204.7.86/users", {
        params: { userIds: JSON.stringify(matchedUserIds) },
      });
      setMatchedProfiles(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  

  useEffect(() => {
    getMatches();
  }, [matches]);

  const filteredMatchedProfiles = matchedProfiles?.filter(
    (matchedProfile) =>
      matchedProfile.matches.filter((profile) => profile.id === petID).length >
      0
  );

  return (
    <div className="matches-display">
      {filteredMatchedProfiles?.map((match, _index) => (
        <div
          key={_index}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className="img-container">
            <img src={match?.url} alt={match?.name + "profile"} />
          </div>
          <div className="flex flex-col">
            <h2>{match?.name}</h2>
            <p className="font-medium text-gray-700">
            
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
