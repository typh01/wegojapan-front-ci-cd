import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/Context/AuthContext";

const BookMark = ({ travelNo, isBookmarked }) => {
  const { auth } = useContext(AuthContext);
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const memberNo = auth?.loginInfo?.memberNo;
  const accessToken = auth?.tokens?.accessToken;
  const isDisabled = !auth?.isAuthenticated || !memberNo;

  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  useEffect(() => {}, [travelNo, memberNo]);

  const handleAdd = () => {
    if (!accessToken) {
      return;
    }

    axios
      .post(
        `${apiUrl}/api/bookMark/insert-book`,
        { travelNo, memberNo },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((response) => {
        console.log(response);
        setBookmarked(true);
        alert("즐겨찾기에 추가되었습니다.");
      })
      .catch((error) => {
        console.error(error);
        alert("즐겨찾기 추가에 실패했습니다.");
      });
  };

  const handleDelete = () => {
    if (!accessToken) {
      return;
    }

    axios
      .delete(`${apiUrl}/api/bookMark/delete-book`, {
        data: { travelNo, memberNo },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);
        setBookmarked(false);
        alert("즐겨찾기에서 제거되었습니다.");
      })
      .catch((error) => {
        console.error(error);
        alert("즐겨찾기 삭제에 실패했습니다.");
      });
  };

  const handleBookmark = () => {
    if (isDisabled) {
      alert("로그인이 필요합니다.");
      return;
    }

    bookmarked ? handleDelete() : handleAdd();
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={isDisabled}
      className={`text-2xl hover:scale-110 transition ${
        bookmarked ? "text-red-500" : "text-gray-300"
      }`}
      title={bookmarked ? "즐겨찾기 취소" : "즐겨찾기 추가"}
    >
      🔖
    </button>
  );
};

export default BookMark;
