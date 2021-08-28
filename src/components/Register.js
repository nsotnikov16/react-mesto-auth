import AuthForm from "./AuthForm";
import React from "react";
import { Link } from "react-router-dom";
export default function Register({ registration }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleChange(evt) {
    evt.target.name === "email"
      ? setEmail(evt.target.value)
      : setPassword(evt.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    registration(email, password);
  }
  return (
    <AuthForm
      title="Регистрация"
      titleBtn="Зарегистрироваться"
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      {/* <p className="auth__link">Уже зарегистрированы? Войти</p> */}
      <p>
        Уже зарегистрированы?{" "}
        <Link to="/sign-in" className="auth__link">
          Войти
        </Link>
      </p>
    </AuthForm>
  );
}
