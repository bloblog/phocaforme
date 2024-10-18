// 게시물 생성용
import * as React from "react";
import { useState, useEffect } from "react";
import { getIdolGroup } from "@/api/idolinfo";
import Dropdown from "./index";

const GroupDropdown = ({ isProfile, defaultGroup, onChange }) => {
  const [groupItems, setGroupItems] = useState([]);

  useEffect(() => {
    getIdolGroup(
      (data) => {
        setGroupItems(data.data);
      },
      (error) => console.error("그룹 세팅 오류:", error)
    );
  }, []);

  const [value, setValue] = useState(defaultGroup);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <Dropdown
        type={"group"}
        id={"group-dropdown"}
        value={value}
        option={groupItems}
        onChange={handleChange}
      />
    </div>
  );
};

export default GroupDropdown;
