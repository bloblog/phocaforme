import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import GroupDropdown2 from "@/components/Dropdown/group.jsx";
import MemberDropdown2 from "@/components/Dropdown/member.jsx";

import Chip from "@mui/material/Chip";

const BarterWrite2 = ({
  defaultGroup,
  defaultOwnMembers,
  defaultTargetMembers,
  onChange,
}) => {
  const [selectedGroup, setSelectedGroup] = useState(defaultGroup);

  const loginUser = useSelector((state) => state.user.user);

  const handleGroupChange = (group) => {
    if (group) {
      setSelectedGroup(group);
      onChange(selectedGroup, ownMembers, targetMembers);
    } else {
      setSelectedGroup(null);
    }
    // 그룹이 변경되었을 때 멤버와 입력값 초기화
    setOwnMembers([]);
    setTargetMembers([]);
    setOwnMembersInput("");
    setTargetMembersInput("");
  };

  const [ownMembers, setOwnMembers] = useState(
    defaultOwnMembers ? defaultOwnMembers : []
  );
  const [targetMembers, setTargetMembers] = useState(
    defaultTargetMembers ? defaultTargetMembers : []
  );

  const [ownMembersInput, setOwnMembersInput] = useState("");
  const [targetMembersInput, setTargetMembersInput] = useState("");

  /// 수정해야함
  const handleOwnMemberChange = (member) => {
    if (member) {
      setOwnMembers((prevOwnMembers) => [...prevOwnMembers, member]);
      onChange(selectedGroup, [...ownMembers, member], targetMembers);
      setOwnMembersInput(member);
    } else {
      setOwnMembersInput(ownMembersInput);
    }
  };

  const handleTargetMemberChange = (member) => {
    if (member) {
      setTargetMembers((prevTargetMembers) => [...prevTargetMembers, member]);
      onChange(selectedGroup, ownMembers, [...targetMembers, member]);
      setTargetMembersInput(member);
    } else {
      setTargetMembersInput(targetMembersInput);
    }
  };

  // 멤버 삭제 관련
  const handleOwnMemberDelete = (deletedMember) => {
    setOwnMembers((prevOwnMembers) =>
      prevOwnMembers.filter(
        (member) => member.idolMemberId !== deletedMember.idolMemberId
      )
    );
    onChange(
      selectedGroup,
      (prevOwnMembers) =>
        prevOwnMembers.filter(
          (member) => member.idolMemberId !== deletedMember.idolMemberId
        ),
      targetMembers
    );
  };

  const handleTargetMemberDelete = (deletedMember) => {
    setTargetMembers((prevTargetMembers) =>
      prevTargetMembers.filter(
        (member) => member.idolMemberId !== deletedMember.idolMemberId
      )
    );
    onChange(selectedGroup, ownMembers, (prevTargetMembers) =>
      prevTargetMembers.filter(
        (member) => member.idolMemberId !== deletedMember.idolMemberId
      )
    );
  };

  return (
    <div id="group-member-input">
      <div id="group-input" className="search-box-group">
        <div className="searchbar-title">그룹명</div>
        <GroupDropdown2
          defaultGroup={defaultGroup}
          onChange={(group) => {
            handleGroupChange(group);
          }}
        />
      </div>
      <div id="member-input">
        <div id="own-member-dropdown">
          <div className="searchbar-title">보유한 멤버</div>

          <MemberDropdown2
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
        <div>
          <div className="searchbar-title">찾는 멤버</div>

          <MemberDropdown2
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

export default BarterWrite2;
