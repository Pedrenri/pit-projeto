import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const MatchesDisplay = ({ matches, setClickedUser }) => {
  const matchedUserIds = matches.map(({ user_id }) => user_id);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  const userId = cookies.UserId;

  const getMatches = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users", {
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
      matchedProfile.matches.filter((profile) => profile.user_id == userId)
        .length > 0
  );

  return (
    <div className="matches-display">
      {filteredMatchedProfiles?.map((match, _index) => (
        <div
          key={{ _index }}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
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
