import React from "react";
import { Container } from "react-bootstrap";
import Cookies from "js-cookie";
import "./index.css";

function Profile() {
  const { fullname, email } = JSON.parse(Cookies.get("userDetails"));
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return (
    <Container fluid className="profile-back-container-total">
      <Container fluid className="profile-back-container">
        <Container
          fluid
          className="profile-container d-flex flex-column justify-content-center align-items-start"
        >
          <h2>{fullname}</h2>
          <h4>{email}</h4>
          <h6>
            {date}-{month}-{year}
          </h6>
        </Container>
      </Container>
    </Container>
  );
}

export default Profile;
