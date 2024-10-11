import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

import PostCaution from "./PostCaution";

import {
  Container,
  ImageList,
  ImageListItem,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import { openChatRoom } from "../../api/chat";
import { deletePost, getPost, pullupPost } from "../../api/post";

const DetailPost = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  // 일단 주석
  // const posts = useSelector((state) => (state.post ? state.post.posts : [])); //이건 필요 없을 듯?
  // const post = posts.find((p) => p.id === id); // 얘도 필요 없을 거 같은데
  const [post, setPost] = useState(null);

  // 디테일 페이지에 진입했을 떄 로컬스토리지에 저장
  const saveToLocalStorage = () => {
    if (post && post.id) {
      const existingRecentCard =
        JSON.parse(localStorage.getItem("recentCard")) || [];
      const cardInfo = {
        id: post.id,
        title: post.title,
        images: post.photos,
        ownMembers: post.ownIdolMembers,
        targetMembers: post.findIdolMembers,
        isBartered: post.bartered,
        // type: post.cardType.value
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
        if (post) {
          saveToLocalStorage();
        }
      },
      (error) => {
        console.error("Error fetching post:", error);
      }
    );
  }, []);

  // 내 게시글인지 판별
  const currentUser = useSelector((state) => state.user.user);
  const isCurrentUserWriter =
    post && currentUser && currentUser.userId === post.userId;

  const handleChatClick = () => {
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
  };

  //수정
  const handleModifyClick = (id) => {
    console.log(id);
    navigate(`/modify/${id}`, { state: post });
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
        navigate(-1);
      },
      (error) => {
        console.error("Error Delete Post:", error);
      }
    );
  };

  if (post === null) {
    return <PostCaution message={"이미 삭제된 게시글입니다."} />; // 데이터가 로드되기 전에는 로딩 중을 표시
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
      {/* {post.isSold && (
        <div className="overlay">
          <p>판매완료</p>
        </div>
      )} */}
      <div>
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
                  src={`https://photocardforme.s3.ap-northeast-2.amazonaws.com/${photo}`}
                  loading="lazy"
                  style={{
                    width: "15vh",
                    height: "23.7vh",
                    objectFit: "contain",
                    borderRadius: "10px",
                    backgroundColor: "lightgray",
                  }}
                />
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
            {/* {post.type == "교환" ? ( */}
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
            {/* ) : ( */}
            {/* <div>
                <div>
                  {`멤버: ${post.ownMembers
                    .map((member) => member.value)
                    .join(", ")}`}
                </div>
              </div>
            )} */}
          </div>
        </div>
        <hr style={{ margin: "1rem 0" }} />
        <div id="post-content-container" style={{}}>
          <div>{post.content}</div>
        </div>
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
      </div>
    </Container>
  );
};

export default DetailPost;
