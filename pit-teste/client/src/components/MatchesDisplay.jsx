import axios from "axios";
import { useState } from "react";

const MatchesDisplay = ({ matches }) => {
  const matchedUserIds = matches.map(({ user_id }) => user_id);
  const [matchedProfiles, setMatchedProfiles] = useState(null);

  const getMatches = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users", {
        params: { userIds: JSON.stringify(matchedUserIds) },
      });
      setMatchedProfiles(response.data);
      console.log(response.data)
    } catch (err) {
      console.log(err);
    }
  };

  

  return <div className="matches-display"></div>;
};

export default MatchesDisplay;
