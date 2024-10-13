import { useEffect, useState } from "react";
import { getPostInfi } from "../api/post";

export default function usePostSearch(pageNumber) {
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true); // 데이터를 가져오기 전에 로딩 상태로 변경

    getPostInfi(
      pageNumber,
      (data) => {
        console.log(data.data);

        if (pageNumber === 2) {
          setBoards(data.data);
        } else {
          // 그 외의 경우 기존 데이터에 새로운 데이터 추가
          setBoards((prevBoards) => {
            // 중복 방지를 위해 고유한 게시글만 추가
            // const newPosts = data.data.filter(
            //   (newPost) =>
            //     !prevBoards.some((prevPost) => prevPost.id === newPost.id)
            // );
            return [...prevBoards, ...data.data];
          });
        }

        setLoading(false);
        setHasMore(data.data.length > 0);
      },
      (err) => {
        console.error("Error Get Post (infi): ", err);
        setLoading(false);
      }
    );
  }, [pageNumber]);

  return { boards, hasMore, loading };
}
