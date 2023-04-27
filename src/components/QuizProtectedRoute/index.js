import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function QuizProtectedRoute(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    console.log(token, email);
    Cookies.set("jwt_token", token, { expires: 10 });
    Cookies.set("email", email, { expires: 10 });
    setIsAuthenticated(true);
  });

  return <>{isAuthenticated ? props.children : null}</>;
}

export default QuizProtectedRoute;
