import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import GroupDropdown from "../../component/Dropdown/GroupDropdown2.jsx";
import MemberDropdown from "../../component/Dropdown/MemberDropdown2.jsx";

import Chip from "@mui/material/Chip";

const BarterWrite = ({ defaultGroup, onChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedGroup, setSelectedGroup] = useState(defaultGroup);

  const handleGroupChange = (group) => {
    if (group) {
      setSelectedGroup(group);
    } else {
      setSelectedGroup(null);
    }
    // 그룹이 변경되었을 때 멤버와 입력값 초기화
    setOwnMembers([]);
    setTargetMembers([]);
    setOwnMembersInput("");
    setTargetMembersInput("");
  };

  const [ownMembers, setOwnMembers] = useState([]);
  const [targetMembers, setTargetMembers] = useState([]);

  const [ownMembersInput, setOwnMembersInput] = useState("");
  const [targetMembersInput, setTargetMembersInput] = useState("");

  /// 수정해야함
  const handleOwnMemberChange = (member) => {
    if (member) {
      setOwnMembers((prevOwnMembers) => [...prevOwnMembers, member]);
      onChange([...ownMembers, member], targetMembers, selectedGroup);
      setOwnMembersInput(member.value);
    } else {
      setOwnMembersInput(ownMembersInput);
    }
  };

  const handleTargetMemberChange = (member) => {
    if (member) {
      setTargetMembers((prevTargetMembers) => [...prevTargetMembers, member]);
      onChange(ownMembers, [...targetMembers, member], selectedGroup);
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
        <GroupDropdown
          onChange={(group) => {
            handleGroupChange(group);
          }}
        />
      </div>
      <div id="member-input">
        <div id="own-member-dropdown">
          <h3>보유한 멤버</h3>
          <MemberDropdown
            selectedGroup={selectedGroup}
            onChange={(member) => {
              handleOwnMemberChange(member);
            }}
          />
          <div>
            {ownMembers &&
              ownMembers.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag?.idolName}
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
        <div id="target-member-dropdown">
          <h3>찾는 멤버</h3>
          <MemberDropdown
            selectedGroup={selectedGroup}
            onChange={(member) => {
              handleTargetMemberChange(member);
            }}
          />
          <div>
            {targetMembers &&
              targetMembers.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag?.idolName}
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

export default BarterWrite;
