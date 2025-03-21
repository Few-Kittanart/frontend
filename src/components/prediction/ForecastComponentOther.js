import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Row, 
  Col,
  Badge,
} from "react-bootstrap";
import PredictionSummaryBoxes from "./PredictionSummaryBoxes";
import ComparisonChart from "./ComparisonChart";
import DrillDownIdBuilding from "./DrillDownIdBuilding";
import "./Table.css";
import BASE_URL from "../../api";

const ThaiMonthBadge = ({ month }) => {
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  return (
    <Badge
      pill
      variant="light"
      style={{
        backgroundColor: "#f3e5f5",
        padding: "10px 20px",
        fontSize: "16px",
      }}
    >
      {thaiMonths[month - 1]}
    </Badge>
  );
};

const YearBadge = ({ year }) => {
  return (
    <Badge
      pill
      variant="light"
      style={{
        backgroundColor: "#f3e5f5",
        padding: "10px 20px",
        fontSize: "16px",
      }}
    >
      {year + 543}
    </Badge>
  );
};

const ForecastComponentOther = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentMonth = async () => {
      try {
        setLoading(true);
        // Fetch the current prediction month from the API
        const response = await axios.get(`${BASE_URL}/current-month`);
        const { year, month } = response.data;
        setYear(year);
        setMonth(month);
        
        // Check if predictions exist for this month/year
        const checkResponse = await axios.get(
          `${BASE_URL}/check-predictions?year=${year}&month=${month}`
        );
        
        if (checkResponse.data.length > 0) {
          setData(checkResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCurrentMonth();
  }, []);

  return (
    <Container>
      <Form
        className="mb-4"
        style={{
          fontFamily: "Anuphan",
        }}
      >
        <Row
          className="align-items-center justify-content-end"
          style={{ gap: "5px" }}
        >
          <Col xs="auto" style={{ paddingRight: "0px" }}>
            <Form.Label>เดือนของการพยากรณ์</Form.Label>
          </Col>
          <Col xs="auto" style={{ paddingRight: "0px" }}>
            <ThaiMonthBadge month={month} />
          </Col>
          <Col xs="auto" style={{ paddingRight: "0px" }}>
            <Form.Label>พ.ศ.</Form.Label>
          </Col>
          <Col xs="auto">
            <YearBadge year={year} />
          </Col>
        </Row>
      </Form>
      <div className="hhh">
        <PredictionSummaryBoxes />
        <div className="box-component">
        </div>
        <div className="box-component">
          <ComparisonChart />
        </div>
      </div>
    </Container>
  );
};

export default ForecastComponentOther;