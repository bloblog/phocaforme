import { useSelector } from "react-redux";

import { Container } from "@mui/material";
import MainPost from "@/containers/postList/index";
import SearchResult from "@/containers/postList/SearchResult.jsx";

const Post = () => {
  // const searchs = useSelector((state) =>
  //   state.search.searchs ? state.search.searchs : null
  // );

  const searchHistory = JSON.parse(localStorage.getItem("searchCondition"));
  console.log(searchHistory);

  return (
    <Container>{searchHistory ? <SearchResult /> : <MainPost />}</Container>
  );
};

export default Post;
