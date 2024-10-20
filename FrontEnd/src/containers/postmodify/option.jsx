import React, { useEffect, useState } from "react";

import Chip from "@mui/material/Chip";

import GroupDropdown from "@/components/Dropdown/group.jsx";
import MemberDropdown from "@/components/Dropdown/member2.jsx";
import { Grid } from "@mui/material";

const BarterModify = ({
  groupId,
  defaultOwnMember,
  defaultTargetMember,
  onChange,
}) => {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedOwnMember, setSelectedOwnMember] = useState([]);
  const [selectedFindMember, setSelectedFindMember] = useState([]);
  const [ownMembersInput, setOwnMembersInput] = useState("");
  const [targetMembersInput, setTargetMembersInput] = useState("");

  useEffect(() => {
    setSelectedGroup(groupId);
    setSelectedOwnMember(defaultOwnMember);
    setSelectedFindMember(defaultTargetMember);
  }, [groupId]);

  const handleOwnMemberChange = (member) => {
    const newMember = { id: member.idolMemberId, name: member.idolName };

    if (member) {
      setSelectedOwnMember((prevOwnMembers) => {
        // 이미 배열에 있는지 확인
        const isDuplicate = prevOwnMembers.some((m) => m.id === newMember.id);

        // 중복이 아니면 배열에 추가
        if (!isDuplicate) {
          const updatedMembers = [...prevOwnMembers, newMember];
          onChange(updatedMembers, selectedFindMember);
          return updatedMembers;
        }
        return prevOwnMembers;
      });
      setOwnMembersInput(newMember);
    } else {
      setOwnMembersInput(ownMembersInput);
    }
  };

  const handleTargetMemberChange = (member) => {
    const newMember = { id: member.idolMemberId, name: member.idolName };

    if (member) {
      setSelectedFindMember((prevFindMembers) => {
        // 이미 배열에 있는지 확인
        const isDuplicate = prevFindMembers.some((m) => m.id === newMember.id);

        // 중복이 아니면 배열에 추가
        if (!isDuplicate) {
          const updatedMembers = [...prevFindMembers, newMember];
          onChange(selectedOwnMember, updatedMembers);
          return updatedMembers;
        }
        return prevFindMembers;
      });
      setTargetMembersInput(newMember);
    } else {
      setTargetMembersInput(targetMembersInput);
    }
  };

  // 멤버 삭제 관련
  const handleOwnMemberDelete = (deletedMember) => {
    setSelectedOwnMember(
      selectedOwnMember.filter((member) => member !== deletedMember)
    );
  };

  const handleTargetMemberDelete = (deletedMember) => {
    setSelectedFindMember(
      selectedFindMember.filter((member) => member !== deletedMember)
    );
  };

  return (
    <div>
      <div id="group-input" className="search-box-group">
        <h3>그룹명</h3>
        <GroupDropdown isModify={true} defaultGroup={selectedGroup} />
      </div>
      <Grid container direction="row" spacing={1} id="member-input">
        <Grid item xs={6} id="own-member-dropdown">
          <h3>보유한 멤버</h3>
          <MemberDropdown
            defaultMember={selectedOwnMember}
            defaultGroup={selectedGroup}
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
        </Grid>
        <Grid item xs={6}>
          <h3>찾는 멤버</h3>
          <MemberDropdown
            defaultGroup={selectedGroup}
            defaultMember={selectedFindMember}
            onChange={(member) => {
              handleTargetMemberChange(member);
            }}
          />
          <div>
            {selectedFindMember.map((tag, index) => (
              <Chip
                key={index}
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
        </Grid>
      </Grid>
    </div>
  );
};

export default BarterModify;
