import { Container } from '@mui/material';

import Nickname from "../components/Setting/Nickname";
import Bias from "../components/Setting/Bias";
import WishCard from "../components/Setting/WishCard";
import LatestPost from "../components/PostList/LatestPost";
import MyPost from "../components/PostList/MyPost";
import QnaButton from "../components/UI/QnaButton";

const profile = () => {
    return (
        <Container id='profile-page'>
            <Nickname/>
            <Bias/>
            <WishCard/>
            <LatestPost />
            <MyPost isPreview={true}/>
            <QnaButton/>
        </Container>
    );
};

export default profile;