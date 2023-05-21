import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ChatContainer from "../components/ChatContainer.jsx";
import axios from 'axios';

const Dashboard = () => {
  
  const [ user, setUser] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [genderedUsers, setGenderedUsers] = useState(null)

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
      params: {gender: user?.gender == 'man' ? 'woman' : 'man'}
    })
    setGenderedUsers(response.data)
  } catch (error) {
    console.log(error)
  }
}

  useEffect(() => {
    getUser()
    getGenderedUsers()
  },[user]);


  

  const characters = [
    {
      name: "Richard Hendricks",
      url: "https://th.bing.com/th/id/R.e528ca8a1dac419ff2b0071120ecc986?rik=JsDebwtwu6v8sA&riu=http%3a%2f%2fwww.wallpapers13.com%2fwp-content%2fuploads%2f2016%2f01%2fCool-and-Beautiful-Nature-desktop-wallpaper-image-2560X1600.jpg&ehk=WWtNurVm9a0rWJrce%2fWxK5ehuPq%2bkDe%2fJtza2JHnrgQ%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      name: "Erlich Bachman",
      url: "https://th.bing.com/th/id/R.e528ca8a1dac419ff2b0071120ecc986?rik=JsDebwtwu6v8sA&riu=http%3a%2f%2fwww.wallpapers13.com%2fwp-content%2fuploads%2f2016%2f01%2fCool-and-Beautiful-Nature-desktop-wallpaper-image-2560X1600.jpg&ehk=WWtNurVm9a0rWJrce%2fWxK5ehuPq%2bkDe%2fJtza2JHnrgQ%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      name: "Monica Hall",
      url: "https://th.bing.com/th/id/R.e528ca8a1dac419ff2b0071120ecc986?rik=JsDebwtwu6v8sA&riu=http%3a%2f%2fwww.wallpapers13.com%2fwp-content%2fuploads%2f2016%2f01%2fCool-and-Beautiful-Nature-desktop-wallpaper-image-2560X1600.jpg&ehk=WWtNurVm9a0rWJrce%2fWxK5ehuPq%2bkDe%2fJtza2JHnrgQ%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      name: "Jared Dunn",
      url: "https://th.bing.com/th/id/R.e528ca8a1dac419ff2b0071120ecc986?rik=JsDebwtwu6v8sA&riu=http%3a%2f%2fwww.wallpapers13.com%2fwp-content%2fuploads%2f2016%2f01%2fCool-and-Beautiful-Nature-desktop-wallpaper-image-2560X1600.jpg&ehk=WWtNurVm9a0rWJrce%2fWxK5ehuPq%2bkDe%2fJtza2JHnrgQ%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      name: "Dinesh Chugtai",
      url: "https://th.bing.com/th/id/R.e528ca8a1dac419ff2b0071120ecc986?rik=JsDebwtwu6v8sA&riu=http%3a%2f%2fwww.wallpapers13.com%2fwp-content%2fuploads%2f2016%2f01%2fCool-and-Beautiful-Nature-desktop-wallpaper-image-2560X1600.jpg&ehk=WWtNurVm9a0rWJrce%2fWxK5ehuPq%2bkDe%2fJtza2JHnrgQ%3d&risl=&pid=ImgRaw&r=0",
    },
  ];
  const [lastDirection, setLastDirection] = useState();

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
          {characters.map((character) => (
            <TinderCard
              className="swipe"
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name)}
              onCardLeftScreen={() => outOfFrame(character.name)}
            >
              <div
                style={{ backgroundImage: "url(" + character.url + ")" }}
                className="card"
              >
                <h3>{character.name}</h3>
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
