import React, { useEffect, useState } from "react";
import axios from "axios";

import { useTheme } from "@mui/material/styles";

import {
  Card,
  Box,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import GroupDropdown from "../UI/Dropdown/GroupDropdown2";
import MemberDropdown from "../UI/Dropdown/MemberDropdown2";

const WishCard = () => {
  const theme = useTheme();

  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);

  // 키워드 관련
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [helperText, setHelperText] = useState("");

  const handleGroupChange = (group) => {
    if (group) {
      setSelectedGroup(group);
    } else {
      setSelectedGroup(null);
      setSelectedMember(null);
    }
  };

  const handleMemberChange = (member) => {
    setSelectedMember(member);
  };

  // 갈망포카 객체 생성
  const labels = tags.map((tag) => tag.label);

  const handleWishCard = () => {
    // 그룹, 멤버 설정 안하면 안됨
    if (selectedMember == null) {
      alert("그룹, 멤버를 설정해주세요.");
      return;
    }

    const data = {
      memberId: selectedMember ? selectedMember.idolMemberId : null,
      keyword1: labels.length > 0 ? labels[0] : null,
      keyword2: labels.length > 1 ? labels[1] : null,
      keyword3: labels.length > 2 ? labels[2] : null,
    };

    // db 에 반영하기
    axios
      .put(import.meta.env.REACT_APP_API_URL + `user/wishCard`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setWishCard(data);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error setting bias:", error);
      });
  };

  // 키워드 관련
  const getChipColor = (index) => {
    const colors = ["#FB37A3", "#FD9DD1", "rgba(142, 96, 203, 1)"];
    return colors[index];
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setHelperText("");
  };

  const handleInputKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (tags.length < 3) {
        setTags([
          ...tags,
          { label: inputValue.trim(), color: getChipColor(tags.length) },
        ]);
        setInputValue("");
      } else {
        setHelperText("태그 개수는 최대 3개입니다.");
      }
    }
  };

  const handleChipDelete = (deletedTag) => {
    setTags(tags.filter((tag) => tag !== deletedTag));
    setHelperText("");
  };

  const [wishCard, setWishCard] = useState(null);

  // 이미 갈망포카가 있다면 가져와라
  useEffect(() => {
    axios
      .get(import.meta.env.REACT_APP_API_URL + `user/wishCard`, {
        withCredentials: true,
      })
      .then((response) => {
        setWishCard(response.data);
      })
      .catch((error) => {
        console.error("Error get wishcard:", error);
      });
  }, [wishCard]);

  // 갈망포카 삭제
  const handleDelete = () => {
    axios
      .delete(import.meta.env.REACT_APP_API_URL + `user/wishCard`, {
        withCredentials: true,
      })
      .then((response) => {
        setWishCard(null);
      })
      .catch((error) => {
        console.error("Error delete wishcard:", error);
      });
  };

  return (
    <div className="profile-item-container">
      <h2 className="profile-title">나의 갈망포카</h2>
      <div id="wishcard-container">
        <div className="wishcard-content">
          <div>
            {wishCard !== null ? (
              <div id="wishcard-card-container">
                <div id="wishcard-card-keyword">
                  {[wishCard.keyword1, wishCard.keyword2, wishCard.keyword3]
                    .filter(Boolean)
                    .map((keyword, index) => `#${keyword}`)
                    .join("\n")}
                </div>
                <div id="wishcard-card-content-header">
                  <ClearIcon id="wishcard-clear-icon" onClick={handleDelete} />
                </div>
              </div>
            ) : (
              "아직 갈망포카가 없어요"
            )}
          </div>
          <div id="wishcard-description">*설정 시 매물 알림이 가요!</div>
        </div>
      </div>
      <div className="profile-dropdown-container">
        <div className="profile-group-container">
          <div className="bias-title">그룹명</div>
          <div>
            <GroupDropdown
              isProfile={true}
              onChange={(group) => {
                handleGroupChange(group);
              }}
            />
          </div>
        </div>
        <div id="wishcard-member-container">
          <div className="bias-title">멤버명</div>
          <div>
            <MemberDropdown
              isProfile={true}
              selectedGroup={selectedGroup}
              onChange={(member) => {
                handleMemberChange(member);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <div id="wishcard-input-container">
          <div className="bias-title" id="bias-keyword">
            키워드를 입력해주세요
          </div>
          <TextField
            size="small"
            placeholder="앨범명, 콘서트명, 버전명, 종류 등을 입력하세요."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            sx={{ width: "70vw" }}
            helperText={helperText}
          />

          <div>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.label}
                variant="outlined"
                onClick={() => handleChipDelete(tag)}
                onDelete={() => handleChipDelete(tag)}
                size="small"
                style={{
                  margin: "4px",
                  border: 0,
                  backgroundColor: tag.color,
                  color: "white",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
        <Button variant="contained" onClick={handleWishCard}>
          적용
        </Button>
      </div>
    </div>
  );
};

export default WishCard;
