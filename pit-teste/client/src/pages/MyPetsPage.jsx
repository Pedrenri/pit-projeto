import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const MyPetsPage = () => {
  const [cookies, setCookie] = useCookies(["UserId", "PetID"]);
  const userId = cookies.UserId;
  const navigate = useNavigate();

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
    navigate("/dashboard");
  };

  const handleAddPetClick = () => {
    navigate("/petreg");
  };

  return (
    <div className="my-pets-page bg-gray-100 min-h-screen p-4">
      <h1 className="text-3xl font-semibold mb-4">Meus Animais</h1>
      <div className="flex flex-wrap justify-center -m-2">
        {pets.map((pet) => (
          <div key={pet.id} className="m-2">
            <div
              className="pet-item bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => handlePetClick(pet.id)}
            >
              <img className="pet-image rounded-full" src={pet.url} alt={pet.name} />
              <p className="pet-name text-center mt-2 font-semibold">{pet.name}</p>
            </div>
          </div>
        ))}
        <div className="m-2">
          <div
            className="pet-item bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={handleAddPetClick}
          >
            <div className="pet-image rounded-full bg-gray-300 flex justify-center items-center">
              <span className="text-4xl text-gray-600">+</span>
            </div>
            <p className="pet-name text-center mt-2 font-semibold">Adicionar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPetsPage;
