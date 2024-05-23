import { useSelector } from "react-redux";

import { Container } from '@mui/material';
import MainPost from '../components/PostList/MainPost';
import SearchResult from '../components/PostList/SearchResult';
import Search from '../components/Search/Search.jsx';

const Post = () => {
    
    const searchs = useSelector((state) =>
        state.search.searchs ? state.search.searchs : null);
    
    return (
        <Container>
            <Search/>
            {searchs ? <SearchResult/> : <MainPost/>}

        </Container>
    );
};

export default Post;