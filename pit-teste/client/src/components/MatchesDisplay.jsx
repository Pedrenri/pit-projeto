import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const MatchesDisplay = ({ matches }) => {
  const matchedUserIds = matches.map(({ user_id }) => user_id);
  const [matchedProfiles, setMatchedProfiles] = useState(null);

  const getMatches = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users", {
        params: { userIds: JSON.stringify(matchedUserIds) },
      });
      setMatchedProfiles(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMatches();
  }, []);

  

  return (
    <div className="matches-display">
      {matchedProfiles?.map((match, _index) => (
        <div key={{ _index }} className="match-card">
          <div className="img-container">
            <img src={match?.url} alt={match?.user_name + "profile"} />
          </div>
          <h2>{match?.user_name}</h2>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
