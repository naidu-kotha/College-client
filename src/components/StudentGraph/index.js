import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
  // LabelList,
} from "recharts";

const Charts = () => {
  const [spinnerStatus, setSpinnerStatus] = useState(false);

  const { email } = JSON.parse(Cookies.get("userDetails"));
  const data = {
    email: email,
  };

  const [studentScoresList, setStudentScoresList] = useState([]);

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

  const CustomTooltip = ({ active, payload, label }) => {
    // console.log(active, payload, payload.length);
    if (active && payload) {
      if (payload[0].value === null) {
        return (
          <div className="custom-tooltip">
            <p>{`${label} : Not Attempted`}</p>
          </div>
        );
      }
      return (
        <div className="custom-tooltip">
          <p>{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Container
      fluid
      className="charts-bg-container d-flex flex-row justify-content-center"
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
            data={studentScoresList}
            margin={{
              top: 10,
            }}
          >
            <Tooltip content={CustomTooltip} filterNull={false} />
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
                Math.max(...studentScoresList.map((data) => data.test_score)),
              ]}
              interval={0}
            />
            <Legend
              wrapperStyle={{
                padding: 20,
              }}
            />
            <Bar
              dataKey="test_score"
              name="SCORE"
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

export default Charts;
