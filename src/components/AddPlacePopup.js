import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, handleOverlay, onAddPlace }) {
  const nameCardRef = React.useRef();
  const linkCardRef = React.useRef();
  const [buttonText, setButtonText] = React.useState("Создать");
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setButtonText("Создание...");
    setButtonDisabled(true);
    onAddPlace(
      {
        name: nameCardRef.current.value,
        link: linkCardRef.current.value,
      },
      setButtonText,
      setButtonDisabled,
      e.target
    );
  }

  return (
    <PopupWithForm
      name="newplace"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      handleOverlay={handleOverlay}
      buttonText={buttonText}
      buttonDisabled={buttonDisabled}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__fieldset">
        <input
          type="text"
          name="name"
          id="name-newplace-input"
          placeholder="Название"
          className="popup__input popup__input_field_nameplace"
          minLength="2"
          maxLength="30"
          ref={nameCardRef}
          required
        />
        <span
          className="popup__input-error"
          id="name-newplace-input-error"
        ></span>
      </fieldset>
      <fieldset className="popup__fieldset">
        <input
          type="url"
          name="link"
          id="link-newplace-input"
          placeholder="Ссылка на картинку"
          className="popup__input popup__input_field_link"
          ref={linkCardRef}
          required
        />
        <span
          className="popup__input-error"
          id="link-newplace-input-error"
        ></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
