import React, { useState } from "react";
import AddPetImg from "../assets/addPet.png";
import UpdateAcc from "./UpdateAccount";

function AddPet( {user}) {
    const [showModal, setShowModal] = useState(null)

    const showPetModal = () => {
        setShowModal(true)
    }

  return (
    <>
      <div className="add-pet">
        <a onClick={showPetModal}>
          <img src={AddPetImg} />
        </a>
      </div>
      {showModal && user && <UpdateAcc setShowModal={setShowModal}/>}
    </>
  );
}

export default AddPet;
