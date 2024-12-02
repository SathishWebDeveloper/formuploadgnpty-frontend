import React from "react";
import { Routes , Route} from "react-router-dom";
import Register from "../pages/register/register";

const PublicPage = () => {
    return (
        <Routes>
          <Route path="/" element={<Register />} />
        </Routes>
      
    )
}
export default PublicPage;