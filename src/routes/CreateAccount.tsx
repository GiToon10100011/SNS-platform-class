import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import authStyles from "../components/auth-styles";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const { Wrapper, Title, Form, Input, Error, Switcher } = authStyles;

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

  const navigate = useNavigate();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || name === "" || email === "" || password === "") return;
    //정상적으로 작동될때 실행되는 try
    try {
      setIsLoading(true);
      //create an account
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //set the name of the user
      await updateProfile(credentials.user, {
        displayName: name,
        photoURL:
          "//ecimg.cafe24img.com/pg1108b74246837003/tyler10034/YDH/%EC%97%BC%EC%B9%98.jpg",
      });
      navigate("/");
      // redirect to home page
      //객체와 같은경우에는 Object 타입으로 지정은 할 수 있으나, 나중에 객체안에 중첩된 자료형의 자료가 바뀌어도 타입검사를 하지 않는 느슨함이 발생한다. 이때 interface || type을 통해 커스텀타입을 제작하여 타입을 정의하는것이 좋다 . 또한, type과는 달리 interface는 extends라는 확장성을 가진다 type은 간단한 문법이 장점으로, 함수의 타입을 정의할때 주로 사용된다.
    } catch (e) {
      //setError()
      if (e instanceof FirebaseError) setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Create Account ⭐</Title>
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
      <Switcher>
        Do you already have an account?
        <Link to={"/login"}>Login &rarr;</Link>`
      </Switcher>
    </Wrapper>
  );
};

export default CreateAccount;
