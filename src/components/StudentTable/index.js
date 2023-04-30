import { Container, Pagination } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";
import "./index.css";
import axios from "axios";
import Sidebar1 from "../SampleSideBar";

function StudentTable() {
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const [studentScoresList, setStudentScoresList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const { email } = JSON.parse(Cookies.get("userDetails"));
  const ITEMS_PER_PAGE = 5;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const address = urlParams.get("email");

  console.log(email);

  const data = {
    email: address || email,
  };
  useEffect(() => {
    setSpinnerStatus(true);
    axios
      .post("/getscore", data)
      .then((response) => {
        console.log(response);
        setStudentScoresList(response.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setSpinnerStatus(false);
      });
  }, []);

  const indexOfLastItem = activePage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = studentScoresList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(studentScoresList.length / ITEMS_PER_PAGE);
    const ellipsis = <Pagination.Ellipsis disabled />;

    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 10 && i !== 1 && i !== totalPages) {
        if (i < activePage - 2 || i > activePage + 2) {
          if (!pageNumbers.includes(ellipsis)) {
            pageNumbers.push(ellipsis);
          }
          continue;
        }
      }
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === activePage}
          onClick={() => setActivePage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    const prevButton = (
      <Pagination.Prev
        disabled={activePage === 1}
        onClick={() => setActivePage(activePage - 1)}
      />
    );
    const nextButton = (
      <Pagination.Next
        disabled={activePage === totalPages}
        onClick={() => setActivePage(activePage + 1)}
      />
    );

    return [prevButton, pageNumbers, nextButton];
  };

  return (
    <Container fluid className="d-flex flex-row">
      <Sidebar1 />
      <Container fluid className="p-5 admin-table-container">
        <Container
          fluid
          className="d-flex d-row justify-content-between mr-2 mb-4 ml-5"
        >
          <h1 className="align-center">Student Marks</h1>
        </Container>
        {spinnerStatus ? (
          <Container className="spinner-container">
            <Spinner
              className="spinner"
              animation="border"
              size="lg"
              variant="primary"
            />
          </Container>
        ) : currentItems.length > 0 ? (
          <>
            <Container fluid className="admin-table-align">
              <Table
                responsive
                striped
                bordered
                hover
                className="admin-table admin-nowrap"
              >
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Test Date</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.test_id}</td>

                      <td>
                        {new Date(item.test_date).toLocaleDateString("en-GB")}
                      </td>
                      <td>{item.test_score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
            <Container fluid className="d-flex justify-content-center">
              <Pagination>{renderPageNumbers()}</Pagination>
            </Container>
          </>
        ) : (
          <Container
            fluid
            className="d-flex d-row align-items-center h-75 justify-content-center"
          >
            <h3>No Exams Taken</h3>
          </Container>
        )}
      </Container>
    </Container>
  );
}
export default StudentTable;
