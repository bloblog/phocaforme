import "./index.css";
import React from "react";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { useColor } from "color-thief-react";
import { IMG_URL_1, IMG_URL_2, IMG_URL_3 } from "@/constants/image";

const MyCarousel = () => {
  const example = [
    {
      id: 1,
      url: IMG_URL_1,
      link: "/help",
    },
    {
      id: 2,
      url: IMG_URL_2,
      link: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.yes24.com%2FGoods%2FDetail%2F133338072&psig=AOvVaw3k1fFa6vF8cHLn5gvDbxfq&ust=1729061719471000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLCK-f_mj4kDFQAAAAAdAAAAABAJ",
    },
    {
      id: 3,
      url: IMG_URL_3,
      link: "https://www.google.com/imgres?q=%ED%82%A4%20pleasure%20shop&imgurl=http%3A%2F%2Fcontents.kyobobook.co.kr%2Fmusic%2Fmidi%2F9375%2F2573952.jpg&imgrefurl=https%3A%2F%2Fmhottracks.kyobobook.co.kr%2Fp%2F8804775451508&docid=bl9Qu5T7y_hg5M&tbnid=Dm_orrsItFjokM&vet=12ahUKEwjKt4q_54-JAxW-klYBHURzCOQQM3oECBYQAA..i&w=640&h=640&hcb=2&ved=2ahUKEwjKt4q_54-JAxW-klYBHURzCOQQM3oECBYQAA",
    },
  ];

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

  const getBackColor = (url) => {
    const { data, loading, error } = useColor(url, "hex");
    return data;
  };

  const customNextIcon = () => null; // 숨김
  const customPrevIcon = () => null; // 숨김

  return (
    <div className="container">
      <Carousel
        className="carousel-container"
        NextIcon={customNextIcon}
        PrevIcon={customPrevIcon}
        IndicatorContainerProps={{ style: { display: "none" } }} // 숨김
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
              className="image-container"
              style={{ backgroundColor: getBackColor(content.url) }}
            >
              <img src={content.url} className="image" />
              <div style={overlayStyle} />
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};
export default MyCarousel;
