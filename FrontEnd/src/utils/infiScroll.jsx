import { useEffect, useState } from "react";
import axios from "axios";

export default function usePostSearch(pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [boards, setBoards] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBoards([]);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url:
        import.meta.env.REACT_APP_API_URL + `barter/search?page=${pageNumber}`,
      // params: {page: pageNumber },
      withCredentials: true,
      params: { page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        console.log(res.data);
        console.log(pageNumber); //<-
        setBoards((prevBoards) => {
          // Concatenate the new data with the previous boards
          return [...prevBoards, ...res.data];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [pageNumber]);

  return { loading, error, boards, hasMore };
}
