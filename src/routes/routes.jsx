import React, { createContext, useState } from "react";
import PublicPage from "./public";
import PrivatePage from "./private";

export const Context = createContext();

const AllRoutes = () => {
  const [auth, setAuth] = useState(false);
  const [user,setUser] = useState({name : "" , email : ""}); 

  return (
    <Context.Provider value={{ auth, setAuth ,user , setUser }}>
      {auth ? <PrivatePage /> : <PublicPage />}
    </Context.Provider>
  );
};
export default AllRoutes;
