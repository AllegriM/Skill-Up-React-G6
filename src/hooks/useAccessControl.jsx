import { useState } from "react";

export function useAccessControl() {
  const [stateLogin, setStateLogin] = useState({
    error: false,
    correct: false,
  });

  const [stateSignUp, setStateSignUp] = useState({
    error: false,
    correct: false,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resultLogin, setResultLogin] = useState({});
  const [token, setToken] = useState("");
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });

  const [dataSignUp, setDataSignUp] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  // SIGN-UP
  async function signUp(e) {
    e.preventDefault();

    try {
      console.log("SIGN-UP-FORM: ", dataSignUp);
      const response = await fetch(
        "http://wallet-main.eba-ccwdurgr.us-east-1.elasticbeanstalk.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(dataSignUp),
        }
      );

      const data = await response.json();
      setStateSignUp({...stateSignUp, error: false, correct: true });
      console.log("SIGN-UP-RESPONSE: ", data);

      setDataSignUp({
        ...dataSignUp,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setStateSignUp({...stateSignUp, error: true, correct: false });
      console.log("Error: ", error);
      setDataSignUp({
        ...dataSignUp,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    }
  }
  //

  // LOGIN
  async function login(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://wallet-main.eba-ccwdurgr.us-east-1.elasticbeanstalk.com/auth/login",
        {
          body: JSON.stringify(dataLogin),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );

      const data = await response.json();
      setStateLogin({...stateLogin, error: false, correct: true });
      setDataLogin({ ...dataLogin, email: "", password: "" });
      getLogin(data.accessToken);

    } catch (error) {
      console.log("Error: ", error);
      setStateLogin({...stateLogin, error: true, correct: false})
      setDataLogin({ ...dataLogin, email: "", password: "" });
    }
  }

  // GET LOGIN
  async function getLogin(token) {
    // STATES - Auth - Token
    setIsAuthenticated(true);
    setToken(token);

    try {
      const bearerToken = `Bearer ${token}`;
      const response = await fetch(
        "http://wallet-main.eba-ccwdurgr.us-east-1.elasticbeanstalk.com/auth/me",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: bearerToken,
          },
          method: "GET",
        }
      );
      const data = await response.json();
      setResultLogin(data);
      localStorage.setItem("loggedInUser", JSON.stringify(data));
      sessionStorage.setItem("tokenUser", JSON.stringify(token));

    } catch (error) {
      console.log("Error: ", error);
    }
  }

  return {
    setDataLogin,
    setDataSignUp,
    login,
    signUp,
    isAuthenticated,
    dataSignUp,
    dataLogin,
    resultLogin,
    stateLogin,
    stateSignUp,
  };
}
