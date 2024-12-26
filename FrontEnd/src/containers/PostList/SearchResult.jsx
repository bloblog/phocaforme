import "./index.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CircularProgress, Container } from "@mui/material";
import Card from "@/components/Card/index";
import Search from "../search/index.jsx";
import usePostSearch from "@/utils/infiScroll";
import { searchPosts } from "@/store/post";
import PostCaution from "@/components/Caution/post";
import { getPostGPS } from "../../api/post.jsx";
import AmazonSrc from "../../constants/amazonS3.jsx";
import { CustomTabs, CustomTabPanel } from "@/components/Tab/index";

const BasicTabs = ({ isPreview }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // const searchs = useSelector((state) =>
  //   state.search.searchs ? state.search.searchs : null
  // );

  const [searchHistory, setSearchHistory] = useState(null);

  useEffect(() => {
    setSearchHistory(JSON.parse(localStorage.getItem("searchCondition")));
  }, []);

  useEffect(() => {
    // if (!isPreview && searchHistory) {
    //   const params = {};
    //   if (searchHistory.group) {
    //     params.groupId = searchHistory.group.idolGroupId;
    //   }
    //   if (searchHistory.targetMembers.length > 0) {
    //     params.target = searchHistory.targetMembers
    //       .map((member) => member.idolMemberId)
    //       .join(",");
    //   }
    //   if (searchHistory.ownMembers.length > 0) {
    //     params.own = searchHistory.ownMembers
    //       .map((member) => member.idolMemberId)
    //       .join(",");
    //   }
    //   if (searchHistory.cardType && searchHistory.cardType.value !== "") {
    //     params.cardType = searchHistory.cardType.value;
    //   }
    //   if (searchHistory.query) {
    //     params.query = searchHistory.query;
    //   }
    //   if (user.location_longlat) {
    //     params.longitude = user.location_longlat[0];
    //     params.latitude = user.location_longlat[1];
    //   }
    //   getPostGPS(
    //     params,
    //     (data) => {
    //       console.log(data.data);
    //       dispatch(searchPosts(data.data));
    //     },
    //     (error) => {
    //       console.error("Error Get Post GPS :", error);
    //     }
    //   );
    // }
  }, [dispatch, searchHistory]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedPostId, setSelectedPostId] = useState(null);

  return (
    <Container>
      <Search />
      <CustomTabs
        value={value}
        handleChange={handleChange}
        labels={["교환", "판매"]}
      />
      <CustomTabPanel value={value} index={0}>
        {posts.length === 0 ? (
          <PostCaution message={"일치하는 게시글이 없습니다."} />
        ) : (
          <div id="search-post-container">
            {posts.map((post, index) => (
              <div key={index}>
                {post.distance !== -1 ? `${post.distance}km ` : ""}
                <Card
                  id={post.id}
                  title={post.title}
                  images={AmazonSrc + post.imageUrl}
                  ownMembers={post.ownMember}
                  targetMembers={post.targetMember}
                  isBartered={post.bartered}
                  onClick={() => {
                    setSelectedPostId(post.id);
                    navigate(`/barter/${post.id}`);
                  }}
                />
                {index === posts.length - 1 ? (
                  <div ref={lastBookElementRef} />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div id="search-post-container">
          {posts.filter((post) => post.type === "판매").length === 0 ? (
            <PostCaution message={"일치하는 게시글이 없습니다."} />
          ) : (
            posts
              .filter((post) => post.type === "판매")
              .map((post, index) => (
                <Card
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  images={post.images[0]}
                  content={post.content}
                  ownMembers={post.ownMembers}
                  type={post.type}
                  isSold={post.isSold}
                />
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
