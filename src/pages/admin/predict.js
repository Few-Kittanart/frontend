import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import OtherSidebar from '../../components/sidebar/admin';
import OtherNavMenu from '../../components/navmenu/adminNabmenu';
import Footer from '../../components/footer';
import ForecastComponent1 from '../../components/prediction/ForecastComponent1';
import './AdminPredictPage.css';

const AdminPredictPage = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    // Simulate loading time - adjust timeout as needed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);

  // Loading screen component
  const LoadingScreen = () => (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="logo">
          <div className="secondary-spinner"></div>
          <div className="spinner"></div>
          <img src="/favicon.ico" alt="Walailak University Logo" />
        </div>
        <div className="university-name">มหาวิทยาลัยวลัยลักษณ์</div>
        <div className="tagline">WALAILAK UNIVERSITY</div>
        <div className="loading-text">กำลังโหลดระบบพยากรณ์...</div>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
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
      )}
    </>
  );
};

export default AdminPredictPage;