import React from "react";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { codeEscape } from "../utils/constants";
import api from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { register, authorize, checkToken } from "../utils/auth.js";

function App() {

  // Authorization & Registration
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [mailUser, setMailUser] = React.useState("");
  const [isRegisterSuccess, setIsRegisterSuccess] = React.useState(false);

  const history = useHistory();

  function authorization(email, password) {
    authorize(email, password)
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => alert(err));
  }

  function registration (email, password) {
    register(email, password).then((res) => {
      if(res.ok) {
        setIsRegisterSuccess(true)
      } else {
        setIsRegisterSuccess(false)
      }
      
    }).then(setIsInfoTooltip(true));
  }

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      checkToken(jwt).then((res) => {
        if (res) {
          setLoggedIn(true);
          setMailUser(res.data.email);
          history.push("/");
        }
      });
    }
  }, [loggedIn, history]);

  function signOut(location) {
    if (location === "/") {
      setLoggedIn(false);
      localStorage.removeItem("jwt");
      history.push("/sign-in");
    }
  }

  //Profile & Cards
  const [currentUser, setCurrentUser] = React.useState({});

  const [cards, setCards] = React.useState([]);
  const [currentCard, setCurrentCard] = React.useState([]);

  React.useEffect(
    () =>
      api
        .getInitialCards()
        .then((cardsData) => setCards(cardsData))
        .catch((err) => alert(err)),
    []
  );

  React.useEffect(() => {
    api
      .getUserData()
      .then((userdata) => setCurrentUser(userdata))
      .catch((err) => alert(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) =>
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        )
      );
  }

  function submitConfirmPopup(setButtonText, setButtonDisabled) {
    setButtonText("Удаление...");

    api
      .deleteCard(currentCard._id)
      .then(() => {
        setCards(cards.filter((c) => c._id !== currentCard._id));
        closeAllPopups();
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setButtonText("Да");
        setButtonDisabled(false);
      });
  }

  function handleCardDelete(card) {
    setIsConfirmPopupOpen(!isConfirmPopupOpen);
    setCurrentCard(card);
  }

  // Popups

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isInfoTooltip, setIsInfoTooltip] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    name: "",
    link: "",
  });

  const [isHoverAvatar, setIsHoverAvatar] = React.useState(false);
  const [isVisibleEditAvatar, setIsVisibleEditAvatar] = React.useState(false);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleInfoTooltip() {
    setIsInfoTooltip(false);
  }

  function handleEscClosePopup(evt) {
    evt.keyCode === codeEscape && closeAllPopups();
  }

  function handleCardClick(data) {
    setSelectedCard({ link: data.link, name: data.name });
  }

  function closeAllPopups() {
    isEditProfilePopupOpen && setIsEditProfilePopupOpen(false);
    isEditAvatarPopupOpen && setIsEditAvatarPopupOpen(false);
    isAddPlacePopupOpen && setIsAddPlacePopupOpen(false);
    isConfirmPopupOpen && setIsConfirmPopupOpen(false);
    isInfoTooltip && setIsInfoTooltip(false);
    selectedCard.link && setSelectedCard({ name: "", link: "" });
  }

  function hoverEditAvatar() {
    setIsVisibleEditAvatar(!isVisibleEditAvatar);
    setIsHoverAvatar(!isHoverAvatar);
  }

  function handleOverlayClick(evt) {
    evt.target === evt.currentTarget && closeAllPopups();
  }

  function handleUpdateUser(data, setButtonText, setButtonDisabled) {
    api
      .editProfile(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setButtonText("Сохранить");
        setButtonDisabled(false);
      });
  }

  function handleUpdateAvatar(data, setButtonText, setButtonDisabled, form) {
    api
      .editAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
        form.reset();
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setButtonText("Сохранить");
        setButtonDisabled(false);
      });
  }

  function handleAddPlaceSubmit(data, setButtonText, setButtonDisabled, form) {
    api
      .addNewCardServer(data)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
        form.reset();
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setButtonText("Создать");
        setButtonDisabled(false);
      });
  }

  React.useEffect(() => {
    (isEditProfilePopupOpen ||
      isEditAvatarPopupOpen ||
      isAddPlacePopupOpen ||
      isConfirmPopupOpen ||
      isInfoTooltip ||
      selectedCard.name !== "") &&
      document.addEventListener("keydown", handleEscClosePopup)

    return () => document.removeEventListener("keydown", handleEscClosePopup);
  });


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__content">
          <Header signOut={signOut} mail={mailUser} />
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onCardOpen={handleCardClick}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onHoverAvatar={hoverEditAvatar}
              isHover={isHoverAvatar}
              isVisible={isVisibleEditAvatar}
              onCardDelete={handleCardDelete}
              onCardLike={handleCardLike}
              cards={cards}
            />
            <Route path="/sign-in">
              <Login authorization={authorization} />
            </Route>
            <Route path="/sign-up">
              <Register registration={registration} />
            </Route>
            <Route path="/">
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>
          <Footer />
          <InfoTooltip
            isSuccess={isRegisterSuccess}
            isOpen={isInfoTooltip}
            onClose={closeAllPopups}
            handleOverlay={handleInfoTooltip}
            history={history}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            handleOverlay={handleOverlayClick}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            handleOverlay={handleOverlayClick}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            handleOverlay={handleOverlayClick}
            onAddPlace={handleAddPlaceSubmit}
          />
          <ImagePopup
            onClose={closeAllPopups}
            card={selectedCard}
            isOpen={selectedCard.link}
            handleOverlay={handleOverlayClick}
          />
          <ConfirmPopup
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            handleOverlay={handleOverlayClick}
            onConfirm={submitConfirmPopup}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
