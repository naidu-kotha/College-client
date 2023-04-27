// eslint-disable-next-line
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import AdminTable from "./components/AdminTable";
import Quiz from "./components/Questions";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute/AdminProtectedRoute";

import StudentTable from "./components/studentTable";

//import AdminTable2 from "./sampleTable";

import "./index.css";
import Cookies from "js-cookie";

function App() {
  const role = Cookies.get("role");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" exact element={<LoginPage />} />
        <Route
          path="/"
          exact
          element={
            role !== "admin" ? (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            ) : (
              <AdminProtectedRoute>
                <Home />
              </AdminProtectedRoute>
            )
          }
        />

        <Route
          path="/studentmarks"
          exact
          element={
            role === "student" ? (
              <ProtectedRoute>
                <StudentTable />
              </ProtectedRoute>
            ) : (
              <NotFound />
            )
          }
        />
        <Route
          path="/admintable"
          exact
          element={
            role === "admin" ? (
              <AdminProtectedRoute>
                <AdminTable />
              </AdminProtectedRoute>
            ) : (
              <NotFound />
            )
          }
        />
        <Route
          path="/quiz"
          exact
          element={
            role !== "admin" ? (
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            ) : (
              <AdminProtectedRoute>
                <Quiz />
              </AdminProtectedRoute>
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
