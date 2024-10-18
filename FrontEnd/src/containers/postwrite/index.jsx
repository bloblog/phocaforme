import "./index.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container, CircularProgress } from "@mui/material";

import BarterWrite from "./BarterWrite.jsx";
import { addPostApi } from "@/api/post.jsx";

import TypeDropdown from "@/components/Dropdown/type.jsx";
import Input from "@/components/Input/index.jsx";
import BasicModal from "@/components/Modal/index.jsx";
import ImageInput from "@/components/Input/image.jsx";
import isComplete from "../../utils/isComplete.jsx";
import makeFormData from "../../utils/makeFormData.jsx";
import PairButton from "../../components/Button/pair.jsx";

const PostWrite = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [ownIdolMembers, setownIdolMembers] = useState([]);
  const [findIdolMembers, setfindIdolMembers] = useState([]);
  const [cardType, setCardType] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const imageContainerRef = useRef(null); // image-container 참조

  // 제목
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // 이미지
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

  useEffect(() => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollLeft =
        imageContainerRef.current.scrollWidth;
    }
  }, [imagePreviews]);

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
    console.log(group);
    setSelectedGroup(group);
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
    const newPost = makeFormData(
      images,
      title,
      selectedGroup,
      ownIdolMembers,
      findIdolMembers,
      cardType,
      content
    );

    // 안 채워진 항목 쳐내기
    const state = isComplete(newPost);
    if (state.length == 0) {
      addPostApi(
        newPost,
        (data) => {
          if (data.data) {
            setLoading(false);
            navigate(`/post/${data.data.id}`);
          }
        },
        (error) => {
          setLoading(false);
          console.error("Error fetching post:", error);
        }
      );
    } else {
      handleClickOpen();
      setLoading(false);
    }
  };

  const handleCancelButton = () => {
    navigate("/post");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <BasicModal
        handleClose={handleClose}
        open={open}
        content={"모든 항목은 필수 입력 사항입니다!"}
      />
      <h2 className="write-title">게시글 작성하기</h2>
      <div className="write-container-wrapper">
        <div
          className={loading ? "write-container loading" : "write-container"}
        >
          <div id="image-container" ref={imageContainerRef}>
            {imagePreviews &&
              imagePreviews.map((preview, index) => (
                <div
                  className="img-preview"
                  key={index}
                  style={{ backgroundImage: `url(${preview})` }}
                  onClick={() => handleImageDelete(index)}
                ></div>
              ))}
            <ImageInput onChange={handleImageChange} />
          </div>
          <p className="info-msg">* 사진 클릭 시 삭제됩니다.</p>
          <div id="title-container">
            <h3 style={{ margin: "0" }}>제목</h3>
            <div>
              <Input
                id={"title-input"}
                value={title}
                onChange={handleTitleChange}
                placeholder={"키워드를 입력하세요 (앨범명, 버전명 등)"}
              />
            </div>
          </div>

          <div id="group-member-input">
            <BarterWrite
              onChange={(ownIdolMembers, findIdolMembers, selectedGroup) => {
                handleOwnMemberSelection(ownIdolMembers);
                handleTargetMemberSelection(findIdolMembers);
                handleSelectedGroupChange(selectedGroup);
              }}
            />
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
          <PairButton
            type1={"게시글 등록"}
            type2={"취소"}
            handler1={handlePostClick}
            handler2={handleCancelButton}
          />
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
