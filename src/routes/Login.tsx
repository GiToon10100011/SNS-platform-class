import React, { useState } from "react";
import { auth } from "../firebase";
import styled from "styled-components";
import authStyles from "../components/auth-styles";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import GithubBtn from "../components/GithubBtn";

const { Wrapper, Title, Form, Input, Error, Switcher } = authStyles;

const Login = () => {
  //데이터를 가져오는 도중에 오류가 발생했는지 확인
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const { value, name } = e.target;
    const {
      target: { value, name },
    } = e;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const navigate = useNavigate();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || email === "" || password === "") return;
    //정상적으로 작동될때 실행되는 try
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      //setError()
      //타입이 일치하는지 확인
      if (e instanceof FirebaseError) setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Login ⭐</Title>
      <Form onSubmit={handleOnSubmit}>
        <Input
          onChange={handleOnChange}
          type="email"
          value={email}
          name="email"
          placeholder="Email"
          required
        />
        <Input
          onChange={handleOnChange}
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Login"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Do you not have an account?
        <Link to={"/create-account"}>Create one &rarr;</Link>`
      </Switcher>
      <GithubBtn/>
    </Wrapper>
  );
};

export default Login;
