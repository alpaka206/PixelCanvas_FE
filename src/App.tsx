import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Canvas from "./components/Canvas";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/authenticate", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        console.error("Authentication check failed:", error);
      });
  }, []);

  const handleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/google-login",
        { token: idToken },
        { withCredentials: true } // 쿠키를 포함한 요청
      );

      if (response.data.success) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <Canvas />
          </>
        ) : (
          <div>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
