import React from "react";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";

const MyCarousel = () => {
  const example = [
    {
      id: 1,
      url: "/assets/images/banner/도움말.PNG",
      link: "/help",
    },
    {
      id: 2,
      url: "/assets/images/banner/이벤트.png",
      link: "https://www.smtownandstore.com/product/list.html?cate_no=2221",
    },
    {
      id: 3,
      url: "/assets/images/banner/이벤트2.png",
      link: "https://www.smtownandstore.com/board/event/read.html?no=543481&board_no=5",
    },
  ];

  const imageStyle = {
    width: '100%',
    height: "20vh",
    objectFit: "contain",
  };

  const carouselStyle = {
    "& .Carousel-button": {
      display: "none",
    },
  };

  // 호버 관련
  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // 불투명한 배경 색상
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0, // 기본적으로 숨김
    transition: "opacity 0.3s ease-in-out", // 페이드 인/아웃 트랜지션
  };

  const handleMouseEnter = (event) => {
    event.target.style.opacity = 1; // 호버 시 불투명한 창 표시
  };

  const handleMouseLeave = (event) => {
    event.target.style.opacity = 0; // 호버 해제 시 불투명한 창 숨김
  };

  const customNextIcon = () => null; // 숨김
  const customPrevIcon = () => null; // 숨김

  return (
    <div style={{ marginTop: "2rem", justifyContent: 'center'}}>
      <Carousel
        NextIcon={customNextIcon}
        PrevIcon={customPrevIcon}
        IndicatorContainerProps={{ style: { display: 'none' } }} // 숨김
        style={carouselStyle}
        cycleNavigation={true}
        navButtonsAlwaysVisible={false}
        centerMode={true}
        centerSlidePercentage={30}
        showThumbs={false}
        showStatus={false}
        autoPlay={true}
        interval={3000}
        infiniteLoop={true}
        hideArrows={true}
      >
        {example.map((content, index) => (
          <Link key={index} to={content.link}>
            <div
              style={{ position: "relative" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src={content.url} style={imageStyle} />
              <div style={overlayStyle}/>
              </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};
export default MyCarousel;
