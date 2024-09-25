import React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

//키는 리액트의 어떠한 노드일거라는 뜻
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = auth.currentUser;
  console.log(user);
  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return children;
};

export default ProtectedRoute;
