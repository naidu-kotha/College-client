import React, { useState, useEffect } from "react";
//import Profile from "../Profile";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
} from "react-bootstrap";
import Cookies from "js-cookie";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import axios from "axios";

function Quiz() {
  const navigate = useNavigate();
  const testName = "Test-2";
  Cookies.set("testId", testName, { expires: 10 });

  const questions = [
    {
      id: 1,
      text: "1. What is the Capital of India?",
      options: [
        { id: "a", text: "Delhi" },
        { id: "b", text: "hyderabad" },
        { id: "c", text: "bangalore" },
        { id: "d", text: "mumbai" },
      ],
      correctAnswer: "a",
    },
    {
      id: 2,
      text: "2. Who is the prime minster of India?",
      options: [
        { id: "a", text: "Amith Shaw" },
        { id: "b", text: "Rahul Gandhi" },
        { id: "c", text: "Narendra modi" },
        { id: "d", text: "Rajnadh Singh" },
      ],
      correctAnswer: "c",
    },
    {
      id: 3,
      text: "3. 9+8=?",
      options: [
        { id: "a", text: "20" },
        { id: "b", text: "15" },
        { id: "c", text: "10" },
        { id: "d", text: "17" },
      ],
      correctAnswer: "d",
    },
    {
      id: 4,
      text: "4. How many planets in our solar system?",
      options: [
        { id: "a", text: "7" },
        { id: "b", text: "6" },
        { id: "c", text: "5" },
        { id: "d", text: "8" },
      ],
      correctAnswer: "d",
    },
    {
      id: 5,
      text: "5. What is the chemical formula for water?",
      options: [
        { id: "a", text: "H2O" },
        { id: "b", text: "CO2" },
        { id: "c", text: "NaCl" },
        { id: "d", text: "HCl" },
      ],
      correctAnswer: "a",
    },
  ];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answersObj, setAnswersObj] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(
    questions[questionIndex]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const email = Cookies.get("email");
  const handleOptionChange = (event) => {
    // console.log(event.target);
    setSelectedOption(event.target.value);

    console.log(selectedOption);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let score = 0;
    Object.keys(answersObj).forEach((questionId) => {
      const answer = answersObj[questionId];

      const question = questions.find((q) => q.id === parseInt(questionId));

      if (question.correctAnswer === answer) {
        score++;
      }
    });
    console.log(score);
    setTotalScore(score);

    toggleModal();
    const submitDetails = {
      testId: testName,
      email: email,
      score: score,
    };
    console.log(submitDetails);
    axios
      .patch("/studentscore", submitDetails)
      .then((response) => {
        if (response.statusText === "OK") {
          console.log(response.data);
          Cookies.remove("jwt_token");
          Cookies.remove("email");
          setTimeout(() => {
            navigate("/submitsuccess", { replace: true });
          }, 2000);
        }
      })
      .catch((e) => {
        const data = e.response.data;
        console.log(data);
        if (data.constraint === "test_details_test_id_student_email_key") {
          setErrorMsg("you have already completed this test");
          console.log(errorMsg);
        }
      });
    Cookies.remove("questionIndex");
  };

  const handlePreviousQuestion = () => {
    setQuestionIndex(questionIndex - 1);
    // Cookies.set("questionIndex", questionIndex);
  };

  const handleNextQuestion = (event) => {
    event.preventDefault();
    setQuestionIndex(questionIndex + 1);
    // Cookies.set("questionIndex", questionIndex);
  };

  useEffect(() => {
    // const Index = Cookies.get("questionIndex");
    setCurrentQuestion(questions[questionIndex]);
    setSelectedOption(answersObj[questionIndex + 1] || null);
  }, [questionIndex]);

  useEffect(() => {
    const newAnswer = { [currentQuestion.id]: selectedOption };
    const updatedAnswerObj = { ...answersObj, ...newAnswer };

    setAnswersObj(updatedAnswerObj);
  }, [selectedOption]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const scoreModal = () => {
    return (
      <Modal centered size="xs" show={isModalOpen} onHide={toggleModal}>
        <ModalHeader closeButton></ModalHeader>
        <ModalBody className="d-flex flex-column justify-content-center align-items-center">
          <h1>Score: {totalScore}</h1>
        </ModalBody>
      </Modal>
    );
  };

  return (
    <Container fluid className="quiz-total-container">
      <Container
        fluid
        className="quiz-bg-container d-flex flex-column justify-content-center align-items-center"
      >
        <Form
          className="d-flex flex-row justify-content-center align-items-center question-form-container"
          onSubmit={handleSubmit}
        >
          <button
            className="form-btns"
            type="button"
            onClick={handlePreviousQuestion}
            disabled={questionIndex === 0}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <Container fluid className="m-5">
            <h1 className="question-heading">{currentQuestion.text}</h1>
            {currentQuestion.options.map((option) => (
              <Form.Check
                key={option.id}
                type="radio"
                label={option.text}
                name={currentQuestion.id}
                value={option.id}
                onChange={handleOptionChange}
                className="question-options"
                checked={selectedOption === option.id}
              />
            ))}
          </Container>

          <div className="mt-2 d-flex justify-content-between">
            {questionIndex < questions.length - 1 ? (
              <button
                type="button"
                className="form-btns"
                onClick={handleNextQuestion}
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            ) : (
              <Button className="primary" size={"md"} type="submit">
                Submit
              </Button>
            )}
          </div>
        </Form>
        {scoreModal()}
      </Container>
    </Container>
  );
}

export default Quiz;
