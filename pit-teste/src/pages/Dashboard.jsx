import TinderCard from "react-tinder-card";
import { useState } from "react";
import ChatContainer from "../components/ChatContainer.jsx";

const Dashboard = () => {
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
    <div className="dashboard">
      <ChatContainer />
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
    </div>
  );
};

export default Dashboard;
