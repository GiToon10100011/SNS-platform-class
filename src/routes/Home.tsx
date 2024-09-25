import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <h1>
      <button onClick={handleLogout}>Logout</button>
    </h1>
  );
};

export default Home;
