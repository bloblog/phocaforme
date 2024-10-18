import "./index.css";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Button } from "@mui/material";
import Card from "@/components/Card/index";
import { getAllPost } from "../../api/post";

const PreviewPost = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/mainpost", { state: true });
  };
  // 이전이랑 다르게 store에 전부다 저장해놓지 않으니까
  // db에 있는 첫번째 애들 ( 여기에 적은 url )을 불러옴
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    // 데이터를 불러오는 비동기 함수를 정의합니다.
    getAllPost(
      (data) => {
        setPostData(data.data);
      },
      (error) => {
        console.error("Error fetching preview data:", error);
      }
    );

    // cleanup 함수를 반환하여 컴포넌트가 언마운트될 때 비동기 요청이 취소되도록 합니다.
    return () => {
      // 비동기 요청 취소 로직을 추가할 수 있습니다.
    };
  }, []);

  // 맨처음 4개만 보여줄거니까 짤라서 previewPost에 담아서 얘를 화면에 렌더링
  const previewPost = postData.slice(0, 4);

  return (
    <Container>
      <h2 className="main-title" id="preview-title">
        둘러보기 🔍
      </h2>
      <div id="preview-container">
        {/* <MainPost isPreview={true} /> */}
        <div
          className="preview-card"
          id={previewPost.length % 2 == 1 ? "preview-odd" : ""}
        >
          {previewPost.map((post, index) => (
            <div key={index}>
              <Card
                id={post.id}
                title={post.title}
                images={
                  "https://photocardforme.s3.ap-northeast-2.amazonaws.com/" +
                  post.imageUrl
                }
                ownMembers={post.ownMember}
                targetMembers={post.targetMember}
                isBartered={post.Bartered}
                onClick={() => {
                  // setSelectedPostId(post.id)  // <= 근데 이거 기능이 뭐임?
                  navigate(`/barter/${post.id}`); // 디테일 페이지로 이동
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div id="expand-button-container">
        <Button
          id="expand-button"
          variant="contained"
          size="large"
          color="primary"
          onClick={handleButtonClick}
        >
          + 더보기
        </Button>
      </div>
      <div id="preview-margin" />
    </Container>
  );
};

export default PreviewPost;
