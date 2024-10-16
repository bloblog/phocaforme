import "./index.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import {
  CircularProgress,
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import Card from "@/components/Card.jsx";
import usePostSearch from "@/utils/infiScroll";
import { searchPosts } from "@/store/post";
import PostCaution from "@/components/PostCaution.jsx";
import { getPostGPS } from "../../api/post.jsx";

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div>
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
    </div>
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

const BasicTabs = ({ isPreview }) => {
  const posts = useSelector((state) => (state.post ? state.post.posts : []));
  const user = useSelector((state) => (state.user ? state.user.user : null));

  const [value, setValue] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const { hasMore, loading, error } = usePostSearch(pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // 스크롤이 끝에 닿았고 추가 데이터가 있을 때만 페이지 번호를 증가시킴
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const searchs = useSelector((state) =>
    state.search.searchs ? state.search.searchs : null
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPreview) {
      const params = {};
      if (searchs.group) {
        params.groupId = searchs.group.idolGroupId;
      }

      if (searchs.targetMembers.length > 0) {
        if (searchs.targetMembers.length == 1) {
          params.target = searchs.targetMembers[0].idolMemberId;
        } else {
          params.target = searchs.targetMembers.idolMemberId.join(",");
        }
      }

      if (searchs.ownMembers.length > 0) {
        if (searchs.ownMembers.length == 1) {
          params.own = searchs.ownMembers[0].idolMemberId;
        } else {
          params.own = searchs.ownMembers.idolMemberId.join(",");
        }
      }

      if (searchs.cardType && searchs.cardType.value !== "") {
        params.cardType = searchs.cardType.value;
      }

      if (searchs.query) {
        params.query = searchs.query;
      }

      // gps 켜져있을 때 위도 경도 넣기
      if (user.location_longlat) {
        params.longitude = user.location_longlat[0];
        params.latitude = user.location_longlat[1];
      }

      getPostGPS(
        params,
        (data) => {
          dispatch(searchPosts(data.data));
        },
        (error) => {
          console.error("Error Get Post GPS :", error);
        }
      );
    }
  }, [dispatch, searchs]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedPostId, setSelectedPostId] = useState(null);

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
        {posts.length === 0 ? (
          <PostCaution message={"일치하는 게시글이 없습니다."} />
        ) : (
          <div
            style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}
          >
            {posts.map((post, index) => (
              <div key={index}>
                {post.distance !== -1 ? `${post.distance}km ` : ""}
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
                    setSelectedPostId(post.id);
                    navigate(`/barter/${post.id}`); // 디테일 페이지로 이동
                  }} // 클릭 이벤트 추가
                />
                {/* 마지막 요소일 때만 ref를 전달합니다 */}
                {index === posts.length - 1 ? (
                  <div ref={lastBookElementRef} />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div
          style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}
        >
          {posts.filter((post) => post.type === "판매").length === 0 ? (
            <div className="no-content">게시글이 없습니다.</div>
          ) : (
            posts
              .filter((post) => post.type === "판매")
              .map((post, index) => (
                <Card
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  images={post.images}
                  content={post.content}
                  ownMembers={post.ownMembers}
                  type={post.type}
                  isSold={post.isSold}
                ></Card>
              ))
          )}
        </div>
        <div>{loading && <CircularProgress />}</div>
        <div>{error && "Error"}</div>
      </CustomTabPanel>
    </Container>
  );
};

export default BasicTabs;
