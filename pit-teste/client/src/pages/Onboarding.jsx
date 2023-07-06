import { useState } from "react";
import Nav from "../components/Nav";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Onboarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    full_name: "",
    birth_date: "",
    gender_identity: "man",
    matches: [],
    user_name: "",
    address: "",
  });
  const [error, setError] = useState(null);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8000/user", {
        formData,
      });
      console.log(response);
      const success = response.status === 200;
      if (success) navigate("/verification");
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
  
    if (name === "birth_date") {
      const inputDate = new Date(value);
      if (!isNaN(inputDate.getTime())) {
        const formattedDate = inputDate.toISOString().split("T")[0];
        setFormData((prevState) => ({
          ...prevState,
          birth_date: formattedDate,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  console.log(formData);

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showmodal={false} />
      <div className="onboarding">
        <h2>CRIAR CONTA</h2>
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex justify-center flex-col sm:flex-row items-center sm:items-start"
        >
          <section className="md:w-4/12 flex ">
            <label htmlFor="first_name">Nome completo</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Nome Completo"
              required
              value={formData.full_name}
              onChange={handleChange}
            />

            <label htmlFor="user_name">Nome de Usuário</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              placeholder="Nome de Usuário (NÃO PODE SER MUDADO!)"
              required
              value={formData.user_name}
              onChange={handleChange}
            />

            <label htmlFor="address">Endereço</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Endereço"
              required
              value={formData.address}
              onChange={handleChange}
            />

            <label>Data de Nascimento</label>
            <div className="multInputContainer justify-center md:justify-start">
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                required
                value={formData.birth_date}
                onChange={handleChange}
                className="w-4/12 md:w-full"
              />
            </div>
            <label>Sexo</label>
            <div className="multInputContainer justify-center md:justify-start">
              <input
                type="radio"
                id="man_gender_id"
                name="gender_identity"
                value="man"
                onChange={handleChange}
                checked={formData.gender_identity === "man"}
              />
              <label htmlFor="man_gender_id">Masculino</label>
              <input
                type="radio"
                id="woman_gender_id"
                name="gender_identity"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_identity === "woman"}
              />
              <label htmlFor="woman_gender_id">Feminino</label>
            </div>
          
            
            <input type="submit" className="w-11/12" />
            {error && <p>{error}</p>}
          </section>
        </form>
      </div>
    </>
  );
};

export default Onboarding;
