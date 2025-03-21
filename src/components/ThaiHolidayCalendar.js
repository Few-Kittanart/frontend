import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import './ThaiHolidayCalendar.css';

const generateAllHolidays = () => {
  const allHolidays = [];
  
  for (let year = 2006; year <= 2025; year++) {
    const holidays = [];

    // วันหยุดประจำปีคงที่
    const fixedHolidays = [
      { date: new Date(year, 0, 1), name: "วันขึ้นปีใหม่", description: "New Year's Day" },
      { date: new Date(year, 3, 6), name: "วันจักรี", description: "Chakri Day" },
      ...Array.from({length: 3}, (_, i) => ({ 
        date: new Date(year, 3, 13 + i),
        name: "วันสงกรานต์",
        description: "Songkran Festival"
      })),
      { date: new Date(year, 4, 1), name: "วันแรงงานแห่งชาติ", description: "Labor Day" },
      { date: new Date(year, 9, 23), name: "วันปิยมหาราช", description: "Chulalongkorn Day" },
      { date: new Date(year, 11, 10), name: "วันรัฐธรรมนูญ", description: "Constitution Day" },
      { date: new Date(year, 11, 31), name: "วันสิ้นปี", description: "New Year's Eve" }
    ];

    // วันหยุดเปลี่ยนแปลงตามปี
    const dynamicHolidays = [];
    
    if (year >= 2017) {
      dynamicHolidays.push({
        date: new Date(year, 4, 4),
        name: "วันฉัตรมงคล",
        description: "Coronation Day"
      });
    }

    // วันหยุดทางพุทธศาสนา
    if (year === 2025) {
      dynamicHolidays.push(
        { date: new Date(year, 1, 12), name: "วันมาฆบูชา", description: "Makha Bucha Day" },
        { date: new Date(year, 4, 11), name: "วันวิสาขบูชา", description: "Visakha Bucha Day" }
      );
    }

    // Function to parse Thai date format to JavaScript Date
    const parseThaiDate = (day, month, year) => new Date(year, month - 1, day);

    // วันสำคัญของมหาวิทยาลัย
    const academicHolidays = [];

    // Calendar years handling
    if (year === 2020) {
      academicHolidays.push(
        { date: parseThaiDate(13, 7, 2020), name: "วันเปิดภาคเรียนที่ 1", description: "First semester begins", type: "academic" },
        { date: parseThaiDate(2, 10, 2020), name: "วันปิดภาคเรียนที่ 1", description: "First semester ends", type: "academic" },
        { date: parseThaiDate(26, 10, 2020), name: "วันเปิดภาคเรียนที่ 2", description: "Second semester begins", type: "academic" },
        { date: parseThaiDate(15, 1, 2021), name: "วันปิดภาคเรียนที่ 2", description: "Second semester ends", type: "academic" },
        { date: parseThaiDate(8, 2, 2021), name: "วันเปิดภาคเรียนที่ 3", description: "Third semester begins", type: "academic" },
        { date: parseThaiDate(30, 4, 2021), name: "วันปิดภาคเรียนที่ 3", description: "Third semester ends", type: "academic" },
        { date: parseThaiDate(29, 3, 2020), name: "วันสถาปนามหาวิทยาลัยวลัยลักษณ์", description: "Walailak University Foundation Day", type: "university" }
      );
    } else if (year === 2021) {
      academicHolidays.push(
        { date: parseThaiDate(14, 6, 2021), name: "วันเปิดภาคเรียนที่ 1", description: "First semester begins", type: "academic" },
        { date: parseThaiDate(3, 9, 2021), name: "วันปิดภาคเรียนที่ 1", description: "First semester ends", type: "academic" },
        { date: parseThaiDate(27, 9, 2021), name: "วันเปิดภาคเรียนที่ 2", description: "Second semester begins", type: "academic" },
        { date: parseThaiDate(17, 12, 2021), name: "วันปิดภาคเรียนที่ 2", description: "Second semester ends", type: "academic" },
        { date: parseThaiDate(10, 1, 2022), name: "วันเปิดภาคเรียนที่ 3", description: "Third semester begins", type: "academic" },
        { date: parseThaiDate(1, 4, 2022), name: "วันปิดภาคเรียนที่ 3", description: "Third semester ends", type: "academic" },
        { date: parseThaiDate(29, 3, 2021), name: "วันสถาปนามหาวิทยาลัยวลัยลักษณ์", description: "Walailak University Foundation Day", type: "university" }
      );
    } else if (year === 2022) {
      academicHolidays.push(
        { date: parseThaiDate(13, 6, 2022), name: "วันเปิดภาคเรียนที่ 1", description: "First semester begins", type: "academic" },
        { date: parseThaiDate(2, 9, 2022), name: "วันปิดภาคเรียนที่ 1", description: "First semester ends", type: "academic" },
        { date: parseThaiDate(29, 9, 2022), name: "วันเปิดภาคเรียนที่ 2", description: "Second semester begins", type: "academic" },
        { date: parseThaiDate(21, 12, 2022), name: "วันปิดภาคเรียนที่ 2", description: "Second semester ends", type: "academic" },
        { date: parseThaiDate(9, 1, 2023), name: "วันเปิดภาคเรียนที่ 3", description: "Third semester begins", type: "academic" },
        { date: parseThaiDate(31, 3, 2023), name: "วันปิดภาคเรียนที่ 3", description: "Third semester ends", type: "academic" },
        { date: parseThaiDate(29, 3, 2022), name: "วันสถาปนามหาวิทยาลัยวลัยลักษณ์", description: "Walailak University Foundation Day", type: "university" }
      );
    } else if (year === 2023) {
      academicHolidays.push(
        { date: parseThaiDate(12, 6, 2023), name: "วันเปิดภาคเรียนที่ 1", description: "First semester begins", type: "academic" },
        { date: parseThaiDate(1, 9, 2023), name: "วันปิดภาคเรียนที่ 1", description: "First semester ends", type: "academic" },
        { date: parseThaiDate(25, 9, 2023), name: "วันเปิดภาคเรียนที่ 2", description: "Second semester begins", type: "academic" },
        { date: parseThaiDate(15, 12, 2023), name: "วันปิดภาคเรียนที่ 2", description: "Second semester ends", type: "academic" },
        { date: parseThaiDate(8, 1, 2024), name: "วันเปิดภาคเรียนที่ 3", description: "Third semester begins", type: "academic" },
        { date: parseThaiDate(29, 3, 2024), name: "วันปิดภาคเรียนที่ 3", description: "Third semester ends", type: "academic" },
        { date: parseThaiDate(29, 3, 2023), name: "วันสถาปนามหาวิทยาลัยวลัยลักษณ์", description: "Walailak University Foundation Day", type: "university" }
      );
    } else if (year === 2024) {
      academicHolidays.push(
        { date: parseThaiDate(10, 6, 2024), name: "วันเปิดภาคเรียนที่ 1", description: "First semester begins", type: "academic" },
        { date: parseThaiDate(22, 9, 2024), name: "วันปิดภาคเรียนที่ 1", description: "First semester ends", type: "academic" },
        { date: parseThaiDate(4, 11, 2024), name: "วันเปิดภาคเรียนที่ 2", description: "Second semester begins", type: "academic" },
        { date: parseThaiDate(16, 2, 2025), name: "วันปิดภาคเรียนที่ 2", description: "Second semester ends", type: "academic" },
        { date: parseThaiDate(29, 3, 2024), name: "วันสถาปนามหาวิทยาลัยวลัยลักษณ์", description: "Walailak University Foundation Day", type: "university" }
      );
    } else if (year === 2025) {
      academicHolidays.push(
        { date: new Date(year, 3, 1), name: "วันเปิดภาคเรียนที่ 1", description: "First semester begins", type: "academic" },
        { date: new Date(year, 6, 15), name: "วันปิดภาคเรียนที่ 1", description: "First semester ends", type: "academic" },
        { date: new Date(year, 7, 1), name: "วันเปิดภาคเรียนที่ 2", description: "Second semester begins", type: "academic" },
        { date: new Date(year, 10, 30), name: "วันปิดภาคเรียนที่ 2", description: "Second semester ends", type: "academic" },
        { date: new Date(year, 2, 29), name: "วันคล้ายวันสถาปนามหาวิทยาลัยวลัยลักษณ์", description: "Walailak University Foundation Day", type: "university" }
      );
    }

    allHolidays.push(...fixedHolidays, ...dynamicHolidays, ...academicHolidays);
  }

  return allHolidays;
};

