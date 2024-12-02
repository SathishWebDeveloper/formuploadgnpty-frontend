import React,{createContext, useState} from "react";
import PublicPage from "./public";
import PrivatePage from "./private";


const Context = createContext();

const AllRoutes = () => {
    const [auth , setAuth] = useState(false);
    
    return (
        <Context.Provider value={{auth,setAuth}}>
            {!auth ?  <PrivatePage /> : <PublicPage/>}
        </Context.Provider>
    )
}
export default AllRoutes;