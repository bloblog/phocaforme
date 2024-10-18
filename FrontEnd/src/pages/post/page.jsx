import { useSelector } from "react-redux";

import { Container } from "@mui/material";
import MainPost from "@/containers/postList/index";
import SearchResult from "@/containers/postList/SearchResult.jsx";

const Post = () => {
  const searchs = useSelector((state) =>
    state.search.searchs ? state.search.searchs : null
  );

  return <Container>{searchs ? <SearchResult /> : <MainPost />}</Container>;
};

export default Post;
