import React, { useEffect, useState } from "react";
import Dropdown from "./index";

const TypeDropdown = ({ defaultCardType, onChange }) => {
  const TypeItems = ["앨범포카", "미공포", "럭키드로우", "공방포카", "기타"];
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(defaultCardType);
  }, [defaultCardType]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Dropdown
      type={"type"}
      id={"card-type-dropdown"}
      value={value}
      option={TypeItems}
      onChange={handleChange}
    />
  );
};

export default TypeDropdown;
