import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate

const MyPetsPage = () => {
  const [cookies, setCookie] = useCookies(["UserId", "PetID"]);
  const userId = cookies.UserId;
  const navigate = useNavigate(); // Use useNavigate para acessar a navegação

  const [pets, setPets] = useState([]);

  useEffect(() => {
    const getMyPets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/dogs", {
          params: { userId },
        });
        setPets(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMyPets();
  }, [userId]);

  const handlePetClick = (petId) => {
    setCookie("PetID", petId);
    navigate("/dashboard"); // Use navigate para redirecionar
  };

  return (
    <div>
      <h1>Meus Animais</h1>
      <ul className="pets-list">
        {pets.map((pet) => (
          <li className="pet-item" key={pet.id}>
            <img
              className="pet-image"
              src={pet.url}
              alt={pet.name}
              onClick={() => handlePetClick(pet.id)}
            />
            <p className="pet-name">{pet.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPetsPage;
