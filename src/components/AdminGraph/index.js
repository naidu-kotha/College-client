import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
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

const AdminGraph = () => {
  const [studentList, setStudentList] = useState([]);
  const [spinnerStatus, setSpinnerStatus] = useState(false);

  useEffect(() => {
    setSpinnerStatus(true);
    axios
      .post("/getstudentscount/")
      .then((response) => {
        console.log(response);
        setStudentList(response.data.rows);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setSpinnerStatus(false);
      });
  }, []);

  return (
    <Container
      fluid
      className="admin-graph-bg-container d-flex flex-row justify-content-center"
    >
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
        <ResponsiveContainer width="50%" height={300}>
          <BarChart
            data={studentList}
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
                fontSize: 14,
              }}
              interval={0}
            />
            <YAxis
              width={60}
              tick={{
                stroke: "gray",
                strokeWidth: 0.5,
                fontSize: 14,
              }}
              domain={[
                0,
                Math.max(...studentList.map((data) => data.total_passed)) + 1,
              ]}
              interval={0}
            />
            <Legend
              wrapperStyle={{
                padding: 20,
              }}
            />
            <Bar
              dataKey="total_passed"
              name="QUALIFIED STUDENTS"
              fill="#193be3"
              minBarSize={20}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
};

export default AdminGraph;
