import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import './NewsCarousel.css';
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import chatAnimation from '../../icons/chat_15578584.json';
import Lottie from 'react-lottie-player';
import BASE_URL from '../../api';

// Create a placeholder image that will be shown when images fail to load
const PlaceholderImage = ({ title }) => (
  <div className="placeholder-image">
    <div className="placeholder-text">
      {title ? title.substring(0, 20) + (title.length > 20 ? '...' : '') : 'ไม่พบรูปภาพ'}
    </div>
  </div>
);

const NewsCarousel = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesStatus, setImagesStatus] = useState({});

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/news`);
        console.log('ข้อมูลข่าว:', response.data);
        
        if (Array.isArray(response.data)) {
          setNewsList(response.data);
          
          // Initialize image status tracking
          const initialStatus = {};
          response.data.forEach(item => {
            initialStatus[item.id] = 'loading';
          });
          setImagesStatus(initialStatus);
        } else {
          console.error('Expected array but got:', typeof response.data);
          setNewsList([]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  const handleImageLoad = (id) => {
    setImagesStatus(prev => ({
      ...prev,
      [id]: 'loaded'
    }));
  };

  const handleImageError = (id, title) => {
    console.log(`Attempted to load image for: ${title} - Full URL: ${BASE_URL}/images/${newsList.find(item => item.id === id)?.cover_image || 'default.jpg'}`);
    setImagesStatus(prev => ({
      ...prev,
      [id]: 'error'
    }));
  };

  // Only create slider settings if we have news items
  const settings = {
    dots: true,
    infinite: newsList.length > 3,
    speed: 500,
    slidesToShow: Math.min(newsList.length || 1, 3),
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(newsList.length || 1, 3),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(newsList.length || 1, 2),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Check if image exists before trying to load it
  const getImageUrl = (filename) => {
    if (!filename) return `${BASE_URL}/images/default.jpg`;
    if (filename.startsWith('http')) return filename;
    return `${BASE_URL}/images/${encodeURIComponent(filename)}`;
  };

  return (
    <div style={{ margin: '20px' }}>
      <div className='header1'>
        <Lottie
          loop
          animationData={chatAnimation}
          play
          style={{ width: 50, height: 50 }}
        />
        <h3>ประชาสัมพันธ์</h3>
      </div>
      
      {loading ? (
        <div className="loading-container">กำลังโหลดข้อมูล...</div>
      ) : newsList.length > 0 ? (
        <Slider {...settings}>
          {newsList.map((newsItem) => (
            <div key={newsItem.id}>
              <div className="news-card">
                <Link to={`/news/${newsItem.id}`} className="news-link">
                  <div className="news-image">
                    {imagesStatus[newsItem.id] === 'error' ? (
                      <PlaceholderImage title={newsItem.title} />
                    ) : (
                      <img
                        src={getImageUrl(newsItem.cover_image)}
                        alt={newsItem.title || 'News image'}
                        onLoad={() => handleImageLoad(newsItem.id)}
                        onError={() => handleImageError(newsItem.id, newsItem.title)}
                        style={{ display: imagesStatus[newsItem.id] === 'loading' ? 'none' : 'block' }}
                      />
                    )}
                    {imagesStatus[newsItem.id] === 'loading' && (
                      <div className="image-loading">กำลังโหลด...</div>
                    )}
                  </div>
                  <h3 className="news-title">{newsItem.title || 'ข่าวประชาสัมพันธ์'}</h3>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="no-news-container">ไม่พบข้อมูลข่าวสาร</div>
      )}
    </div>
  );
};

// ปุ่มลูกศรขวา (ถัดไป)
const SampleNextArrow = (props) => {
  const { className, onClick } = props;
  return onClick ? (
    <div
      className={`${className} custom-arrow next-arrow`}
      onClick={onClick}
    >
      <TiArrowRightThick className="arrow-icon" />
    </div>
  ) : null;
};

// ปุ่มลูกศรซ้าย (ย้อนกลับ)
const SamplePrevArrow = (props) => {
  const { className, onClick } = props;
  return onClick ? (
    <div
      className={`${className} custom-arrow prev-arrow`}
      onClick={onClick}
    >
      <TiArrowLeftThick className="arrow-icon" />
    </div>
  ) : null;
};

export default NewsCarousel;