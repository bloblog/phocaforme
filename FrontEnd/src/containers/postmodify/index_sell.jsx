import React, { useState, useEffect, useRef } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useFetcher,
} from "react-router-dom";
import { Container, Button } from "@mui/material";
import BarterModify from "./barterpost.jsx";
import AddIcon from "@mui/icons-material/Add";
import TypeDropdown from "@/components/Dropdown/TypeDropdown.jsx";
import { getPost, modifyPost } from "../../api/post.jsx";

const PostModify = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [groupId, setGroupId] = useState(0);
  const [ownIdolMembers, setOwnIdolMembers] = useState([]);
  const [findIdolMembers, setFindIdolMembers] = useState([]);
  const [cardType, setCardType] = useState("");
  const [content, setContent] = useState("");

  // const [ownMembers, setOwnMembers] = useState(null);
  // const [targetMembers, setTargetMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagesChanged, setImagesChanged] = useState(false); // 이미지 변경 여부 추적

  useEffect(() => {
    if (images.length > 0) {
      const defaultImagePreviews = images.map(
        (photo) =>
          `https://photocardforme.s3.ap-northeast-2.amazonaws.com/${photo}`
      );
      setImagePreviews(defaultImagePreviews);
    }
  }, [images]);

  useEffect(() => {
    getPost(
      id,
      (data) => {
        setTitle(data.data.title);
        setImages(data.data.photos);
        setGroupId(data.data.groupId);
        setOwnIdolMembers(data.data.ownIdolMembers);
        setFindIdolMembers(data.data.findIdolMembers);
        setCardType(data.data.cardType);
        setContent(data.data.content);

        setLoading(false);
      },
      (err) => {
        console.error("Error Get Post: " + err);
      }
    );
    setLoading(false);
  }, []);

  const fileInputRef = useRef(images); // useRef를 사용하여 fileInputRef 정의

  useEffect(() => {
    if (fileInputRef.current && !fileInputRef.current.value) {
      // 파일을 선택하지 않았을 때, file input의 value를 postImages로 설정
      fileInputRef.current.value = ""; // 빈 문자열로 설정
    }
  }, [fileInputRef, images]);

  const handleOwnMemberSelection = (members) => {
    setOwnIdolMembers(members);
  };

  const handleTargetMemberSelection = (members) => {
    setFindIdolMembers(members);
  };

  const handleGroupSelection = (group) => {
    setGroupId(group);
  };

  const handleTypeChange = (cardType) => {
    setCardType(cardType);
  };

  // const handleTypeChange = (cardType) => {
  //   if (cardType == null) {
  //     cardType = {
  //       value: "",
  //       label: "",
  //     };
  //   }
  //   setCardType(cardType);
  // };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
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

    setImagesChanged(true);
  };

  const handleImageAdd = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
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

    // 이미지를 추가할 때 이전 상태를 기반으로 새로운 배열을 생성합니다.
    setImages((prevImages) => {
      if (prevImages) {
        // handleImageChange 함수가 실행되었을 때
        return [...prevImages, ...newImages];
      } else {
        // handleImageChange 함수가 실행되지 않았을 때
        return [...images];
      }
    });
  };

  const handleModifyClick = () => {
    const formData = new FormData();
    formData.append("title", title);
    // const encodedContent = encodeURIComponent(content);
    formData.append("content", content);
    formData.append("cardType", cardType ? cardType.label : "");
    formData.append("groupId", groupId);
    ownIdolMembers.forEach((member) => {
      formData.append("ownIdolMembers", member.idolMemberId);
    });

    findIdolMembers.forEach((member) => {
      formData.append("findIdolMembers", member.idolMemberId);
    });

    images.forEach((image) => {
      formData.append("photos", image);
    });

    modifyPost(
      formData,
      id,
      (data) => {
        navigate(`post/${id}`);
      },
      (error) => {
        console.error("Error modifying post:", error);
      }
    );
  };

  const handleCancelButton = () => {
    navigate("/post");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div id="write-container">
        {/* <div id="write-radio-container">
          <RadioButton2 defaultType={postCardType} />
        </div> */}
        <div id="image-input">
          <div>
            <h3>사진 (클릭시 삭제됩니다.)</h3>
            <p className="info-msg">
              * 사진 사이즈는 포토카드 사이즈가 좋아요!
            </p>
          </div>
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
              <AddIcon id="image-add-icon" />
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
        </div>
        <div id="title-container">
          <h3>제목</h3>
          <input
            id="title-input"
            value={title}
            onChange={handleTitleChange}
            variant="outlined"
            placeholder="앨범명, 버전명을 입력하세요"
          />
        </div>
        <div id="group-member-input">
          <BarterModify
            groupId={groupId}
            defaultOwnMember={ownIdolMembers}
            defaultTargetMember={findIdolMembers}
            onChange={(ownMembers, targetMembers) => {
              handleOwnMemberSelection(ownMembers);
              handleTargetMemberSelection(targetMembers);
            }}
          />
        </div>

        {/* 
        <div id="group-member-input">
          {postCardType === "교환" ? (
            <BarterModify
              defaultGroup={post.group || []} // defaultGroup 수정 필요
              defaultOwnMember={ownMembers || []}
              defaultTargetMember={targetMembers || []}
              onChange={(ownMembers, targetMembers) => {
                handleOwnMemberSelection(ownMembers);
                handleTargetMemberSelection(targetMembers);
              }}
            />
          ) : (
            <SellModify
              defaultGroup={post.group || []} // defaultGroup 수정 필요
              defaultOwnMember={ownMembers || []}
              onChange={(ownMembers) => {
                handleOwnMemberSelection(ownMembers);
              }}
            />
          )}
        </div> */}

        <div id="card-input">
          <h3>포토카드 종류</h3>
          <TypeDropdown
            // defaultCardType={cardType}
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
          />
        </div>
        <div id="button-container">
          <Button
            variant="contained"
            color="primary"
            onClick={handleModifyClick}
            style={{ marginRight: "10px" }}
          >
            수정
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
    </Container>
  );
};

export default PostModify;
