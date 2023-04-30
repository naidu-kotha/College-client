import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

function QuizProtectedRoute(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");
    // const email = urlParams.get("email");
    // console.log(token, email);
    axios.post("/quizauthentication/", { token }).then((response) => {
      if (response.statusText === "OK") {
        const email = response.data.email;
        console.log(response);
        Cookies.set("jwt_token", token, { expires: 10 });
        Cookies.set("email", email, { expires: 10 });
        setIsAuthenticated(true);
      } else {
        toast.warning("Your test has expired");
      }
    });
  }, []);

  return <>{isAuthenticated ? props.children : null}</>;
}

export default QuizProtectedRoute;
