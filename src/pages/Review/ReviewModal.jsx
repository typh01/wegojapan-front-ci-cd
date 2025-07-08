import React from "react";

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">리뷰 내용</h2>
        <p className="mb-2">
          <strong>작성자:</strong> {review.memberName}
        </p>
        <p className="mb-2">
          <strong>별점:</strong> {review.rating}점
        </p>
        <p className="mb-2">
          <strong>리뷰 제목:</strong> {review.reviewTitle}
        </p>
        <p className="mb-2">
          <strong>리뷰 내용:</strong>
        </p>
        <p className="whitespace-pre-line">{review.reviewContent}</p>
      </div>
    </div>
  );
};

export default ReviewModal;
