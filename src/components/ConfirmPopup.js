import React from "react";
import PopupWithForm from "./PopupWithForm";

function ConfirmPopup({ isOpen, onClose, handleOverlay, onConfirm }) {
  const [buttonText, setButtonText] = React.useState("Да");
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setButtonDisabled(true);
    onConfirm(setButtonText, setButtonDisabled);
  }

  return (
    <PopupWithForm
      name="confirm"
      title="Вы уверены?"
      buttonText={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      handleOverlay={handleOverlay}
      buttonDisabled={buttonDisabled}
      onSubmit={handleSubmit}
    />
  );
}

export default ConfirmPopup;
