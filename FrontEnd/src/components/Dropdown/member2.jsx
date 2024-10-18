import * as React from "react";
import { useState, useEffect } from "react";
import { getIdolMember } from "@/api/idolinfo";
import Dropdown from "./index";

const MemberDropdown2 = ({
  isProfile,
  defaultGroup,
  defaultMember,
  onChange,
}) => {
  const [value, setValue] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedMember, setSelectedMember] = useState(0);
  const [memberItems, setMemberItems] = useState([]);

  useEffect(() => {
    setSelectedGroup(defaultGroup);
    setSelectedMember(defaultMember);

    if (defaultGroup) {
      getIdolMember(
        defaultGroup,
        (data) => {
          setMemberItems(data.data);
          const member = data.data.find(
            (item) => item.idolMemberId === defaultMember
          );
          setValue(member || null);
        },
        (error) => console.error("멤버 세팅 오류:", error)
      );
    }
  }, [defaultMember, defaultGroup]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Dropdown
      type={"member"}
      id={"member-dropdown"}
      value={value}
      option={memberItems}
      onChange={handleChange}
      sx={{
        width: isProfile ? "50vw" : "100%",
      }}
    />
  );
};

export default MemberDropdown2;
