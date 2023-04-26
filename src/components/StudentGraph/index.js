import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Container } from "react-bootstrap";
import "./index.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const Charts = () => {
  const { email } = JSON.parse(Cookies.get("userDetails"));
  const data = {
    email: email,
  };

  const [studentScoresList, setStudentScoresList] = useState([]);
  const DataFormatter = (number) => {
    return number.toString();
  };
  useEffect(() => {
    axios
      .post("/getscore", data)
      .then((response) => {
        console.log(response);
        setStudentScoresList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Container
      fluid
      className="charts-bg-container d-flex flex-row justify-content-center"
    >
      <ResponsiveContainer width="50%" height={300}>
        <BarChart
          data={studentScoresList}
          margin={{
            top: 10,
          }}
        >
          <Tooltip />
          <XAxis
            dataKey="test_id"
            tick={{
              stroke: "gray",
              strokeWidth: 0.5,
            }}
            interval={0}
            fontSize={10}
          />
          <YAxis
            width={60}
            tickFormatter={DataFormatter}
            tick={{
              stroke: "gray",
              strokeWidth: 0.5,
              fontSize: 10,
            }}
            domain={[0, 5]}
            interval={0}
          />
          <Legend
            wrapperStyle={{
              padding: 20,
            }}
          />
          <Bar
            dataKey="test_score"
            name="TESTS"
            fill="#193be3"
            minBarSize={20}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default Charts;
