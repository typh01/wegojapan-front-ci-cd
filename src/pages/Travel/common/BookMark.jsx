import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/Context/AuthContext";

const BookMark = ({ travelNo, memberNo, isBookmarked }) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { auth } = useContext(AuthContext);
  const isDisabled = !auth?.isAuthenticated;
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const handleAdd = () => {
    axios
      .post(`${apiUrl}/api/bookMark/insert-book`, {
        travelNo: travelNo,
        memberNo: memberNo,
      })
      .then((response) => {
        console.log(response);
        setBookmarked(true);
        alert("즐겨찾기 추가됨");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`${apiUrl}/api/bookMark/delete-book`, {
        travelNo: travelNo,
        memberNo: memberNo,
      })
      .then((response) => {
        console.log(response);
        setBookmarked(false);
        alert("즐겨찾기 취소됨");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBookmark = () => {
    if (bookmarked) {
      handleDelete();
    } else {
      handleAdd();
    }
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
