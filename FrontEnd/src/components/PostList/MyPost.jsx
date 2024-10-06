import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import {
  Tabs,
  Tab,
  Typography,
  Box,
  Container,
  ImageList,
  ImageListItem,
} from "@mui/material";

import Card from "../../components/UI/Card";

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    </>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const MyPost = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const [value, setValue] = useState(0);
  const [myPostList, setMyPostList] = useState([]);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await axios.get(
        import.meta.env.REACT_APP_API_URL + "barter"
      );
      const data = response.data;

      // 현재 사용자의 ID와 일치하는 게시글만 필터링
      const userPosts = data.filter(
        (post) => post.writerId === currentUser.userId
      );

      // 최신순으로 정렬
      const sortedPosts = userPosts.sort((a, b) => b.createdAt - a.createdAt);

      // 상태 업데이트
      setMyPostList(sortedPosts.slice(0, 20));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // 게시물로 이동 핸들러
  const handleClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div id="mypost-container">
      <h2 className="profile-title">나의 게시글</h2>
      <div>
        <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value}>
            <Tab
              label="교환"
              {...a11yProps(0)}
              sx={{ fontWeight: value === 0 ? 600 : 400 }}
            />
            <Tab
              label="판매"
              {...a11yProps(1)}
              sx={{ fontWeight: value === 1 ? 600 : 400 }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
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
                    images={
                      "https://photocardforme.s3.ap-northeast-2.amazonaws.com/" +
                        post.imageUrl || ""
                    }
                    ownMembers={post.ownMember || []}
                    targetMembers={post.targetMember || []}
                    content={post.content || ""}
                    type={post.type || ""}
                    isBartered={post.isBartered || false}
                  ></Card>
                </div>
              ))}
          </ImageList>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ImageList
            id="card-list"
            sx={{ display: "flex", width: "100%" }}
            rowHeight={200}
          >
            {myPostList &&
              myPostList
                // .filter((post) => post.type === "판매")
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
                      images={post.images}
                      ownMembers={post.ownMembers}
                      content={post.content}
                      type={post.type}
                      isSold={post.isSold}
                    ></Card>
                  </div>
                ))}
          </ImageList>
        </CustomTabPanel>
      </div>
    </div>
  );
};

export default MyPost;
