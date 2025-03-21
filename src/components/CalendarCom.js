import React, { useState } from 'react';
import OtherSidebar from '../components/sidebar/admin';
import OtherNavMenu from '../components/navmenu/adminNabmenu';
import { Container } from 'react-bootstrap';
import Footer from './footer';
import ThaiHolidayCalendar from '../components/ThaiHolidayCalendar';

function CalendarCom() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <div className="page-container">
          <OtherNavMenu handleShow={handleShow} />
          
          <Container fluid className="p-0 content-wrap">
            <div className="">
              <OtherSidebar show={show} handleClose={handleClose} />
              <div className="content-area">
                <ThaiHolidayCalendar />
              </div>
            </div>
          </Container>

          <Footer />
        </div>
      )
    </>
  );
}

export default CalendarCom;