import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import ChartTab from "@/containers/chart/index";
import Search from "@/containers/search/index";
import PreviewPost from "@/containers/postList/PreviewPost";
import MyCarousel from "@/containers/carousel/index";

const Main = () => {
  // Redux 스토어에서 유저 정보 가져오기
  const user = useSelector((state) => (state.user ? state.user.user : []));

  return (
    <Container>
      <div id="search-container">
        <Search />
      </div>
      <MyCarousel />
      <ChartTab />
      <PreviewPost />
    </Container>
  );
};

export default Main;
