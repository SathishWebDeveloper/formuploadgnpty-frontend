import React, { createContext, useEffect, useState } from "react";
import PublicPage from "./public";
import PrivatePage from "./private";
import { useNavigate } from "react-router-dom";

export const Context = createContext();

const AllRoutes = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  const [accessToken, setaccessToken] = useState("");

  const authkey = localStorage.getItem("accessToken") || "";

  const navigate = useNavigate();

  useEffect(() => {
    if (authkey) {
      navigate("/upload"); // Redirect to /upload if authKey exists initial navigate 
    }
  }, []);

  return (
    <Context.Provider
      value={{ auth, setAuth, user, setUser, accessToken, setaccessToken }}
    >
      {accessToken || authkey ? <PrivatePage /> : <PublicPage />}
    </Context.Provider>
  );
};
export default AllRoutes;
