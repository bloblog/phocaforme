import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container } from '@mui/material';
import ChartTab from '../components/Chart/ChartTab';
import Search from '../components/Search/Search.jsx';
import PreviewPost from '../components/PostList/PreviewPost.jsx';
import MyCarousel from '../components/Carousel/Carousel.jsx';


const Main = () => {
    // Redux 스토어에서 유저 정보 가져오기
    const user = useSelector((state) => (state.user ? state.user.user : [])); 

    

    return (
        <Container>
            <div id='search-container'>
                <Search />
            </div>
            <MyCarousel />
            <ChartTab/>
            <PreviewPost />
        </Container>
    );
};

export default Main;
