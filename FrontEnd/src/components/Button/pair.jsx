import { Button } from "@mui/material";
import "./index.css";

const PairButton = ({ type1, type2, handler1, handler2 }) => {
  return (
    <div id="button-container">
      <Button
        variant="contained"
        color="primary"
        onClick={handler1}
        style={{ marginRight: "10px" }}
      >
        {type1}
      </Button>
      <Button variant="contained" color="warning" onClick={handler2}>
        {type2}
      </Button>
    </div>
  );
};

export default PairButton;
