import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const UpdateUserAcc = ({ setShowModal }) => {
  const [cookies, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Add showModal state
  const [updateSuccess, setUpdateSuccess] = useState(false); // Add updateSuccess state

  /* const userId = cookies.UserId; */
  const petId = cookies.UserId;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user", {
          params: { userId: petId },
        });
        console.log(response.data.full_name);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [petId]);

  const [formData, setFormData] = useState({
    user_id: petId,
    full_name: user?.full_name,
    address: user?.address,
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
      const response = await axios.delete("http://localhost:8000/user", {
        params: { userId: petId },
      });

      if (response.status === 200) {
        navigate("/");
        removeCookie("PetID", cookies.PetID);
        removeCookie("UserId", cookies.UserId);
        removeCookie("AuthToken", cookies.AuthToken);
      }
    } catch (err) {
      console.log(err);
    } finally {
      navigate("/");
      removeCookie("PetID", cookies.PetID);
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
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
            <h2>Confirmar exclusão de conta</h2>
            <p>
              Tem certeza de que quer excluir sua conta? Todos os dados dessa
              conta serão apagados.
            </p>
            <div className="modal-buttons">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.01 }}
                className="delete-button"
                onClick={confirmDelete}
              >
                Sim, desejo excluir minha conta.
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
          className="close-icon self-end absolute top-0 "
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faX} />
        </div>
        <h2 className="m-4">EDITAR DADOS DO USUÁRIO </h2>
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
                <label htmlFor="full_name">Nome</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  placeholder={user?.full_name || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-8">
              {/* Profile Picture field */}
              <div className="flex gap-x-8 items-center">
                <div className="flex flex-col">
                  <label htmlFor="address">Endereço</label>
                  <input
                    type="address"
                    name="address"
                    id="address"
                    onChange={handleChange}
                    className="w-full"
                    placeholder={user?.address}
                    value={formData?.address}
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
              Excluir Conta
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default UpdateUserAcc;
