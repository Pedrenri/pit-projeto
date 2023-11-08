import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion"

const PetRegister = () => {
  const [cookies] = useCookies(["user"]);
  const [formData, setFormData] = useState({
    owner_id: cookies.UserId,
    owner_name: cookies.UserName,
    name: "",
    age: "",
    gender: "male",
    url: "",
    breed: "",
    matches: [],
  });
  const [breedOptions, setBreedOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/dog-breeds")
      .then((response) => {
        setBreedOptions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Executar somente uma vez no montar do componente

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8000/addpet", {
        formData,
      });
      console.log(response);
      const success = response.status === 200;
      if (success) navigate("/mypets");
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

  function handleMyPets() {
    navigate("/mypets")
  }

  console.log(formData);

  return (
    <>
      {/*  <Nav minimal={true} setShowModal={() => {}} showmodal={false} /> */}
      <div className="page-container">
        <motion.div className="onboarding page-content"initial={{ x: "100%" }} // Posição inicial fora da tela
        animate={{ x: 0 }} // Posição final na tela
        exit={{ x: "-100%" }} // Posição ao sair da tela
        transition={{ type: "spring", duration: 0.5 }}>
          <h2>CADASTRAR ANIMAL</h2>
          <form
            action=""
            onSubmit={handleSubmit}
            className="flex justify-center flex-col sm:flex-row items-center sm:items-start"
          >
            <section className="md:w-4/12 flex ">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nome do Animal"
                required
                value={formData.name}
                onChange={handleChange}
              />

              <label htmlFor="breed">Raça</label>
              <select
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
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

              <label>Idade</label>

              <input
                type="number"
                id="age"
                name="age"
                placeholder="AA"
                required
                value={formData.age}
                onChange={handleChange}
                maxLength="2"
                onInput={maxLengthCheck}
                className="w-4/12 md:w-1/5"
              />

              <label>Sexo</label>
              <div className="multInputContainer justify-center md:justify-start">
                <input
                  type="radio"
                  id="male_gender"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  checked={formData.gender === "male"}
                />
                <label htmlFor="male_gender">Macho</label>
                <input
                  type="radio"
                  id="female_gender"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  checked={formData.gender === "female"}
                />
                <label htmlFor="female_gender">Fêmea</label>
              </div>
            </section>

            <section className="w-full md:w-4/12 flex items-center ">
              <label htmlFor="url">Foto do Animal</label>
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
                  <img src={formData.url} alt="profile-pic-preview" className="max-h-72" />
                )}
              </div>
              <input type="submit" className="w-11/12" />
            </section>
            
          </form>
          <a className="text-sky-800" onClick={handleMyPets}>Todos os Meus Pets</a>
        </motion.div>
      </div>
    </>
  );
};

export default PetRegister;
