// 제목 생략 스타일
import { styled } from "@mui/system";

const TruncatedTitle = styled("div")(({ theme, truncateWidth }) => ({
  width: truncateWidth || "80%",
  whiteSpace: "nowrap",
  textAlign: "start",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

export default TruncatedTitle;
