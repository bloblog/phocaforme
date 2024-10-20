import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Typography, Box, ImageList } from "@mui/material";

import Card from "@/components/Card/index";
import { CustomTabs, CustomTabPanel } from "@/components/Tab/index";
import AmazonSrc from "../../constants/amazonS3";

const LatestPost = () => {
  const navigate = useNavigate();
  const [recentPosts, setRecentPosts] = useState([]);
  const [sellPosts, setSellPosts] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    // 로컬 스토리지에서 최근 본 게시물을 가져옵니다.
    const storedRecentPosts =
      JSON.parse(localStorage.getItem("recentCard")) || [];
    setRecentPosts(storedRecentPosts);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // 게시물로 이동 핸들러
  const handleClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div id="latestpost-container">
      <h2 className="profile-title">최근 본 게시글</h2>
      <div>
        <CustomTabs
          value={value}
          handleChange={handleChange}
          labels={["교환", "판매"]}
        />
        <CustomTabPanel value={value} index={0}>
          {recentPosts.length === 0 ? (
            <div className="no-content">최근 조회한 게시글이 없어요!</div>
          ) : (
            <ImageList
              id="card-list"
              sx={{ display: "flex", width: "100%" }}
              rowHeight={200}
            >
              {recentPosts
                .map((post, index) => (
                  <div
                    className="cards-container"
                    key={index}
                    onClick={() => handleClick(post.id)}
                  >
                    <Card
                      key={post.id}
                      style={{
                        objectFit: "contain",
                        margin: "0 16px 16px 0",
                        cursor: "pointer",
                      }}
                      id={post.id}
                      title={post.title}
                      images={AmazonSrc + post.images[0]}
                      ownMembers={post.ownMembers.map((member) => ({
                        member_name: member.name,
                      }))}
                      targetMembers={post.targetMembers.map((member) => ({
                        member_name: member.name,
                      }))}
                      content={post.content}
                      type={post.cardType}
                      isBartered={post.isBartered}
                    ></Card>
                  </div>
                ))
                .reverse()}
            </ImageList>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {sellPosts.length === 0 ? (
            <div className="no-content">최근 조회한 게시글이 없어요!</div>
          ) : (
            <ImageList
              id="card-list"
              sx={{ display: "flex", width: "100%" }}
              rowHeight={200}
            >
              {recentPosts
                .filter((post) => post.type === "판매")
                .map((post, index) => (
                  <div
                    className="cards-container"
                    key={index}
                    onClick={() => handleClick(post.id)}
                  >
                    <Card
                      key={post.id}
                      style={{
                        objectFit: "contain",
                        margin: "0 16px 16px 0",
                        cursor: "pointer",
                      }}
                      id={post.id}
                      title={post.title}
                      images={post.photos[0]}
                      ownMembers={post.ownMembers}
                      content={post.content}
                      type={post.cardType}
                      isSold={post.isSold}
                    ></Card>
                  </div>
                ))
                .reverse()}
            </ImageList>
          )}
        </CustomTabPanel>
      </div>
    </div>
  );
};

export default LatestPost;
