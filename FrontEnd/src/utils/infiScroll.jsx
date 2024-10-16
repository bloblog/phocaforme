import { useEffect, useState } from "react";
import { getPostInfi } from "../api/post";

const usePostSearch = (pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true); // 데이터를 가져오기 전에 로딩 상태로 변경
    getPostInfi(
      pageNumber,
      (data) => {
        if (pageNumber == 2) {
          setBoards(data.data);
        } else {
          setBoards((prevBoards) => {
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
};

export default usePostSearch;
