import { useState } from "react";
import Nav from "./Nav";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const UpdateAcc = ({ setShowModal }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useState(null);

  const userId = cookies.UserId;
 /*  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };
 */
  /* useEffect(() => {
    getUser();
  }, []); */

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user", {
          params: { userId },
        });
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [userId]);

  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    full_name: user?.first_name,
    dob_day: user?.dob_day,
    dob_month: user?.dob_month,
    dob_year: user?.dob_year,
    show_gender: user?.show_gender,
    url: user?.url,
    matches: user?.matches,
    user_name: user?.user_name,
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
      if (success) navigate("/dashboard");
    } catch (err) {
      console.log(err);
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

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  const handleClick = () => {
    setShowModal(false);
  };

  return (
    <>
      <motion.div
        key="modal"
        initial={{ y: 500 }}
        animate={{ y: 0 }}
        exit={{ y: 500 }}
        className="updateModal flex flex-col justify-around items-center"
      >
        <div className="close-icon self-end" onClick={handleClick}>
          ⓧ
        </div>
        <h2>ATUALIZAR DADOS</h2>
        <div className="photo-container">
          <img
            src={formData?.url ? formData.url : user?.url}
            alt="profile-pic-preview"
          />
        </div>
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex justify-center flex-col items-between gap-y-4"
        >
          <div className="flex gap-x-8">
            <div className="flex flex-col">
              <label htmlFor="first_name">Nome completo</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder={user?.first_name}
                defaultValue={user?.full_name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="first_name">Nome de Usuário</label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                placeholder={user?.user_name}
                value={formData?.user_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-x-8">
            <div className="flex flex-col">
              <label htmlFor="first_name">Endereço</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder={user?.address}
                value={formData?.address}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label>Data de Nascimento</label>
              <div className="multInputContainer flex justify-center gap-x-4">
                <input
                  type="number"
                  id="dob_day"
                  name="dob_day"
                  placeholder={user?.dob_day}
                  value={formData?.dob_day}
                  onChange={handleChange}
                  max="31"
                  maxLength="2"
                  onInput={maxLengthCheck}
                  className="w-10"
                />
                <input
                  type="number"
                  id="dob_month"
                  name="dob_month"
                  placeholder={user?.dob_month}
                  value={formData?.dob_month}
                  onChange={handleChange}
                  max="12"
                  maxLength="2"
                  onInput={maxLengthCheck}
                  className="w-10"
                />
                <input
                  type="number"
                  id="dob_year"
                  name="dob_year"
                  placeholder={user?.dob_year}
                  value={formData?.dob_year}
                  onChange={handleChange}
                  maxLength="4"
                  onInput={maxLengthCheck}
                  className="w-20"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-x-8 items-center ">
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
            <div className="flex flex-col">
              <label htmlFor="show-gender">Exibir gênero no perfil?</label>
              <input
                type="checkbox"
                id="show-gender"
                name="show_gender"
                onChange={handleChange}
                checked={formData?.show_gender}
              />
            </div>
          </div>

          <input
            type="submit"
            className="w-11/12 self-center"
            onSubmit={handleChange}
            value="Atualizar"
          />
        </form>
      </motion.div>
    </>
  );
};

export default UpdateAcc;
