import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const UpdateAcc = ({ setShowModal }) => {
  const [cookies, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Add showModal state
  const [updateSuccess, setUpdateSuccess] = useState(false); // Add updateSuccess state


  const userId = cookies.UserId;
  console.log(cookies.UserId)
  const petId = cookies.petID;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/dog", {
          params: { userId },
        });
        console.log(response.data.name)
        setUser(response.data);
        
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [userId]);




  const [formData, setFormData] = useState({
    id: petId,
    name: user?.name,
    url: user?.url,
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8000/update-user", {
        formData,
      });
      const success = response.status === 200;
      if (success) {
        setUpdateSuccess(true); // Set updateSuccess to true
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
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
      const response = await axios.delete("http://localhost:8000/dog", {
        params: { petId },
      });

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
              Tem certeza de que quer excluir seu pet? Todos os dados desse pet serão apagados.
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
        <div className="close-icon self-end" onClick={handleClick}>
          ⓧ
        </div>
        <h2>ATUALIZAR DADOS DO PET  </h2>
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
          <div className="flex gap-x-8">
            <div className="flex  flex-col gap-y-8">
              {/* Name field */}
              <div className="flex flex-col">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={user?.name || ''}
                  onChange={handleChange}
                />
              </div>

              
            </div>
            <div className="flex flex-col gap-y-8">

              {/* Profile Picture field */}
              <div className="flex gap-x-8 items-center">
                <div className="flex flex-col">
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
