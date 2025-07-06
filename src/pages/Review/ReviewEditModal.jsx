import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/Context/AuthContext";
import ReviewForm from "./ReviewForm";
import axios from "axios";

const ReviewEditModal = ({ isOpen, onClose, reviewData, onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { auth } = useContext(AuthContext);

  const API_BASE_URL = window.ENV?.API_URL + "/api";

  const getAuthToken = () => {
    if (auth.isAuthenticated && auth.tokens) {
      return (
        auth.tokens.token ||
        auth.tokens.accessToken ||
        auth.tokens.authToken ||
        auth.tokens.jwt
      );
    }
    return null;
  };

  const handleSubmit = (formData) => {
    setIsSubmitting(true);

    const token = getAuthToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      setIsSubmitting(false);
      return;
    }

    axios
      .put(`${API_BASE_URL}/reviews/${reviewData.reviewNo}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const result = response.data;

        if (onSubmitSuccess) {
          onSubmitSuccess(result);
        }

        onClose(); // 모달 닫기
      })
      .catch((error) => {
        console.error("리뷰 수정 실패:", error);

        if (error.response) {
          alert(error.response.data.message || "리뷰 수정에 실패했습니다.");
        }
      })
      .finally(() => {
        setIsSubmitting(false); // 제출 완료 상태로 변경
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 모달 헤더 영역 */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">리뷰 수정</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting} // 제출중일 때 닫기 버튼 비활성화
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 리뷰 수정 폼 영역 */}
        <div className="p-6">
          <ReviewForm
            travelNo={reviewData.travelNo}
            reviewData={reviewData}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewEditModal;
