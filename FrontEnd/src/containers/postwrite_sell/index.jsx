import "./index.css";
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Container, Button, CircularProgress } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import BarterWrite from "./barteWrite.jsx";
import SellWrite from "./sellWrite.jsx";
import TypeDropdown from "@/components/Dropdown/type.jsx";
import { addPostApi, getPost } from "@/api/post.jsx";

const PostWrite = () => {
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [ownIdolMembers, setownIdolMembers] = useState([]);
  const [findIdolMembers, setfindIdolMembers] = useState([]);
  const [cardType, setCardType] = useState(null);
  const [content, setContent] = useState("");

  // 교환인지 판매인지
  const [isExchange, setIsExchange] = useState(true);
  function onExchangeChange(value) {
    setIsExchange(value === "교환");
  }

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // 제목
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // 이미지
  const handleImageAdd = () => {
    fileInputRef.current.click();
  };

  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });

    setImagePreviews((prevImagePreviews) => {
      const newImagePreviews = [...prevImagePreviews];
      newImagePreviews.splice(index, 1);
      return newImagePreviews;
    });
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    setImages((prevImages) => [...prevImages, ...Array.from(files)]);

    const newImages = Array.from(files);
    const newImagePreviews = [];

    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        if (newImagePreviews.length === newImages.length) {
          setImagePreviews((prevImagePreviews) => [
            ...prevImagePreviews,
            ...newImagePreviews,
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 그룹
  const handleSelectedGroupChange = (group) => {
    console.log(group.idolGroupId);
    setSelectedGroup(group.idolGroupId);
  };

  // 멤버
  const handleOwnMemberSelection = (members) => {
    setownIdolMembers(members);
  };

  const handleTargetMemberSelection = (members) => {
    setfindIdolMembers(members);
  };

  // 카드 종류
  const handleTypeChange = (cardType) => {
    setCardType(cardType);
  };

  // 내용
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // 게시글 작성
  const handlePostClick = () => {
    setLoading(true);
    // 새로운 게시물 객체 생성
    // 안 채워진 항목 쳐내기
    const newPost = new FormData();
    images.forEach((image) => {
      newPost.append(`photos`, image);
    });
    newPost.append("title", title);
    newPost.append("groupId", selectedGroup);

    ownIdolMembers.forEach((member) => {
      newPost.append("ownIdolMembers", member.idolMemberId);
    });

    findIdolMembers.forEach((member) => {
      newPost.append("findIdolMembers", member.idolMemberId);
    });

    newPost.append("cardType", cardType.value);

    const encodedContent = encodeURIComponent(content);
    newPost.append("content", encodedContent);

    addPostApi(
      newPost,
      (data) => {
        if (data.data) {
          setLoading(false);
          navigate("/post");
        }
      },
      (error) => {
        setLoading(false);
        console.error("Error fetching post:", error);
      }
    );
  };

  const handleCancelButton = () => {
    console.log("게시물 생성 취소");
    navigate("/post");
  };

  return (
    <Container>
      <h2 className="write-title">게시글 작성하기</h2>
      <div className="write-container-wrapper">
        <div
          className={loading ? "write-container loading" : "write-container"}
        >
          <div id="image-input">
            <div id="image-list">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                ref={fileInputRef}
                multiple
              />
              <div id="image-add-button" onClick={handleImageAdd}>
                <PhotoCameraIcon id="image-add-icon" />
              </div>
              {imagePreviews &&
                imagePreviews.map((preview, index) => (
                  <div
                    className="img-preview"
                    key={index}
                    style={{ backgroundImage: `url(${preview})` }}
                    onClick={() => handleImageDelete(index)}
                  ></div>
                ))}
            </div>
            <p className="info-msg">* 사진 클릭 시 삭제됩니다.</p>
          </div>
          <div id="title-container">
            <h3 style={{ margin: "0" }}>제목</h3>
            <input
              id="title-input"
              value={title}
              onChange={handleTitleChange}
              variant="outlined"
              placeholder="키워드를 입력하세요 (앨범명, 버전명 등)"
            />
          </div>

          <div id="group-member-input">
            {isExchange ? (
              <BarterWrite
                onChange={(ownIdolMembers, findIdolMembers, selectedGroup) => {
                  handleOwnMemberSelection(ownIdolMembers);
                  handleTargetMemberSelection(findIdolMembers);
                  handleSelectedGroupChange(selectedGroup);
                }}
              />
            ) : (
              <SellWrite
                onChange={(ownIdolMembers) => {
                  handleOwnMemberSelection(ownIdolMembers);
                }}
              />
            )}
          </div>
          <div id="card-input">
            <h3>포토카드 종류</h3>
            <TypeDropdown
              onChange={(type) => {
                handleTypeChange(type);
              }}
            />
          </div>

          <div id="content-input-container">
            <h3>상세 내용</h3>
            <textarea
              className="content-input"
              value={content}
              onChange={handleContentChange}
              placeholder="포토카드 상태에 대한 세부 내용을 적어주세요."
              style={{ whiteSpace: "pre-line" }}
            />
          </div>
          <div id="button-container">
            <Button
              variant="contained"
              color="primary"
              onClick={handlePostClick}
              style={{ marginRight: "10px" }}
            >
              게시글 등록
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleCancelButton}
            >
              취소
            </Button>
          </div>
        </div>
        {loading && (
          <div className="loading-spinner">
            <CircularProgress />
          </div>
        )}
      </div>
    </Container>
  );
};

export default PostWrite;
