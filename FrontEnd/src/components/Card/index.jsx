import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import Truncate from "@/styles/TruncatedTitle";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CustomCard = (props) => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const goToDetail = (id) => {
    navigate(`/post/${id}`);
  };

  const {
    id,
    title,
    images,
    ownMembers,
    targetMembers,
    // content,
    // type,
    isBartered,
    // isSold,
  } = props;

  console.log(props);

  return (
    <Card
      // className={`card-style${isBartered || isSold ? " done-post" : ""}`}
      className={`card-style${isBartered ? " done-post" : ""}`}
      onClick={() => goToDetail(id)}
    >
      {isBartered && (
        <div className="card-overlay">
          <p>교환완료</p>
        </div>
      )}
      {/* {isSold && (
        <div className="overlay">
          <p>판매완료</p>
        </div>
      )} */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", width: "7rem" }}>
        <CardMedia component="img" image={images} />
        <div>
          <CardHeader
            title={<Truncate truncateWidth="8rem">{title}</Truncate>}
          />
        </div>
      </Box>
      <CardContent className="card-content">
        <div>
          <div>
            <Typography variant="body2" color="text.secondary">
              <Truncate truncateWidth="7rem">{`있어요: ${ownMembers
                .map((member) => member.member_name)
                .join(", ")}`}</Truncate>
            </Typography>
          </div>
          <div>
            <Typography variant="body2" color="text.secondary">
              <Truncate truncateWidth="7rem">{`구해요: ${targetMembers
                .map((member) => member.member_name)
                .join(", ")}`}</Truncate>
            </Typography>
          </div>
        </div>
        {/* 판매 생략 */}
        {/* {type == "교환" ? (
          <div>
            <div>
              <Typography variant="body2" color="text.secondary">
                {`있어요: ${ownMembers
                  .map((member) => member.value)
                  .join(", ")}`}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="text.secondary">
                {`구해요: ${targetMembers
                  .map((member) => member.value)
                  .join(", ")}`}
              </Typography>
            </div>
          </div>
        ) : (
          <div>
            <Typography variant="body2" color="text.secondary">
              {`멤버: ${ownMembers.map((member) => member.value).join(", ")}`}
            </Typography>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};
export default CustomCard;
