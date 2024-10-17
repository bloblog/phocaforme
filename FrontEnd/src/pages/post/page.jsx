import { useSelector } from "react-redux";

import { Container } from "@mui/material";
import MainPost from "@/containers/postList/index";
import SearchResult from "@/containers/postList/SearchResult.jsx";
import Search from "@/containers/search/index.jsx";

const Post = () => {
  const searchs = useSelector((state) =>
    state.search.searchs ? state.search.searchs : null
  );

  return (
    <Container>
      <Search />
      {searchs ? <SearchResult /> : <MainPost />}
    </Container>
  );
};

export default Post;
