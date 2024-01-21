import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import config from "../config";

const UpdateAcc = ({ setShowModal }) => {
  const [cookies, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Add showModal state
  const [updateSuccess, setUpdateSuccess] = useState(false); // Add updateSuccess state
  const apiURL = config.apiUrl

  /* const userId = cookies.UserId; */
  const petId = cookies.PetID;

  const [breedOptions, setBreedOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiURL}/dog-breeds`)
      .then((response) => {
        setBreedOptions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/dog`,
          {
            params: { petId: petId },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [petId]);

  const [formData, setFormData] = useState({
    id: petId,
    name: user?.name,
    url: user?.url,
    age: user?.age,
    breed: user?.breed,
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiURL}/update-dog`,
        {
          formData,
        }
      );
      const success = response.status === 200;
      if (success) {
        setUpdateSuccess(true); // Set updateSuccess to true
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    setShowConfirmModal(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiURL}/dog`,
        {
          params: { petId },
        }
      );

      if (response.status === 200) {
        navigate("/mypets");
        removeCookie("PetID", cookies.PetID);
      }
    } catch (err) {
      console.log(err);
    } finally {
      navigate("/mypets");
      removeCookie("PetID", cookies.PetID);
    }
  };

  const handleChange = (e) => {
    console.log("e", e);
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = () => {
    setShowModal(false);
  };

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  return (
    <>
      {showConfirmModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ y: 500 }}
            animate={{ y: 0 }}
            exit={{ y: 500 }}
            className="modal-content"
          >
            <h2>Confirmar exclusão de pet</h2>
            <p>
              Tem certeza de que quer excluir seu pet? Todos os dados desse pet
              serão apagados.
            </p>
            <div className="modal-buttons">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.01 }}
                className="delete-button"
                onClick={confirmDelete}
              >
                Sim, desejo excluir meu pet
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.01 }}
                className="cancel-button"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        key="modal"
        initial={{ y: 500 }}
        animate={{ y: 0 }}
        exit={{ y: 500 }}
        className="updateModal flex flex-col gap-y-4 justify-around items-center"
      >
        <div
          className="close-icon self-end absolute top-0 right-0"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faX} />
        </div>
        <h2 className="mt-2">EDITAR DADOS DO PET</h2>
        <div className="photo-container">
          <img
            src={formData?.url ? formData.url : user?.url}
            alt="profile-pic"
          />
        </div>
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex justify-center flex-col items-between gap-y-4 pb-8"
        >
          {/* Form fields */}
          <div className="flex flex-col md:flex-row gap-x-8">
            <div className="flex  flex-col gap-y-8">
              {/* Name field */}
              <div className="flex flex-col gap-y-2">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={user?.name || ""}
                  onChange={handleChange}
                />
                <label>Idade</label>

                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder={user?.age}
                  value={formData?.age}
                  onChange={handleChange}
                  maxLength="2"
                  onInput={maxLengthCheck}
                  className="w-4/12 md:w-1/5 mx-auto"
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-8">
              {/* Profile Picture field */}
              <div className="flex gap-x-8 items-center">
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="url">Foto de Perfil</label>
                  <input
                    type="url"
                    name="url"
                    id="url"
                    onChange={handleChange}
                    className="w-full"
                    placeholder={user?.url}
                    value={formData?.url}
                  />

                  <label htmlFor="breed">Raça</label>
                  <select
                    id="breed"
                    name="breed"
                    value={formData?.breed}
                    onChange={handleChange}
                    
                  >
                    <option value="" disabled>
                      Selecione a raça (apenas cães)
                    </option>
                    {breedOptions.map((breed) => (
                      <option key={breed.id} value={breed.name}>
                        {breed.name}
                      </option>
                    ))}
                  </select>
                  <p>Raça atual: {user?.breed}</p>
                </div>
              </div>
            </div>
          </div>

          {updateSuccess && (
            <div className=" flex items-center justify-center">
              <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md">
                Atualização realizada com sucesso!
              </div>
            </div>
          )}

          {/* Submit and Delete Account buttons */}
          <div className="flex gap-x-8">
            <motion.input
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              className="w-11/12 self-center"
              onSubmit={handleChange}
              value="Atualizar"
            />
            <motion.button
              className="w-1/2 bg-red-600 rounded-md text-white"
              onClick={handleDelete}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.01 }}
            >
              Excluir Pet
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default UpdateAcc;
