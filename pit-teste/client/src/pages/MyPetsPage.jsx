import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import UpdateAcc from "../components/UpdateAccount";

const MyPetsPage = () => {
  const [cookies, setCookie] = useCookies(["UserId", "PetID"]);
  const [editingPet, setEditingPet] = useState(null);
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
      } catch (error) {
        console.log(error);
      }
    };

    getMyPets();
  }, [userId]);

  const handleEditClick = (pet) => {
    setCookie("PetID", pet.id);
    setEditingPet(pet); 
  };

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
      <div className="flex flex-wrap justify-center items-center m-2">
        {pets.map((pet) => (
          <div key={pet.id} className="m-2">
            <div
              className="pet-item bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            >
              <img className="pet-image rounded-full" onClick={() => handlePetClick(pet.id)} src={pet?.url} alt={pet?.name} />
              <p className="pet-name text-center mt-2 font-semibold">{pet?.name}</p>
              <button
                className="edit-pet-button text-blue-500"
                onClick={() => handleEditClick(pet)} // Open modal when edit icon is clicked
              >
                Edit
              </button>
            </div>
          </div>
        ))}
        <div className="m-2">
          <div
            className="pet-item  rounded-lg  cursor-pointer"
            onClick={handleAddPetClick}
          >
            <div className="pet-image rounded-full bg-gray-200 shadow-md hover:shadow-lg flex justify-center items-center">
              <span className="text-4xl text-gray-600">+</span>
            </div>
            <p className="pet-name text-center mt-2 font-semibold">Adicionar</p>
          </div>
        </div>
      </div>

      {editingPet && (
        <UpdateAcc
          pet={editingPet} // Pass the editing pet's data to the modal
          setShowModal={setEditingPet}
        />
      )}
    </div>
  );
};

export default MyPetsPage;
