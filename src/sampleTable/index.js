// import {
//   Container,
//   Button,
//   Pagination,
//   Modal,
//   ModalBody,
//   ModalHeader,
//   Form,
//   FormControl,
// } from "react-bootstrap";
// import React, { useState, useEffect } from "react";
// import Table from "react-bootstrap/Table";
// import MyVerticallyCenteredModal from "../components/AddStudentForm";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import "./index.css";
// import axios from "axios";
// import Sidebar1 from "../components/SampleSideBar";

// function AdminTable2() {
//   const [modalShow, setModalShow] = React.useState(false);
//   const [inviteModal, setInviteModal] = useState(false);
//   const [studentList, setStudentList] = useState([]);

//   const [activePage, setActivePage] = useState(1);
//   const [selectedMail, setSelectedMail] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState(null);
//   const [sortOrder, setSortOrder] = useState(null);
//   const ITEMS_PER_PAGE = 5;

//   const onclickInvite = (email) => {
//     toggleInviteModal();
//     setSelectedMail(email);
//   };

//   const sendInvite = () => {
//     const email = selectedMail;
//     const link = "http://192.168.1.249:3000";
//     console.log(email, link);
//     const body = { to: email, link };
//     console.log(body);
//     axios
//       .post("/sendmail", body)
//       .then((response) => {
//         console.log(response.data);
//         if (response.statusText === "OK") {
//           toast.success("Mail sent successfully ");
//         }
//       })
//       .catch((e) => {
//         toast.warning("Mail not sent");
//       });
//     toggleInviteModal();
//   };

//   const toggleInviteModal = () => {
//     setInviteModal(!inviteModal);
//   };

//   const emailModal = () => {
//     return (
//       <Modal centered size="lg" show={inviteModal} onHide={toggleInviteModal}>
//         <ModalHeader>
//           <ModalBody>
//             <h5>Do you want to send exam Invitation to {selectedMail} ?</h5>
//             <Container className="d-flex flex-row justify-content-center mt-5 m-auto">
//               <Button className="invite-model-btn-yes" onClick={sendInvite}>
//                 Yes
//               </Button>
//               <Button onClick={toggleInviteModal}>No</Button>
//             </Container>
//           </ModalBody>
//         </ModalHeader>
//       </Modal>
//     );
//   };

//   useEffect(() => {
//     axios
//       .get("/getstudents")
//       .then((response) => {
//         console.log(response);
//         setStudentList(response.data);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }, []);

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//     setActivePage(1);
//   };

//   const handleSort = (column) => {
//     if (column === sortBy) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortOrder("asc");
//     }
//   };

//   const sortedStudentList = studentList.slice().sort((a, b) => {
//     if (sortBy === "fullname") {
//       if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
//       if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
//       return 0;
//     }
//     if (sortBy === "email") {
//       if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
//       if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
//       return 0;
//     } else if (sortBy === "phone") {
//       if (a[sortBy] < b[sortBy]) return -1;
//       if (a[sortBy] > b[sortBy]) return 1;
//       return 0;
//     } else if (sortBy === "status") {
//       if (a[sortBy] < b[sortBy]) return -1;
//       if (a[sortBy] > b[sortBy]) return 1;
//       return 0;
//     } else {
//       return 0;
//     }
//   });

//   const filteredStudentList = sortedStudentList.filter((student) =>
//     student.fullname.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const indexOfLastItem = activePage * ITEMS_PER_PAGE;
//   const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
//   const currentStudentList = filteredStudentList
//     .sort((a, b) => {
//       if (sortBy) {
//         return sortOrder === "asc"
//           ? handleSort(a[sortBy], b[sortBy])
//           : handleSort(b[sortBy], a[sortBy]);
//       }
//       return 0;
//     })
//     .slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber) => {
//     setActivePage(pageNumber);
//   };

//   const handleModalShow = () => {
//     setModalShow(true);
//   };

//   const handleModalClose = () => {
//     setModalShow(false);
//   };
//   return (
//     <div>
//       <Sidebar1 />
//       <div className="admin-table-container">
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <h4 className="card-title">Student List</h4>
//                   </div>
//                   <div className="col-md-6 text-right">
//                     <Button variant="success" onClick={handleModalShow}>
//                       Add Student
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-md-12">
//                   <div className="table-responsive">
//                     <Table striped bordered hover>
//                       <thead>
//                         <tr>
//                           <th onClick={() => handleSort("fullname")}>
//                             Name{" "}
//                             {sortBy === "fullname" &&
//                               (sortOrder === "asc" ? (
//                                 <i className="fa fa-sort-asc"></i>
//                               ) : (
//                                 <i className="fa fa-sort-desc"></i>
//                               ))}
//                           </th>
//                           <th>Email</th>
//                           <th>Date Of Birth</th>
//                           <th>Status</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentStudentList.map((student) => (
//                           <tr key={student.id}>
//                             <td>{student.fullname}</td>
//                             <td>{student.email}</td>
//                             <td>{student.date_of_birth}</td>
//                             <td>{student.status}</td>
//                             <td>
//                               <Button
//                                 onClick={() => onclickInvite(student.email)}
//                                 variant="info"
//                               >
//                                 Invite
//                               </Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* <Container fluid className="d-flex justify-content-center">
//             <Pagination>{renderPageNumbers()}</Pagination>
//           </Container> */}
//         </div>
//         {emailModal()}
//         <ToastContainer />
//       </div>
//     </div>
//   );
// }
// export default AdminTable2;
