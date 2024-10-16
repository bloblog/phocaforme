import "./index.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { CustomTabs, CustomTabPanel } from "@/components/Tab/index";
import { ImageList, Box } from "@mui/material";
import Card from "@/components/Card";
import { getAllPost } from "../../api/post";

const MyPost = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const [value, setValue] = useState(0);
  const [myPostList, setMyPostList] = useState([]);
  const [mySellPostList, setMySellPostList] = useState([]);

  useEffect(() => {
    getAllPost(
      (data) => {
        const userPosts = data.data.filter(
          (post) => post.writerId === currentUser.userId
        );
        const sortedPosts = userPosts.sort((a, b) => b.createdAt - a.createdAt);
        setMyPostList(sortedPosts.slice(0, 20));
      },
      (error) => {
        console.error("Error Get All Post: ", error);
      }
    );
  }, []);

  // 게시물로 이동 핸들러
  const handleClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div id="mypost-container">
      <h2 className="profile-title">나의 게시글</h2>
      <CustomTabs
        value={value}
        handleChange={handleChange}
        labels={["교환", "판매"]}
      />
      <div>
        <CustomTabPanel value={value} index={0}>
          {myPostList.length === 0 ? (
            <div className="no-content">최근 게시한 글이 없어요!</div>
          ) : (
            <ImageList
              id="card-list"
              sx={{ display: "flex", width: "100%" }}
              rowHeight={200}
            >
              {myPostList.map((post, index) => (
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
                    images={
                      "https://photocardforme.s3.ap-northeast-2.amazonaws.com/" +
                        post.imageUrl || ""
                    }
                    ownMembers={post.ownMember || []}
                    targetMembers={post.targetMember || []}
                    content={post.content || ""}
                    type={post.type || ""}
                    isBartered={post.isBartered || false}
                  />
                </div>
              ))}
            </ImageList>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {mySellPostList.length === 0 ? (
            <div className="no-content">최근 게시한 글이 없어요!</div>
          ) : (
            <ImageList
              id="card-list"
              sx={{ display: "flex", width: "100%" }}
              rowHeight={200}
            >
              {myPostList &&
                myPostList.map((post, index) => (
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
                      images={post.images}
                      ownMembers={post.ownMembers}
                      content={post.content}
                      type={post.type}
                      isSold={post.isSold}
                    />
                  </div>
                ))}
            </ImageList>
          )}
        </CustomTabPanel>
      </div>
    </div>
  );
};

export default MyPost;
