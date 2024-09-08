import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import OtherSidebar from '../../components/sidebar/admin';
import OtherNavMenu from '../../components/navmenu/adminNabmenu';
import Footer from '../../components/footer';
import ForecastComponent1 from '../../components/prediction/ForecastComponent1';
import './AdminPredictPage.css'; // เปลี่ยนชื่อไฟล์ CSS

const AdminPredictPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ตรวจสอบว่าฟังก์ชัน tos และ รีเซ มีการ import หรือไม่
  // ถ้าไม่จำเป็นต้องใช้ฟังก์ชันนี้ สามารถลบ useEffect นี้ออกได้
  useEffect(() => {
    // ถ้าฟังก์ชัน tos และ รีเซ จำเป็นต้องใช้ ให้ import ฟังก์ชันนี้เข้ามา
    // tos();
    // รีเซ();
  }, []);

  return (
    <div className="page-container">
      <OtherNavMenu handleShow={handleShow} />
      
      <Container fluid className="p-0 content-wrap">
        <div className="">
          <OtherSidebar show={show} handleClose={handleClose} />
          <div className="content-area">
            <ForecastComponent1 />
            
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default AdminPredictPage;
