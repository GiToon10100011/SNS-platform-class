import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PostForm from "../components/PostForm";

const Wrapper = styled.div``;

const Home = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <PostForm />
    </Wrapper>
  );
};

export default Home;
