import AuthForm from "./AuthForm";
import React from "react";
export default function Login({ authorization }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleChange(evt) {
    evt.target.name === "email"
      ? setEmail(evt.target.value)
      : setPassword(evt.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    authorization(email, password);
  }

  return (
    <AuthForm
      title="Вход"
      titleBtn="Войти"
      email={email}
      password={password}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
