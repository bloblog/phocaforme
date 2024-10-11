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

const DetailPost = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  // 일단 주석
  // const posts = useSelector((state) => (state.post ? state.post.posts : [])); //이건 필요 없을 듯?
  // const post = posts.find((p) => p.id === id); // 얘도 필요 없을 거 같은데
  const [post, setPost] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_API_URL + `barter/${id}`,
        { withCredentials: true }
      );
      const detailData = response.data;
      setPost(detailData);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };
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
    fetchData();
  }, [id]);

  useEffect(() => {
    if (post) {
      saveToLocalStorage();
    }
  }, [post]);

  console.log(post); // 현재 이 컴포넌트가 4번 렌더링됨 이유는 모르겠음 나중에 여유있으면 수정해야 할듯?
  // 내 게시글인지 판별
  const currentUser = useSelector((state) => state.user.user);
  const isCurrentUserWriter =
    post && currentUser && currentUser.userId === post.userId;

  const handleChatClick = () => {
    // 채팅방 생성
    openChatRoom(
      id,
      (data) => {
        console.log(data);
        // const chatRoomInfo = data.data;
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
  const handlePullupClick = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_API_URL + `barter/regen/${post.id}`,
        null,
        {
          withCredentials: true,
        }
      );

      // 성공적으로 업데이트되었을 때의 처리
      console.log("게시글이 성공적으로 끌어올려졌습니다.");
      navigate("/mainpost");
    } catch (error) {
      // 오류 처리
      console.error("게시글 끌어올리기에 실패했습니다:", error);
    }
  };

  //삭제
  const handleDeleteClick = () => {
    const postId = post.id;

    axios
      .delete(import.meta.env.VITE_APP_API_URL + `barter/${postId}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("게시물이 성공적으로 삭제되었습니다.");
        const existingRecentCard =
          JSON.parse(localStorage.getItem("recentCard")) || [];
        const updatedRecentCard = existingRecentCard.filter(
          (card) => card.id !== postId
        );
        localStorage.setItem("recentCard", JSON.stringify(updatedRecentCard));
      })
      .catch((error) => {
        console.error("게시물 삭제 중 에러가 발생했습니다:", error);
      });
    navigate(-1);
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
