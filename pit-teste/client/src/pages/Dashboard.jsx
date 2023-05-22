import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ChatContainer from "../components/ChatContainer.jsx";
import axios from 'axios';

const Dashboard = () => {
  
  const [ user, setUser] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [genderedUsers, setGenderedUsers] = useState(null)
  const [lastDirection, setLastDirection] = useState();

  const userId = cookies.UserId
  const getUser = async () => {
    try {
        const response =  await axios.get('http://localhost:8000/user', {
            params: {userId}
        })
        setUser(response.data)
    } catch (error) {
        console.log(error)
    }
}

const getGenderedUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/gendered-users', {
      params: {gender: user?.gender_identity}
    })
    setGenderedUsers(response.data)
  } catch (error) {
    console.log(error)
  }
}

  useEffect(() => {
    getUser()
    getGenderedUsers()
  },[user,genderedUsers]);

  console.log(genderedUsers)


  

  const swiped = (direction, nameToDelete) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  return (
    <>
    {user &&
    <div className="dashboard">
      <ChatContainer user={user} />
      <div className="swipe-container">
        <div className="card-container">
          {genderedUsers?.map((character) => (
            <TinderCard
              className="swipe"
              key={character.user_name}
              onSwipe={(dir) => swiped(dir, character.user_name)}
              onCardLeftScreen={() => outOfFrame(character.user_name)}
            >
              <div
                style={{ backgroundImage: "url(" + character.url + ")" }}
                className="card"
              >
                <h3>{character.user_name}</h3>
              </div>
            </TinderCard>
          ))}
          <div className="swipe-info">
            {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};

export default Dashboard;
