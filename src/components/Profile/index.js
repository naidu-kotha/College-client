import React from "react";
import { Button, Container } from "react-bootstrap";
import Cookies from "js-cookie";
import "./index.css";

function Profile() {
  const { fullname, email, image_url, date_of_birth } = JSON.parse(
    Cookies.get("userDetails")
  );
  const dateObj = new Date(date_of_birth);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  return (
    <Container fluid className="profile-back-container-total">
      <Container fluid className="profile-back-container">
        <Container
          fluid
          className="profile-container d-flex flex-column justify-content-center align-items-start"
        >
          <Container fluid>
            <img src={image_url} alt="pro" className="profile-img" />
          </Container>

          <h2>{fullname}</h2>
          <h4>{email}</h4>
          <h6>{formattedDate}</h6>
        </Container>
      </Container>
    </Container>
  );
}

export default Profile;
