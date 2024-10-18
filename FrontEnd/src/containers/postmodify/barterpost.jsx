import React, { useEffect, useState } from "react";

import Chip from "@mui/material/Chip";

import GroupDropdown from "@/components/Dropdown/group.jsx";
import MemberDropdown from "@/components/Dropdown/member2.jsx";

const BarterModify = ({
  groupId,
  defaultOwnMember,
  defaultTargetMember,
  onChange,
}) => {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedOwnMember, setSelectedOwnMember] = useState([]);
  const [selectedFindMember, setSelectedFindMember] = useState([]);

  useEffect(() => {
    setSelectedGroup(groupId);
    setSelectedOwnMember(defaultOwnMember);
    setSelectedFindMember(defaultTargetMember);
  }, [groupId, defaultOwnMember, defaultTargetMember]);

  const [ownMembers, setOwnMembers] = useState([]);
  const [targetMembers, setTargetMembers] = useState([]);
  const [ownMembersInput, setOwnMembersInput] = useState("");
  const [targetMembersInput, setTargetMembersInput] = useState("");

  /// 수정해야함
  const handleOwnMemberChange = (member) => {
    if (member) {
      setOwnMembers((prevOwnMembers) => [...prevOwnMembers, member]);
      onChange([...ownMembers, member], targetMembers);
      setOwnMembersInput(member.value);
    } else {
      setOwnMembersInput(ownMembersInput);
    }
  };

  const handleTargetMemberChange = (member) => {
    if (member) {
      setTargetMembers((prevTargetMembers) => [...prevTargetMembers, member]);
      onChange(ownMembers, [...targetMembers, member]);
      setTargetMembersInput(member.value);
    } else {
      setTargetMembersInput(targetMembersInput);
    }
  };

  // 멤버 삭제 관련
  const handleOwnMemberDelete = (deletedMember) => {
    setOwnMembers(ownMembers.filter((member) => member !== deletedMember));
  };

  const handleTargetMemberDelete = (deletedMember) => {
    setTargetMembers(
      targetMembers.filter((member) => member !== deletedMember)
    );
  };

  return (
    <div>
      <div id="group-input" className="search-box-group">
        <h3>그룹명</h3>
        <GroupDropdown isModify={true} defaultGroup={selectedGroup} />
      </div>
      <div id="member-input">
        <div id="own-member-dropdown">
          <h3>보유한 멤버</h3>
          <MemberDropdown
            defaultMember={selectedOwnMember}
            selectedGroup={selectedGroup}
            onChange={(member) => {
              handleOwnMemberChange(member);
            }}
          />
          <div>
            {selectedOwnMember.map((tag, index) => (
              <Chip
                key={index}
                label={tag?.name}
                variant="outlined"
                onClick={() => handleOwnMemberDelete(tag)}
                onDelete={() => handleOwnMemberDelete(tag)}
                style={{
                  margin: "4px",
                  border: 0,
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <h3>찾는 멤버</h3>
          <MemberDropdown
            selectedGroup={selectedGroup}
            defaultMember={selectedFindMember}
            onChange={(member) => {
              handleTargetMemberChange(member);
            }}
          />
          <div>
            {selectedFindMember.map((tag) => (
              <Chip
                key={tag.id}
                label={tag?.name}
                variant="outlined"
                onClick={() => handleTargetMemberDelete(tag)}
                onDelete={() => handleTargetMemberDelete(tag)}
                style={{
                  margin: "4px",
                  border: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarterModify;
