import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  padding: 50px 0;
`;
const Title = styled.h1`
  font-size: 42px;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 30px;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  &[type="submit"] {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  &:focus {
    outline: none;
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

const CreateAccount = () => {
  //데이터를 가져오는 도중에 오류가 발생했는지 확인
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const { value, name } = e.target;
    const {
      target: { value, name },
    } = e;
    if (name === "name") setName(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || name === "" || email === "" || password === "") return;
    //정상적으로 작동될때 실행되는 try
    try {
      //create an account
      await createUserWithEmailAndPassword(auth, email, password);
      //set the name of the user
      // redirect to home page
    } catch (e) {
      //setError()
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log into ⭐</Title>
      <Form onSubmit={handleOnSubmit}>
        <Input
          onChange={handleOnChange}
          type="text"
          name="name"
          value={name}
          placeholder="Name"
          required
        />
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
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
};

export default CreateAccount;
