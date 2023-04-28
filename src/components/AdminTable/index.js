import {
  Container,
  Button,
  Pagination,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormControl,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import MyVerticallyCenteredModal from "../AddStudentForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AiOutlineDelete } from "react-icons/ai";
import { format } from "date-fns";
import axios from "axios";
import Sidebar1 from "../SampleSideBar";
import Spinner from "react-bootstrap/Spinner";
import Cookies from "js-cookie";

function AdminTable() {
  const [modalShow, setModalShow] = React.useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedMail, setSelectedMail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const ITEMS_PER_PAGE = 5;
  const testId = "Test-2";
  const today = format(new Date(), "yyyy-MM-dd");

  const onclickInvite = (email) => {
    toggleInviteModal();
    setSelectedMail(email);
  };

  const onClickDeleteStudent = (email) => {
    console.log({ email });
    axios
      .delete("/deletestudent", { params: { email: `${email}` } })
      .then((response) => {
        console.log(response);
        if (response.statusText === "OK") {
          console.log(response.data);
          toast.success("Student deleted");
          setShowToast(!showToast);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const sendInvite = () => {
    const email = selectedMail;
    const link = "http://192.168.0.41:3000/quiz";

    console.log(email, link);
    const body = { to: email, link, testId, testDate: today };
    console.log(body);
    axios
      .post("/sendmail", body)
      .then((response) => {
        console.log(response.data);
        if (response.statusText === "OK") {
          toast.success("Mail sent successfully ");
          setShowToast(!showToast);
        }
      })
      .catch((e) => {
        toast.warning("Mail not sent");
      });
    toggleInviteModal();
  };

  // console.log(sendMailInfo);

  const toggleInviteModal = () => {
    setInviteModal(!inviteModal);
  };

  const emailModal = () => {
    return (
      <Modal centered size="lg" show={inviteModal} onHide={toggleInviteModal}>
        <ModalHeader>
          <ModalBody>
            <h5>Do you want to send exam Invitation to {selectedMail} ?</h5>
            <Container className="d-flex flex-row justify-content-center mt-5 m-auto">
              <Button className="invite-model-btn-yes" onClick={sendInvite}>
                Yes
              </Button>
              <Button onClick={toggleInviteModal}>No</Button>
            </Container>
          </ModalBody>
        </ModalHeader>
      </Modal>
    );
  };

  useEffect(() => {
    setSpinnerStatus(true);
    axios
      .post("/getstudents")
      .then((response) => {
        console.log(response);
        setStudentList(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setSpinnerStatus(false);
      });
  }, [showToast]);

  const onChangeChecked = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const searchText = event.target.value;
    if (searchText.length >= 3 || searchText === "") {
      axios
        .post("/getstudents/", { searchText })
        .then((response) => {
          console.log(response);
          setStudentList(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  let filteredStudentList = studentList;
  // .filter((student) =>
  //   student.fullname.toLowerCase().includes(searchQuery.trim().toLowerCase())
  // );

  if (isChecked) {
    filteredStudentList = filteredStudentList.filter(
      (student) => student.invite === false
    );
  }

  const indexOfLastItem = activePage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredStudentList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(studentList.length / ITEMS_PER_PAGE);
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData = sortColumn
    ? currentItems.sort((a, b) => {
        let comparison = 0;
        if (typeof a[sortColumn] === "string") {
          comparison = a[sortColumn].localeCompare(b[sortColumn]);
        } else if (typeof a[sortColumn] === "number") {
          comparison = a[sortColumn] - b[sortColumn];
        }
        return sortOrder === "asc" ? comparison : -comparison;
      })
    : currentItems;

  return (
    <Container fluid className="d-flex flex-row">
      <Sidebar1 />
      <Container fluid className="p-5 admin-table-container">
        <Container
          fluid
          className="d-flex d-row justify-content-between mr-2 mb-4 ml-5"
        >
          <h1 className="align-center">StudentDetails</h1>
          <Button
            className="admin-addstudent-btn"
            variant="primary"
            onClick={() => setModalShow(true)}
          >
            Add Student
          </Button>
        </Container>

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <Container fluid className="admin-table-align">
          <Container fluid>
            <Form className=" mb-3 d-flex flex-row align-items-center">
              <FormControl
                type="text"
                placeholder="Search by student name"
                className="mr-sm-2 admin-table-search-input"
                value={searchQuery}
                onChange={handleSearch}
              />

              <Form.Check
                checked={isChecked}
                type="checkbox"
                label="Non Invites List"
                onChange={onChangeChecked}
                className="admin-table-checkbox-input "
              />
            </Form>
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
          ) : (
            <Table
              responsive
              striped
              bordered
              hover
              className="admin-table admin-nowrap"
            >
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>
                    ID
                    {sortColumn === "id" && (
                      <i
                        className={`fa fa-arrow-${
                          sortOrder === "asc" ? "up" : "down"
                        }`}
                      />
                    )}
                  </th>
                  <th onClick={() => handleSort("fullname")}>
                    Student Full Name
                    {sortColumn === "fullname" && (
                      <i
                        className={`fa fa-arrow-${
                          sortOrder === "asc" ? "up" : "down"
                        }`}
                      />
                    )}
                  </th>
                  <th>Gender</th>
                  <th onClick={() => handleSort("email")}>
                    Email
                    {sortColumn === "email" && (
                      <i
                        className={`fa fa-arrow-${
                          sortOrder === "asc" ? "up" : "down"
                        }`}
                      />
                    )}
                  </th>
                  <th onClick={() => handleSort("date_of_birth")}>
                    Date of Birth
                    {sortColumn === "date_of_birth" && (
                      <i
                        className={`fa fa-arrow-${
                          sortOrder === "asc" ? "up" : "down"
                        }`}
                      />
                    )}
                  </th>
                  <th>Action</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <Link
                        className="student-link"
                        to={`../studentmarks/?email=${item.email}`}
                      >
                        {item.fullname}
                      </Link>
                    </td>
                    <td>{item.gender}</td>
                    <td>{item.email}</td>
                    <td>
                      {new Date(item.date_of_birth).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      {!item.invite && (
                        <Button
                          variant="primary"
                          onClick={() => onclickInvite(item.email)}
                        >
                          Invite
                        </Button>
                      )}
                      {item.invite && (
                        <Button variant="primary" disabled>
                          Invite
                        </Button>
                      )}
                    </td>
                    <td>
                      <Button
                        onClick={() => onClickDeleteStudent(item.email)}
                        variant="none"
                      >
                        <AiOutlineDelete size={22} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>
        <Container fluid className="d-flex justify-content-center">
          <Pagination>{renderPageNumbers()}</Pagination>
        </Container>
      </Container>
      {emailModal()}
      <ToastContainer />
    </Container>
  );
}
export default AdminTable;
