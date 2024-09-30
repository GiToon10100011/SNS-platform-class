import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PostForm from "../components/PostForm";
import TimeLine from "../components/TimeLine";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 50px;
  height: 100vh;
`;

const Home = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <PostForm />
      <TimeLine />
    </Wrapper>
  );
};

export default Home;
