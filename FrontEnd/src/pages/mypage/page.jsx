import { Container } from "@mui/material";

import Nickname from "@/containers/setting/Nickname";
import Bias from "@/containers/setting/Bias";
import WishCard from "@/containers/setting/WishCard";
import LatestPost from "@/containers/postList/LatestPost";
import MyPost from "@/containers/postList/MyPost";
import QnaButton from "@/components/QnaButton";

const myPage = () => {
  return (
    <Container id="profile-page">
      <Nickname />
      <Bias />
      <WishCard />
      <LatestPost />
      <MyPost isPreview={true} />
      <QnaButton />
    </Container>
  );
};

export default myPage;
