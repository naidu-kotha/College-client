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
import QuizProtectedRoute from "./components/QuizProtectedRoute";
import SubmitPage from "./components/SubmitPage";

import StudentTable from "./components/StudentTable";

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
          // exact
          element={
            // role === "student" ? (
            // <ProtectedRoute>
            <StudentTable />
            // </ProtectedRoute>
            // ) : (
            //   <ProtectedRoute>
            //     <StudentTable />
            //   </ProtectedRoute>
            // )
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
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/quiz"
          element={
            <QuizProtectedRoute>
              <Quiz />
            </QuizProtectedRoute>
          }
        />
        <Route path="/submitsuccess" exact element={<SubmitPage />} />
        <Route path="/notfound" element={<NotFound />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
