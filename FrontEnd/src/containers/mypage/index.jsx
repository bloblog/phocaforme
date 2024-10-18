import "./index.css";
import Nickname from "@/containers/mypage/Nickname";
import Bias from "@/containers/mypage/Bias";
import WishCard from "@/containers/mypage/WishCard";
import LatestPost from "@/containers/postList/LatestPost";
import MyPost from "@/containers/postList/MyPost";
import QnaButton from "@/components/QnaButton";
import { Container } from "@mui/material";

const MyPage = () => {
  return (
    <Container id="profile-page">
      <Nickname />
      <Bias />
      {/* <WishCard /> */}
      <LatestPost />
      <MyPost isPreview={true} />
      <QnaButton />
    </Container>
  );
};

export default MyPage;
