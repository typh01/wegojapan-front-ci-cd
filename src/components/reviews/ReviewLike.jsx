import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/Context/AuthContext";

const ReviewLike = ({ reviewNo, isLiked }) => {
  const { auth } = useContext(AuthContext);
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const memberNo = auth?.loginInfo?.memberNo;
  const accessToken = auth?.tokens?.accessToken;
  const isDisabled = !auth?.isAuthenticated || !memberNo;

  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleAddLike = () => {
    if (!accessToken) return;

    axios
      .post(
        `${apiUrl}/api/reviewLike/insert-like`,
        { reviewNo, memberNo },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((response) => {
        console.log(response);
        setLiked(true);
        alert("좋아요를 눌렀습니다.");
      })
      .catch((error) => {
        console.error(error);
        alert("좋아요 추가에 실패했습니다.");
      });
  };

  const handleDeleteLike = () => {
    if (!accessToken) return;

    axios
      .delete(`${apiUrl}/api/reviewLike/delete-like`, {
        data: { reviewNo, memberNo },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);
        setLiked(false);
        alert("좋아요를 취소했습니다.");
      })
      .catch((error) => {
        console.error(error);
        alert("좋아요 취소에 실패했습니다.");
      });
  };

  const handleLikeToggle = () => {
    if (isDisabled) {
      alert("로그인이 필요합니다.");
      return;
    }

    liked ? handleDeleteLike() : handleAddLike();
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isDisabled}
      className={`text-2xl hover:scale-110 transition ${
        liked ? "text-blue-500" : "text-gray-300"
      }`}
      title={liked ? "좋아요 취소" : "좋아요 추가"}
    >
      👍
    </button>
  );
};

export default ReviewLike;