const combinedHolidays = generateAllHolidays();

function ThaiHolidayCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [displayMode, setDisplayMode] = useState('calendar');
  const [holidayFilter, setHolidayFilter] = useState('all');
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const getHolidayForDate = (date) => {
    return combinedHolidays.filter(holiday => 
      holiday.date.getDate() === date.getDate() && 
      holiday.date.getMonth() === date.getMonth() && 
      holiday.date.getFullYear() === date.getFullYear() &&
      (holidayFilter === 'all' || 
       (holidayFilter === 'national' && !holiday.type) || 
       (holidayFilter === holiday.type))
    );
  };
  
  const formatDate = (date) => date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const holidays = getHolidayForDate(date);
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === month && 
                      new Date().getFullYear() === year;
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${holidays.length > 0 ? 'holiday' : ''} ${isToday ? 'today' : ''}`}
        >
          <div className="day-number">{day}</div>
          {holidays.map((holiday, index) => (
            <div key={index} className={`holiday-marker ${holiday.type || 'national'}`}>
              {holiday.name}
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };
  
  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());
  
  const getFilteredHolidays = () => combinedHolidays
    .filter(holiday => 
      holiday.date.getFullYear() === selectedYear &&
      (holidayFilter === 'all' || 
       (holidayFilter === 'national' && !holiday.type) || 
       (holidayFilter === holiday.type))
    )
    .sort((a, b) => a.date - b.date);
  
    return (
      <div className="thai-holiday-calendar">
        <Card className="calendar-card">
        <Card.Header className="d-flex flex-column flex-md-row justify-content-md-end align-items-center py-2 gap-3">
            {/* ส่วนหัวข้อทางขวา */}
            <div className="calendar-title text-end">
              <h2 className="mb-0 fs-6">ปฏิทินวันหยุด {currentDate.getFullYear() + 543}</h2>
              <p className="mb-0 small text-muted">มหาวิทยาลัยวลัยลักษณ์</p>
            </div>

            {/* ส่วนควบคุม */}
            <div className="display-controls">
              <Button 
                variant="outline-primary" 
                onClick={() => setDisplayMode('calendar')}
                className="btn-sm"
              >
                ปฏิทิน
              </Button>
              <Button 
                variant="outline-primary" 
                onClick={() => setDisplayMode('list')}
                className="btn-sm ms-2"
              >
                รายการ
              </Button>
              <select 
                className="form-select form-select-sm ms-2" 
                value={holidayFilter}
                onChange={(e) => setHolidayFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                <option value="national">วันหยุดราชการ</option>
                <option value="academic">วันเปิด-ปิดภาคเรียน</option>
                <option value="university">วันสำคัญของมหาวิทยาลัย</option>
              </select>
            </div>
          </Card.Header>
        
        <Card.Body>
          {displayMode === 'calendar' ? (
            <>
              <div className="calendar-controls mb-4 d-flex flex-column flex-md-row align-items-center">
                <Button variant="light" onClick={previousMonth}>&lt;</Button>
                <h3 className="month-display">
                  {currentDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
                </h3>
                <Button variant="light" onClick={nextMonth}>&gt;</Button>
                <Button 
                  variant="outline-primary" 
                  className="ms-3 go-today-btn"
                  onClick={goToToday}
                >
                  วันนี้
                </Button>
              </div>
              
              <div className="calendar-grid">
                {['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'].map(day => (
                  <div key={day} className="weekday-header">{day}</div>
                ))}
                {generateCalendar()}
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>รายการวันหยุดประจำปี {selectedYear + 543}</h3>
                <select 
                  className="form-select w-auto" 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year + 543}</option>
                  ))}
                </select>
              </div>
              
              <div className="holiday-list">
              {getFilteredHolidays().map((holiday, index) => {
                    const isSunday = holiday.date.getDay() === 0;
                    const isSaturday = holiday.date.getDay() === 6;
                    
                    return (
                      <Card 
                        key={index} 
                        className={`mb-2 holiday-card ${isSunday ? 'weekend-sunday' : ''} ${isSaturday ? 'weekend-saturday' : ''}`}
                        
                      >
                        <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{holiday.name}</h5>
                        <div className="text-muted small">{holiday.description}</div>
                      </div>
                      <Badge bg={holiday.type === 'academic' ? 'info' : holiday.type === 'university' ? 'warning' : 'danger'}>
                        {formatDate(holiday.date)}
                      </Badge>
                      </Card.Body>
                      </Card>
                    );
                  })}
              </div>
            </>
          )}
        </Card.Body>
        
        <Card.Footer className="text-muted">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div>
              <span className="holiday-legend national me-3">
                <span className="legend-dot"></span> วันหยุดราชการ
              </span>
              <span className="holiday-legend academic me-3">
                <span className="legend-dot"></span> เปิด-ปิดภาคเรียน
              </span>
              <span className="holiday-legend university">
                <span className="legend-dot"></span> วันสำคัญมหาวิทยาลัย
              </span>
            </div>
            <small>วันปัจจุบัน: {new Date().toLocaleDateString('th-TH')}</small>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ThaiHolidayCalendar;