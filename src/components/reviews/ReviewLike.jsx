import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ThumbsUp } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";

const ReviewLike = ({ reviewNo, isLiked, initialLikeCount = 0 }) => {
  const { auth } = useContext(AuthContext);
  const apiUrl = window.ENV?.API_URL;

  // 안전하게 memberNo 가져오기
  const memberNo = auth?.user?.memberNo || auth?.loginInfo?.memberNo || null;
  // 안전하게 accessToken 가져오기
  const accessToken = auth?.tokens?.accessToken || auth?.tokens?.token || null;

  const isDisabled = !auth?.isAuthenticated || !memberNo || !accessToken;

  const [liked, setLiked] = useState(Boolean(isLiked));
  const [likeCount, setLikeCount] = useState(Number(initialLikeCount) || 0);

  useEffect(() => {
    setLiked(Boolean(isLiked));
  }, [isLiked]);

  useEffect(() => {
    setLikeCount(Number(initialLikeCount) || 0);
  }, [initialLikeCount]);

  const handleAddLike = () => {
    if (!accessToken || !memberNo || !reviewNo) {
      console.warn("필수 정보 누락:", {
        accessToken: !!accessToken,
        memberNo,
        reviewNo,
      });
      return;
    }

    setLiked(true);
    setLikeCount((prev) => Math.max(0, prev + 1));

    axios
      .post(
        `${apiUrl}/api/reviews/insert-like`,
        {
          reviewNo: String(reviewNo),
          memberNo: String(memberNo),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          timeout: 0,
        }
      )
      .then((response) => {
        console.log("좋아요 추가 성공:", response.data);
      })
      .catch((error) => {
        console.error("좋아요 추가 실패:", error);

        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1)); // 음수 방지

        // 400 에러 (이미 좋아요를 누른 경우) 처리
        if (error.response?.status === 400) {
          setLiked(true);
          setLikeCount((prev) => prev + 1);
        }
      });
  };

  // 좋아요 취소
  const handleDeleteLike = () => {
    if (!accessToken || !memberNo || !reviewNo) {
      console.warn("필수 정보 누락:", {
        accessToken: !!accessToken,
        memberNo,
        reviewNo,
      });
      return;
    }

    setLiked(false);
    setLikeCount((prev) => Math.max(0, prev - 1));
    axios
      .delete(`${apiUrl}/api/reviews/delete-like`, {
        data: {
          reviewNo: String(reviewNo),
          memberNo: String(memberNo),
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 0,
      })
      .then((response) => {
        console.log("좋아요 취소 성공 :", response.data);
      })
      .catch((error) => {
        console.error("좋아요 취소 실패 :", error);

        setLiked(true);
        setLikeCount((prev) => prev + 1);

        // 400 에러 (이미 좋아요를 취소한 경우) 처리
        if (error.response?.status === 400) {
          setLiked(false);
          setLikeCount((prev) => Math.max(0, prev - 1));
        }
      });
  };

  // 좋아요 토글
  const handleLikeToggle = () => {
    if (isDisabled) {
      console.log("좋아요 비활성화됨 :", {
        isAuthenticated: auth?.isAuthenticated,
        memberNo,
        accessToken: !!accessToken,
      });
      return;
    }

    liked ? handleDeleteLike() : handleAddLike();
  };

  // reviewNo가 없으면 렌더링하지 않음
  if (!reviewNo) {
    return null;
  }

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isDisabled}
      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:scale-105 transition-all ${
        liked
          ? "text-blue-500 bg-blue-50 hover:bg-blue-100"
          : "text-gray-500 hover:text-blue-500 hover:bg-gray-50"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={liked ? "좋아요 취소" : "좋아요 추가"}
    >
      <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  );
};

export default ReviewLike;
