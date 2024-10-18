import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useRef } from "react";

const ImageInput = ({ onChange }) => {
  const ref = useRef(null);

  const handleImageAdd = () => {
    ref.current.click();
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
        ref={ref}
        onClick={handleImageAdd}
        multiple
      />
      <div id="image-add-button" onClick={handleImageAdd}>
        <PhotoCameraIcon id="image-add-icon" />
      </div>
    </>
  );
};

export default ImageInput;
