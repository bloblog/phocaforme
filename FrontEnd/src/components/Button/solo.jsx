import { Button } from "@mui/material";
import "./index.css";

const SoloButton = ({ type, handler, color }) => {
  return (
    <div id="button-container">
      <Button variant="contained" color={color} onClick={handler}>
        {type}
      </Button>
    </div>
  );
};

export default SoloButton;
