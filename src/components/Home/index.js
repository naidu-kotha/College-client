import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import Sidebar1 from "../SampleSideBar";
import AdminGraph from "../../AdminGraph";
import Cookies from "js-cookie";
import axios from "axios";
import Charts from "../StudentGraph";
import "./index.css";

function Home() {
  const [studentScoresList, setStudentScoresList] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const role = Cookies.get("role");
  const { email } = JSON.parse(Cookies.get("userDetails"));
  const data = {
    email: email,
  };
  useEffect(() => {
    axios
      .post("/getscore", data)
      .then((response) => {
        // console.log(response.data);
        setStudentScoresList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const totalStudents = studentList.length;

  const totalInvitesSentObject = studentList.filter(
    (item) => item.invite === true
  );
  const totalInvitesSentCount = totalInvitesSentObject?.length;

  const totalNonInvites = totalStudents - totalInvitesSentCount;

  useEffect(() => {
    axios
      .post("/getstudents")
      .then((response) => {
        console.log(response);
        setStudentList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const totalTests = studentScoresList.length;
  const totalpassedTestsCount = studentScoresList.filter(
    (item) => item.test_score > 2
  );
  const totalPassedTest = totalpassedTestsCount.length;
  // console.log(totalPassedTest);

  return (
    <>
      <Container fluid className="d-flex flex-row">
        <Sidebar1 />
        <Container
          fluid
          className=" home-bg-container mr-5 d-flex flex-column justify-content-center"
        >
          <Container fluid className="d-flex flex-row justify-content-around">
            <Card className="home-invites-card mx-3">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <i className="fa fa-envelope fa-2x mb-3"></i>
                {role === "student" ? (
                  <h5>Total Tests</h5>
                ) : (
                  <h5>Total Invites</h5>
                )}
                {role === "student" ? (
                  <h1>{totalTests}</h1>
                ) : (
                  <h1>{totalInvitesSentCount} </h1>
                )}
              </Card.Body>
            </Card>
            <Card className="home-invites-card mx-3">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <i className="fa fa-envelope fa-2x mb-3"></i>
                {role === "student" ? (
                  <h5>Total pass</h5>
                ) : (
                  <h5>Total Non Invites</h5>
                )}
                {role === "student" ? (
                  <h1>{totalPassedTest}</h1>
                ) : (
                  <h1>{totalNonInvites}</h1>
                )}
              </Card.Body>
            </Card>
          </Container>
          <div className="home-chartss-align d-flex flex-row">
            {role === "student" ? <Charts /> : <AdminGraph />}
          </div>
        </Container>
      </Container>
    </>
  );
}

export default Home;

// import React from "react";
// import { Container } from "react-bootstrap";
// import Sidebar1 from "../SampleSideBar";
// //import SideBar from "../SideBar";
// import Charts from "../StudentGraph";
// import "./index.css";

// function Home() {
//   return (
//     <>
//       <Container fluid className="d-flex flex-row">
//         {/* <SideBar /> */}
//         <Sidebar1/>
//         <div
//           fluid
//           className=" home-bg-container mr-5 d-flex flex-column justify-content-center"
//         >
//           <div className="d-flex flex-row justify-content-around">
//             <div className="home-invites-card"></div>
//             <div className="home-invites-card"></div>
//           </div>
//           <div className="home-chartss-align d-flex flex-row">
//             <Charts />
//           </div>
//         </div>
//       </Container>
//     </>
//   );
// }

// export default Home;
