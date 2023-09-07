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
      matchedProfile.matches.filter((profile) => profile.id === petID)
        .length > 0
  );

  console.log(matchedProfiles)

  console.log(filteredMatchedProfiles)

  return (
    <div className="matches-display">
      {filteredMatchedProfiles?.map((match, _index) => (
        <div
          key={{ _index }}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className="img-container">
            <img src={match?.url} alt={match?.name + "profile"} />
          </div>
          <h2>{match?.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
