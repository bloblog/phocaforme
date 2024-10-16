import "./index.css";
import React, { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Search from "../search/index.jsx";
import { Container, CircularProgress } from "@mui/material";
import Card from "@/components/Card";
import usePostSearch from "@/utils/infiScroll.jsx";
import PostCaution from "@/components/PostCaution.jsx";
import { CustomTabs, CustomTabPanel } from "@/components/Tab/index";

const BasicTabs = () => {
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [pageNumber, setPageNumber] = useState(2);
  const { boards, hasMore, loading } = usePostSearch(pageNumber);
  const observer = useRef();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <Container id="mainpost-container">
      {location.state ? <Search /> : null}
      <div>
        <CustomTabs
          value={value}
          handleChange={handleChange}
          labels={["교환", "판매"]}
        />

        <CustomTabPanel value={value} index={0}>
          {boards.length === 0 ? (
            <PostCaution message={"게시글이 없습니다."} />
          ) : (
            <div id="main-card-container">
              {boards.map((post, index) => (
                <div key={post.id}>
                  {post.distance !== -1 ? `${post.distance}km ` : ""}
                  <Card
                    className={post.bartered ? "done-post" : ""}
                    id={post.id}
                    title={post.title}
                    images={
                      "https://photocardforme.s3.ap-northeast-2.amazonaws.com/" +
                      post.imageUrl
                    }
                    ownMembers={post.ownMember}
                    targetMembers={post.targetMember}
                    isBartered={post.bartered}
                    onClick={() => {
                      navigate(`/barter/${post.id}`); // 디테일 페이지로 이동
                    }}
                  />
                  {index === boards.length - 1 ? (
                    <div ref={lastBookElementRef} />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          {boards.filter((post) => post.type === "판매").length === 0 ? (
            <div className="no-content">게시글이 없습니다.</div>
          ) : (
            <div id="main-card-container">
              {boards
                .filter((post) => post.type === "판매")
                .map((post) => (
                  <Card
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    images={post.images}
                    content={post.content}
                    ownMembers={post.ownMembers}
                    type={post.type}
                    isSold={post.isSold}
                  />
                ))}
              {loading && <CircularProgress />}
            </div>
          )}
        </CustomTabPanel>
      </div>

      <div id="post-blank" />
    </Container>
  );
};

export default BasicTabs;
