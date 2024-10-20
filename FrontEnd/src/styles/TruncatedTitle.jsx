// 한 줄 넘어가면 ... 처리
import { styled } from "@mui/system";

const Truncate = styled("div")(({ theme, truncateWidth }) => ({
  width: truncateWidth || "80%",
  whiteSpace: "nowrap",
  textAlign: "start",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

export default Truncate;
