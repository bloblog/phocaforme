import * as React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

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
import PostCaution from "./PostCaution";

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

const LatestPost = () => {
  const navigate = useNavigate();
  const [recentPosts, setRecentPosts] = useState([]);
  const [sellPosts, setSellPosts] = useState([]);


  const [value, setValue] = React.useState(0);

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
        <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
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
          {recentPosts.length == 0 ? <div>최근 조회한 게시글이 없어요!</div> : (
            <ImageList
            id="card-list"
            sx={{ display: "flex", width: "100%" }}
            rowHeight={200}
          >
            {recentPosts &&
              recentPosts
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
                      //이미지 2장 이상일 때
                      images={post.images.map(
                        (image) =>
                          "https://photocardforme.s3.ap-northeast-2.amazonaws.com/" +
                          image
                      )}
                      ownMembers={post.ownMembers.map((member) => ({
                        member_name: member.name,
                      }))} // 변경된 부분
                      targetMembers={post.targetMembers.map((member) => ({
                        member_name: member.name,
                      }))} // 변경된 부분
                      // 이부분
                      // map(member => member) 로 했을 때는 안됐는데 위처럼  수정하면 되는 이유 알아보기
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
        {sellPosts.length == 0 ? <div>최근 조회한 게시글이 없어요!</div> : (

          <ImageList
            id="card-list"
            sx={{ display: "flex", width: "100%" }}
            rowHeight={200}
          >
            {recentPosts &&
              recentPosts
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
                      images={post.photos}
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
