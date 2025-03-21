import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../api";

const AddHolidayTable = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [Holidays, setHolidays] = useState("");

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const handleSave = async () => {
    if (!year || !month || !holidays) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/holidays/`, {
        years: year - 543, // แปลงเป็น ค.ศ.
        month,
        Holidays,
      });

      toast.success("บันทึกข้อมูลสำเร็จ");
      setYear("");
      setMonth("");
      setHolidays("");
      setDescription("");
    } catch (error) {
      console.error("Error saving holiday data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <Form.Group controlId="formYear">
            <Form.Label>ปี</Form.Label>
            <Form.Control
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="พ.ศ."
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formMonth">
            <Form.Label>เดือน</Form.Label>
            <Form.Control
              as="select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">เลือกเดือน</option>
              {thaiMonths.map((monthName, index) => (
                <option key={index + 1} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formHolidays">
            <Form.Label>จำนวนวันหยุด</Form.Label>
            <Form.Control
              type="number"
              value={holidays}
              onChange={(e) => setHolidays(e.target.value)}
              placeholder="กรอกจำนวนวันหยุด"
            />
          </Form.Group>
        </Col>
        <Col>
        </Col>
      </Row>

      <Button variant="primary" onClick={handleSave} className="mt-3">
        <FaSave className="me-1" />
        บันทึกข้อมูล
      </Button>

      <ToastContainer />
    </div>
  );
};

export default AddHolidayTable;