import "./index.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dialog, DialogContent } from "@mui/material";
import PostCaution from "@/components/Caution/post";
import {
  Container,
  ImageList,
  ImageListItem,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { openChatRoom } from "../../api/chat";
import { deletePost, getPost, pullupPost } from "../../api/post";
import NeedLogin from "../../components/Modal/NeedLogin";
import AmazonSrc from "../../constants/amazonS3";

const DetailPost = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const user = useSelector((state) => state.user.user);

  const handleClickOpen = (src) => {
    setImageSrc(src);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  // 디테일 페이지에 진입했을 때 로컬스토리지에 저장
  const saveToLocalStorage = () => {
    if (post && post.id) {
      const existingRecentCard =
        JSON.parse(localStorage.getItem("recentCard")) || [];
      const cardInfo = {
        id: post.id,
        title: post.title,
        images: post.photos,
        groupId: post.groupId,
        ownMembers: post.ownIdolMembers,
        targetMembers: post.findIdolMembers,
        isBartered: post.bartered,
      };

      const isExisting = existingRecentCard.some((card) => card.id === post.id);

      if (isExisting) {
        const updatedRecentCard = existingRecentCard.filter(
          (card) => card.id !== post.id
        );
        updatedRecentCard.push(cardInfo);
        localStorage.setItem("recentCard", JSON.stringify(updatedRecentCard));
      } else {
        const updatedRecentCard = [...existingRecentCard, cardInfo];
        if (updatedRecentCard.length > 5) {
          updatedRecentCard.shift();
        }
        localStorage.setItem("recentCard", JSON.stringify(updatedRecentCard));
      }
    }
  };

  useEffect(() => {
    getPost(
      id,
      (data) => {
        setPost(data.data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching post:", error);
      }
    );
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [post]);

  // 내 게시글인지 판별
  const currentUser = useSelector((state) => state.user.user);
  const isCurrentUserWriter =
    post && currentUser && currentUser.userId === post.userId;

  const handleChatClick = () => {
    // 로그인 안했으면 쳐내
    if (user.userId == null) {
      handleModalOpen();
    } else {
      // 채팅방 생성
      openChatRoom(
        id,
        (data) => {
          navigate(`/chatroom/${data.data.chatRoomId}`, {
            state: data.data,
          });
        },
        (error) => {
          // 요청 실패 시 에러 처리
          console.error("Error Open ChatRoom:", error);
        }
      );
    }
  };

  //수정
  const handleModifyClick = (id) => {
    navigate(`/modify/${id}`, { state: post.userId });
  };

  // 끌올
  const handlePullupClick = () => {
    pullupPost(post.id),
      (data) => {
        navigate("/mainpost");
      },
      (error) => {
        console.error("Error Pull Up Post: ", error);
      };
  };

  //삭제
  const handleDeleteClick = () => {
    const postId = post.id;

    deletePost(
      postId,
      (data) => {
        const existingRecentCard =
          JSON.parse(localStorage.getItem("recentCard")) || [];
        const updatedRecentCard = existingRecentCard.filter(
          (card) => card.id !== postId
        );
        localStorage.setItem("recentCard", JSON.stringify(updatedRecentCard));
        navigate("/post");
      },
      (error) => {
        console.error("Error Delete Post:", error);
      }
    );
  };
  if (loading) {
    return (
      <Container id="circular">
        <CircularProgress />
      </Container>
    );
  }

  if (post === null) {
    return <PostCaution message={"이미 삭제된 게시글입니다."} />;
  }

  const ownMembers = post?.ownIdolMembers || []; // post가 정의되지 않았거나 ownMembers가 없을 때 빈 배열로 설정
  const targetMembers = post?.findIdolMembers || []; // post가 정의되지 않았거나 targetMembers가 없을 때 빈 배열로 설정

  return (
    <Container className={`card-style${post.bartered ? " done-post" : ""}`}>
      {post.bartered && (
        <div className="overlay">
          <p>교환완료</p>
        </div>
      )}
      <div>
        <Chip
          onClick={() => navigate("/mainpost")}
          id="move-button"
          label="← 목록으로"
          size="medium"
        ></Chip>
        <div id="post-title-container">
          <h2>{post.title}</h2>
        </div>
        <hr />
        <div id="writer-type-container">
          <div>작성자 ✦ {post.nickName}</div>
          <Chip
            id="card-type-container"
            label={post.cardType}
            size="small"
            sx={{ ml: 1 }}
          ></Chip>
        </div>
        <div id="image-list-container">
          <ImageList sx={{ display: "flex", width: "100%" }}>
            {post.photos.map((photo, index) => (
              <ImageListItem key={index}>
                <img
                  onClick={() => handleClickOpen(photo)}
                  src={AmazonSrc + photo}
                  loading="lazy"
                  style={{
                    width: "15vh",
                    height: "23.7vh",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <Dialog onClose={handleClose} open={open} maxWidth={false}>
                  <DialogContent>
                    <img
                      src={AmazonSrc + imageSrc}
                      alt={photo}
                      style={{ maxWidth: "100%", maxHeight: "100vh" }}
                    />
                  </DialogContent>
                </Dialog>
              </ImageListItem>
            ))}
            <img
              src={post.imageUrl}
              loading="lazy"
              style={{
                width: "20vw",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </ImageList>
        </div>

        <div id="post-info-container">
          <div>
            <div>
              <div>
                <div id="post-member-container">
                  {`있어요: ${ownMembers
                    .map((member) => member.name)
                    .join(", ")}`}
                  {" ✦ "}
                  {`구해요: ${targetMembers
                    .map((member) => member.name)
                    .join(", ")}`}
                </div>
              </div>
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ margin: "1rem 0" }} />
        <div id="post-content-container">{post.content}</div>
      </div>

      <div id="post-bottom">
        {isCurrentUserWriter ? (
          <div id="post-button-container">
            <div id="modify-delete">
              <Button
                id="modify-button"
                variant="contained"
                size="large"
                onClick={() => handleModifyClick(post.id)}
              >
                수정
              </Button>

              <Button
                id="delete-button"
                variant="contained"
                size="large"
                onClick={handleDeleteClick}
              >
                삭제
              </Button>
            </div>
            <Button
              id="pullup-button"
              variant="text"
              size="large"
              onClick={handlePullupClick}
            >
              끌어올리기
            </Button>
          </div>
        ) : (
          <div id="post-button-container">
            <Button
              id="chat-button"
              variant="contained"
              size="large"
              onClick={handleChatClick}
            >
              1:1 채팅하기
            </Button>
          </div>
        )}
        <NeedLogin handleModalClose={handleModalClose} modalOpen={modalOpen} />
      </div>
    </Container>
  );
};

export default DetailPost;
