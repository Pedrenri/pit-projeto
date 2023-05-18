import { useState } from "react";
import Nav from "../components/Nav";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    url: "",
    matches: [],
  });

  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put('http://localhost:8000/user', {formData}) 
      console.log(response)
      const success = response.status === 200
      if (success) navigate('/dashboard')
    } catch(err) {
      console.log(err)
    }
  };

  const handleChange = (e) => {
    console.log("e", e);
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name] : value
    }));
  };

  console.log(formData)

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showmodal={false} />
      <div className="onboarding">
        <h2>CREATE ACCOUNT</h2>
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex justify-center "
        >
          <section>
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="First Name"
              required
              value={formData.first_name}
              onChange={handleChange}
            />

            <label>Birthday</label>
            <div className="multInputContainer">
              <input
                type="number"
                id="dob_day"
                name="dob_day"
                placeholder="DD"
                required
                value={formData.dob_day}
                onChange={handleChange}
              />
              <input
                type="number"
                id="dob_month"
                name="dob_month"
                placeholder="MM"
                required
                value={formData.dob_month}
                onChange={handleChange}
              />
              <input
                type="number"
                id="dob_year"
                name="dob_year"
                placeholder="YYYY"
                required
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>
            <label>Gender</label>
            <div className="multInputContainer">
              <input
                type="radio"
                id="man_gender_id"
                name="gender_identity"
                value="man"
                onChange={handleChange}
                checked={formData.gender_identity === 'man'}
              />
              <label htmlFor="man_gender_id">Man</label>
              <input
                type="radio"
                id="woman_gender_id"
                name="gender_identity"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_identity === 'woman'}
              />
              <label htmlFor="woman_gender_id">Woman</label>
              <input
                type="radio"
                id="more_gender_id"
                name="gender_identity"
                value="more"
                onChange={handleChange}
                checked={formData.gender_identity === 'more'}
              />
              <label htmlFor="more_gender_id">More</label>
            </div>
            <label htmlFor="show-gender">Show gender on my profile</label>
            <input
              type="checkbox"
              id="show-gender"
              name="show_gender"
              onChange={handleChange}
              checked={formData.show_gender}
            />

            <input type="submit" />
          </section>

          <section>
            <label htmlFor="url">Profile Picture</label>
            <input
              type="url"
              name="url"
              id="url"
              onChange={handleChange}
              required
            />
            <div className="photo-container">
              {formData.url && <img src={formData.url} alt="profile-pic-preview" />}
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default Onboarding;
