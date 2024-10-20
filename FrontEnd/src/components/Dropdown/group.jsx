import * as React from "react";
import { useState, useEffect } from "react";

import { getIdolGroup } from "@/api/idolinfo";
import Dropdown from ".";

const GroupDropdown2 = ({ isModify, isProfile, defaultGroup, onChange }) => {
  const [groupItems, setGroupItems] = useState([]);
  const [value, setValue] = useState(null);

  useEffect(() => {
    getIdolGroup(
      (data) => {
        setGroupItems(data.data);
        if (defaultGroup) {
          const group = data.data.filter(
            (item) => item.idolGroupId === defaultGroup
          );
          setValue(group[0]);
        }
      },
      (error) => console.error("그룹 세팅 오류:", error)
    );
  }, [defaultGroup]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <Dropdown
        disable={isModify}
        type={"group"}
        id={"group-dropdown"}
        value={value}
        option={groupItems}
        onChange={handleChange}
      />
    </div>
  );
};

export default GroupDropdown2;
