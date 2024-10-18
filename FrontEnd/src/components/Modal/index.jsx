import { Dialog, DialogContent } from "@mui/material";
import SoloButton from "@/components/Button/solo";
import "./index.css";

const BasicModal = ({ handleClose, open, content }) => {
  return (
    <Dialog
      id="warn-modal-container"
      onClose={handleClose}
      open={open}
      maxWidth={false}
    >
      <DialogContent id="warn-modal">
        <div>{content}</div>
        <SoloButton type={"확인"} handler={handleClose} color={"warning"} />
      </DialogContent>
    </Dialog>
  );
};

export default BasicModal;
