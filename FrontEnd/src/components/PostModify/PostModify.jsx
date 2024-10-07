import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Button } from "@mui/material";
import RadioButton2 from "../../components/UI/RadioButton2.jsx";
import BarterModify from "./BarterModify.jsx";
import SellModify from "./SellModify.jsx";
import AddIcon from "@mui/icons-material/Add";
import TypeDropdown from "../UI/Dropdown/TypeDropdown.jsx";

const PostModify = () => {
  const navigate = useNavigate(); // useNavigate 훅 추가

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardType, setCardType] = useState(null);
  const [ownIdolMembers, setOwnIdolMembers] = useState([]);
  const [findIdolMembers, setFindIdolMembers] = useState([]);
  const [imagesChanged, setImagesChanged] = useState(false); // 이미지 변경 여부 추적

  const location = useLocation();
  const { state: post } = location;

  const {
    id: postId,
    title: postTitle,
    content: postContent,
    photos: postImages,
    cardType: postCardType,
    ownMembers: postOwnIdolMembers,
    targetMembers: postFindIdolMembers,
  } = location.state;

  const [images, setImages] = useState(postImages || []);
  // useEffect(() => {
  //   if (postImages) {
  //     setImages([...postImages]);
  //   } else {
  //     setImages([]);
  //   }
  // }, [postImages]);

  useEffect(() => {
    if (post.photos && post.photos.length > 0) {
      const defaultImagePreviews = post.photos.map(
        (photo) =>
          `https://photocardforme.s3.ap-northeast-2.amazonaws.com/${photo}`
      );
      setImagePreviews(defaultImagePreviews);
    }
  }, [post]);

  useEffect(() => {
    setTitle(postTitle || "");
    setContent(postContent || "");
    setImages(postImages || []);
    // setOwnIdolMembers(postOwnIdolMembers || []);
    // setFindIdolMembers(findIdolMembers || []);
    setCardType(postCardType ? postCardType.label : null); // 여기를 수정
    setLoading(false);
  }, [
    postTitle,
    postContent,
    postImages,
    postCardType,
    postOwnIdolMembers,
    postFindIdolMembers,
  ]);

  const [ownMembers, setOwnMembers] = useState(null);
  const [targetMembers, setTargetMembers] = useState(null);

  const fileInputRef = useRef(images); // useRef를 사용하여 fileInputRef 정의

  useEffect(() => {
    if (fileInputRef.current && !fileInputRef.current.value) {
      // 파일을 선택하지 않았을 때, file input의 value를 postImages로 설정
      fileInputRef.current.value = ""; // 빈 문자열로 설정
    }
  }, [fileInputRef, postImages]);

  const handleOwnMemberSelection = (members) => {
    setOwnIdolMembers(members);
  };

  const handleTargetMemberSelection = (members) => {
    setFindIdolMembers(members);
  };

  const handleTypeChange = (cardType) => {
    setCardType(cardType);
  };
  //아래꺼 필요 없을 듯? 0214 수정

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
        return [...postImages];
      }
    });
  };
  const handleModifyClick = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("cardType", cardType ? cardType.label : ""); // 이제 문자로 줘서 cardType만 써도 될 거 같음
      ownIdolMembers.forEach((member) => {
        formData.append("ownIdolMembers", member.idolMemberId);
      });

      findIdolMembers.forEach((member) => {
        formData.append("findIdolMembers", member.idolMemberId);
      });

      images.forEach((image) => {
        formData.append("photos", image);
      });

      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      await axios.put(
        import.meta.env.VITE_APP_API_URL + `barter/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/post");
    } catch (error) {
      console.error("Error modifying post:", error);
    }
  };

  const handleCancelButton = () => {
    navigate("/post");
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(ownMembers);
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
                  className="image-container"
                  key={index}
                  onClick={() => handleImageDelete(index)}
                >
                  <img
                    className="image-preview"
                    src={preview}
                    alt={`Image Preview ${index + 1}`}
                  />
                </div>
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
        {/* 수정 */}
        {/* 수정 */}
        {/* 수정 */}
        {/* 수정 */}
        {/* 수정 */}
        <div id="group-member-input">
          <BarterModify
            defaultGroup={post.group || []} // defaultGroup 수정 필요
            defaultOwnMember={ownMembers || []}
            defaultTargetMember={targetMembers || []}
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

        {/* 수정 */}
        {/* 수정 */}
        {/* 수정 */}
        {/* 수정 */}
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
