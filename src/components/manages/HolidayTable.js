import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, Pagination, Dropdown } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaPlus, FaFileExcel } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import BASE_URL from "../../api";

const HolidayTable = () => {
  // States สำหรับข้อมูลวันหยุด
  const [originalHolidays, setOriginalHolidays] = useState([]);
  const [holidays, setHolidays] = useState([]);
  // States สำหรับ modal และชนิดของ modal ("add", "edit", "delete")
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  // States สำหรับข้อมูลที่กรอกในฟอร์ม (ปี, เดือน, จำนวนวันหยุด)
  const [yearInput, setYearInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [holidayCount, setHolidayCount] = useState("");
  
  // States สำหรับการกรองข้อมูล
  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("ทั้งหมด");
  const [selectedMonth, setSelectedMonth] = useState("ทั้งหมด");

  // States สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Thai months (index 0 ใช้สำหรับ "ทั้งหมด")
  const thaiMonths = [
    "ทั้งหมด", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  // ดึงข้อมูลวันหยุดจาก API เมื่อ component โหลด
  useEffect(() => {
    fetchHolidays();
  }, []);

  // เมื่อมีการอัปเดตข้อมูลวันหยุด จะสร้างรายปีที่ไม่ซ้ำ (โดยแปลงเป็น พ.ศ.)
  useEffect(() => {
    const years = [...new Set(originalHolidays.map(holiday => convertToBuddhistYear(holiday.years)))];
    setUniqueYears(["ทั้งหมด", ...years.sort((a, b) => b - a)]);
  }, [originalHolidays]);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/holidays/`);
      console.log("API response:", response.data); // เพิ่มการ log ข้อมูลเพื่อตรวจสอบ
      setOriginalHolidays(response.data);
      setHolidays(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error("ไม่สามารถดึงข้อมูลวันหยุดได้");
    }
  };

  // ฟังก์ชันแปลงปีจาก ค.ศ. เป็น พ.ศ.
  const convertToBuddhistYear = (year) => parseInt(year) + 543;
  // ฟังก์ชันแปลงปีจาก พ.ศ. เป็น ค.ศ.
  const convertToGregorianYear = (year) => parseInt(year) - 543;
  // แปลงเลขเดือนเป็นชื่อเดือนภาษาไทย
  const convertMonthToThai = (month) => thaiMonths[month];

  // ฟังก์ชันกรองข้อมูลตามปีและเดือน
  const filterData = (year, month) => {
    let filtered = [...originalHolidays];
    if (year && year !== "ทั้งหมด") {
      filtered = filtered.filter(holiday => convertToBuddhistYear(holiday.years) === parseInt(year));
    }
    if (month && month !== "ทั้งหมด") {
      filtered = filtered.filter(holiday => holiday.month === parseInt(month));
    }
    setHolidays(filtered);
    setCurrentPage(1);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    filterData(year, selectedMonth);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    filterData(selectedYear, month);
  };

  // Export ข้อมูลออกเป็น Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      holidays.map(holiday => ({
        "ปี": convertToBuddhistYear(holiday.years),
        "เดือน": convertMonthToThai(holiday.month),
        "จำนวนวันหยุด": holiday.Holiday,  
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Holidays");
    XLSX.writeFile(workbook, "HolidayData.xlsx");
  };

  // แสดง modal ตามชนิดของการทำงาน
  const handleShowModal = (type, holiday = null) => {
    setModalType(type);
    setSelectedHoliday(holiday);
    if (type === "edit" && holiday) {
      setYearInput(convertToBuddhistYear(holiday.years));
      setMonthInput(holiday.month);
      setHolidayCount(holiday.holidays);
    } else {
      // กรณี "add" ให้เคลียร์ข้อมูลในฟอร์ม
      setYearInput("");
      setMonthInput("");
      setHolidayCount("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHoliday(null);
    setYearInput("");
    setMonthInput("");
    setHolidayCount("");
  };

  // เพิ่มข้อมูลวันหยุดใหม่
  const handleAddHoliday = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/holidays/`, {
        years: convertToGregorianYear(yearInput),
        month: parseInt(monthInput),
        Holiday: parseInt(holidayCount),  // ใช้ชื่อ Holiday ตรงกับที่ API คาดหวัง
      });
      if (response.data) {
        fetchHolidays();
        handleCloseModal();
        toast.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error adding holiday:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // แก้ไขข้อมูลวันหยุด
  const handleEditHoliday = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/holidays/${selectedHoliday.id}`, {
        years: convertToGregorianYear(yearInput),
        month: parseInt(monthInput),
        Holiday: parseInt(holidayCount),  
      });
      if (response.data) {
        fetchHolidays();
        handleCloseModal();
        toast.success("บันทึกการแก้ไขสำเร็จ");
      }
    } catch (error) {
      console.error("Error updating holiday:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  // ลบข้อมูลวันหยุด
  const handleDeleteHoliday = async (holidayId) => {
    try {
      await axios.delete(`${BASE_URL}/holidays/${holidayId}`);
      fetchHolidays();
      handleCloseModal();
      toast.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = holidays.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    const totalPages = Math.ceil(holidays.length / itemsPerPage);
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    const halfMax = Math.floor(maxPageNumbersToShow / 2);

    let startPage = Math.max(currentPage - halfMax, 1);
    let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
    }

    pageNumbers.push(
      <Pagination.Prev
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    if (startPage > 1) {
      pageNumbers.push(
        <Pagination.Item key={1} onClick={() => paginate(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pageNumbers.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      pageNumbers.push(
        <Pagination.Item key={totalPages} onClick={() => paginate(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    pageNumbers.push(
      <Pagination.Next
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return pageNumbers;
  };

  return (
    <div>
      {/* ส่วนของการกรองข้อมูลและปุ่มเพิ่ม/ดาวน์โหลด Excel */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-year">
              {selectedYear !== "ทั้งหมด" ? `ปี ${selectedYear}` : "เลือกปี"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {uniqueYears.map((year, idx) => (
                <Dropdown.Item key={idx} onClick={() => handleYearSelect(year)}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-month">
              {selectedMonth !== "ทั้งหมด" ? convertMonthToThai(selectedMonth) : "เลือกเดือน"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {thaiMonths.map((monthName, idx) => (
                <Dropdown.Item key={idx} onClick={() => handleMonthSelect(idx)}>
                  {monthName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="d-flex">
          <Button variant="primary" className="me-2" onClick={() => handleShowModal("add")}>
            <FaPlus className="me-1" /> เพิ่มข้อมูล
          </Button>
          <Button variant="success" onClick={exportToExcel}>
            <FaFileExcel className="me-1" /> ดาวน์โหลด Excel
          </Button>
        </div>
      </div>

      {/* ตารางแสดงข้อมูลวันหยุด */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ปี</th>
            <th>เดือน</th>
            <th>จำนวนวันหยุด</th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((holiday, index) => (
            <tr key={holiday.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{convertToBuddhistYear(holiday.years)}</td>
              <td>{convertMonthToThai(holiday.month)}</td>
              <td>{holiday.Holiday}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleShowModal("edit", holiday)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleShowModal("delete", holiday)}>
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      {holidays.length > itemsPerPage && (
        <Pagination>{renderPaginationItems()}</Pagination>
      )}

      {/* Modal สำหรับเพิ่ม/แก้ไข/ลบ */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add"
              ? "เพิ่มข้อมูลวันหยุด"
              : modalType === "edit"
              ? "แก้ไขข้อมูลวันหยุด"
              : "ลบข้อมูลวันหยุด"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete" ? (
            <p>คุณแน่ใจว่าต้องการลบข้อมูลนี้หรือไม่?</p>
          ) : (
            <Form>
              <Form.Group controlId="formYear" className="mb-3">
                <Form.Label>ปี</Form.Label>
                <Form.Control
                  type="number"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  placeholder="กรอกปี พ.ศ."
                />
              </Form.Group>
              <Form.Group controlId="formMonth" className="mb-3">
                <Form.Label>เดือน</Form.Label>
                <Form.Control
                  as="select"
                  value={monthInput}
                  onChange={(e) => setMonthInput(e.target.value)}
                >
                  <option value="">เลือกเดือน</option>
                  {thaiMonths.slice(1).map((monthName, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {monthName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formHolidays" className="mb-3">
                <Form.Label>จำนวนวันหยุด</Form.Label>
                <Form.Control
                  type="number"
                  value={holidayCount}
                  onChange={(e) => setHolidayCount(e.target.value)}
                  placeholder="กรอกจำนวนวันหยุด"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ยกเลิก
          </Button>
          <Button
            variant={modalType === "delete" ? "danger" : "primary"}
            onClick={() => {
              if (modalType === "add") {
                handleAddHoliday();
              } else if (modalType === "edit") {
                handleEditHoliday();
              } else {
                handleDeleteHoliday(selectedHoliday.id);
              }
            }}
          >
            {modalType === "delete" ? "ลบ" : "บันทึก"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default HolidayTable;
