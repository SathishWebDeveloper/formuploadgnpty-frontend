// import React, { useContext } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { Context } from "../../routes/routes";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//     const login = useContext(Context)
//     const navigate = useNavigate();
//     console.log("login", login)
//   return (
//     <div>
//       Register Page
//       <div>
//         <GoogleLogin
//           onSuccess={(credentialResponse) => {
//             login.setAuth(true);
//             // navigate('/upload');
//           }}
//           onError={() => {
//             console.log("Login Failed");
//           }}
//         />
//       </div>
//     </div>
//   );
// };
// export default Register;

import React, { useContext, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Context } from "../../routes/routes";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Register() {
  const login = useContext(Context);
  const navigate = useNavigate();
  const [response, setResponse] = useState("");

  const handleLoginSuccess = async (credentialResponse) => {
    setResponse((prev) => "");
    const idToken = credentialResponse.credential; // Token returned from Google
    console.log("idToken", idToken);
    try {
      // Send the token to the backend
      const response = await axios.post(
        "http://localhost:8000/api/auth/google-login",
        {
          idToken,
        }
      );
      const USER_CREDENTIAL = jwtDecode(credentialResponse.credential);
      console.log("123", USER_CREDENTIAL);
      console.log("User authenticated:", response.data);
      login.setAuth(true);
      login.setUser({
        name: USER_CREDENTIAL.name,
        email: USER_CREDENTIAL.email,
      });
      login.setaccessToken(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      setResponse(`${USER_CREDENTIAL.email} login is successfull`);
      setTimeout(() => navigate("/upload"), 2000);
      //   navigate("/upload");
    } catch (err) {
      console.log(
        "Error verifying token:",
        err.response.data.error.message
        // err.response?.data?.message || err.message
      );
      setResponse(err.response.data.error.message);
      //   alert("Login failed!");
    }
  };

  const handleLoginError = () => {
    console.error("Google Login failed.");
    alert("Login failed. Please try again.");
  };

  return (
    <div>
      <GoogleOAuthProvider clientId="418507945684-b9mc07dbfoeimvg6qa62bnobfo39op93.apps.googleusercontent.com">
        <h1>Google Sign-In Example</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "50%" }}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          </div>
        </div>
      </GoogleOAuthProvider>
      <div>{response && response}</div>
    </div>
  );
}

export default Register;
