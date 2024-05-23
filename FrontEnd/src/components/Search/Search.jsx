import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { addSearchData, clearSearchData } from "../../store2/search.js";

import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import { useTheme } from "@mui/material/styles";

import { Button } from "@mui/material";
import BarterWrite2 from "../../components/PostWrite/BarterWrite2.jsx";
import SellWrite2 from "../../components/PostWrite/SellWrite2.jsx";
import TypeDropdown2 from "../UI/Dropdown/TypeDropdown2.jsx";

const Search = () => {
  const [userInput, setUserInput] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [targetMembers, setTargetMembers] = useState([]);
  const [ownMembers, setOwnMembers] = useState([]);
  const [cardType, setCardType] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();

  // 최근 검색 기록 가져와
  useEffect(() => {
    const searchHistory = JSON.parse(localStorage.getItem("searchCondition"));

    if (searchHistory) {
      setSelectedGroup(searchHistory.group);
      setUserInput(searchHistory.query);
      setOwnMembers(searchHistory.ownMembers);
      setTargetMembers(searchHistory.targetMembers);
      setCardType(searchHistory.cardType);
    }
  }, [isClicked]);

  const handleTypeChange = (cardType) => {
    if (cardType == null) {
      cardType = {
        value: "",
        label: "",
      };
    }
    setCardType(cardType);
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  function onClick() {
    setIsClicked((prevIsClicked) => !prevIsClicked);
  }

  const handleOwnMemberSelection = (members) => {
    setOwnMembers(members);
    console.log(members);
  };

  const handleTargetMemberSelection = (members) => {
    setTargetMembers(members);
  };

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
  };

  function handleSearchClick() {
    const searchData = {
      group: selectedGroup ? selectedGroup : null,
      query: userInput ? userInput : null,
      ownMembers: ownMembers ? ownMembers : [],
      targetMembers: targetMembers ? targetMembers : [],
      cardType: cardType ? cardType : null,
    };

    dispatch(addSearchData(searchData));

    // 최근 검색 기록 저장
    localStorage.setItem("searchCondition", JSON.stringify(searchData));

    // 초기화
    setUserInput(null);
    setSelectedGroup(null);
    setOwnMembers([]);
    setTargetMembers([]);
    setCardType(null);

    navigate("/post");
    onClick(); // 검색창 닫기
  }

  // 엔터 키를 눌렀을 때도 send
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div id="search-container">
      <h3>어떤 포카를 찾으시나요?</h3>

      <div id="search-option-container">
        {!isClicked ? (
          <div style={{ position: "relative" }}>
            <input
              onClick={onClick}
              onKeyDown={handleEnter}
              id="search-title-input"
              value={userInput}
              onChange={handleUserInputChange}
              variant="outlined"
              placeholder="앨범, 버전명 등을 입력해주세요"
            />
            <FaSearch className="search-icon-start" onClick={onClick} />
            <IoIosArrowDown className="search-icon-end" onClick={onClick} />
          </div>
        ) : (
          <div id="search-container">
            <div style={{ position: "relative" }}>
              <input
                id="search-title-input"
                value={userInput}
                onKeyDown={handleEnter}
                onChange={handleUserInputChange}
                variant="outlined"
                placeholder="앨범, 버전명 등을 입력해주세요"
              />
              <FaSearch className="search-icon-start" onClick={onClick} />
              <IoIosArrowDown className="search-icon-end" onClick={onClick} />
            </div>

            <div>
              {/* {isExchange ? ( */}
                <BarterWrite2
                  defaultGroup={selectedGroup}
                  defaultOwnMembers={ownMembers}
                  defaultTargetMembers={targetMembers}
                  onChange={(group, ownMembers, targetMembers) => {
                    handleGroupSelection(group);
                    handleOwnMemberSelection(ownMembers);
                    handleTargetMemberSelection(targetMembers);
                  }}
                />
              {/* ) : (
                <SellWrite2 />
              )} */}
            </div>
            <div>
            <div className="searchbar-title">포토카드 종류</div>
            <TypeDropdown2
              defaultCardType={cardType}
              onChange={(type) => {
                handleTypeChange(type);
              }}
            />

            </div>
            <div id="search-buttons">
              <Button id="search-button" onClick={handleSearchClick}>
                검색
              </Button>
              <Button id="search-close-button" onClick={onClick}>
                닫기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
