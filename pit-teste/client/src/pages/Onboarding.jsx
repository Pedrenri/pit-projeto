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
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    url: "",
    matches: [],
    user_name:"",
    address: ""
  });

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
              id="first_name"
              name="first_name"
              placeholder="Nome Completo"
              required
              value={formData.first_name}
              onChange={handleChange}
            />

<label htmlFor="first_name">Nome de Usuário</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              placeholder="Nome de Usuário"
              required
              value={formData.user_name}
              onChange={handleChange}
            />

<label htmlFor="first_name">Endereço</label>
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
                type="number"
                id="dob_day"
                name="dob_day"
                placeholder="DD"
                required
                value={formData.dob_day}
                onChange={handleChange}
                max="31"
                maxLength="2"
                onInput={maxLengthCheck}
                className="w-4/12 md:w-1/5"
              />
              <input
                type="number"
                id="dob_month"
                name="dob_month"
                placeholder="MM"
                required
                value={formData.dob_month}
                onChange={handleChange}
                max="12"
                maxLength="2"
                onInput={maxLengthCheck}
                className="w-4/12 md:w-1/5"
              />
              <input
                type="number"
                id="dob_year"
                name="dob_year"
                placeholder="YYYY"
                required
                value={formData.dob_year}
                onChange={handleChange}
                maxLength="4"
                max="2007"
                min="1900"
                onInput={maxLengthCheck}
                className="w-4/12 md:w-1/5"
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
            <label htmlFor="show-gender">Exibir gênero no perfil?</label>
            <input
              type="checkbox"
              id="show-gender"
              name="show_gender"
              onChange={handleChange}
              checked={formData.show_gender}
            />

            
          </section>

          <section className="w-full md:w-4/12 flex items-center ">
            <label htmlFor="url">Foto de Perfil</label>
            <input
              type="url"
              name="url"
              id="url"
              onChange={handleChange}
              required
              className="w-full"
            />
            <div className="photo-container">
              {formData.url && (
                <img src={formData.url} alt="profile-pic-preview" />
              )}
            </div>
             <input type="submit" className="w-11/12"  /> 
            
          </section>
          
        </form>

      </div>
    </>
  );
};

export default Onboarding;
