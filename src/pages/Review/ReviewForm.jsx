import React, { useState, useEffect } from "react";
import StepButton from "../../components/common/MyPlan/StepButton";

const ReviewForm = ({
  travelNo,
  reviewData = null,
  onSubmit,
  onCancel,
  isSubmitting = false, // 제출 중 상태
}) => {
  const [formData, setFormData] = useState({
    reviewTitle: "",
    reviewContent: "",
    rating: 0,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageNos, setDeletedImageNos] = useState([]);
  const [errors, setErrors] = useState({});

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (reviewData) {
      setFormData({
        reviewTitle: reviewData.reviewTitle || "", // 기존 리뷰 제목
        reviewContent: reviewData.reviewContent || "", // 기존 리뷰 내용
        rating: reviewData.rating || 0, // 기존 별점
      });
      setExistingImages(reviewData.imageList || []); // 기존 이미지 목록
    }
  }, [reviewData]);

  // 폼 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // 해당 필드 값 업데이트
    }));

    // 에러 상태 초기화 (입력 시 에러 메시지 제거)
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // 별점 변경
  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating, // 선택된 별점으로 업데이트
    }));
  };

  // 이미지 파일 선택
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length + existingImages.length > 5) {
      alert("이미지는 최대 5개까지만 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 체크 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`${file.name}은 10MB를 초과합니다.`);
        return false;
      }
      return true;
    });

    // 미리보기 URL 생성
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // 새 이미지 삭제
  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // t수정할 때 기존 이미지 삭제
  const handleRemoveExistingImage = (imageNo) => {
    setExistingImages((prev) => prev.filter((img) => img.imageNo !== imageNo));
    setDeletedImageNos((prev) => [...prev, imageNo]);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.reviewTitle.trim()) {
      newErrors.reviewTitle = "리뷰 제목을 입력해주세요.";
    } else if (formData.reviewTitle.length > 100) {
      newErrors.reviewTitle = "리뷰 제목은 100자 이내로 입력해주세요.";
    }

    if (!formData.reviewContent.trim()) {
      newErrors.reviewContent = "리뷰 내용을 입력해주세요.";
    } else if (formData.reviewContent.length > 1000) {
      newErrors.reviewContent = "리뷰 내용은 1000자 이내로 입력해주세요.";
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "별점을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 파일 업로드를 위해 FormData 객체 생성
    const submitData = new FormData();

    // 리뷰 데이터를 JSON으로
    const reviewJson = JSON.stringify({
      ...formData,
      travelNo,
      ...(reviewData && { reviewNo: reviewData.reviewNo }),
    });

    submitData.append(
      "review",
      new Blob([reviewJson], { type: "application/json" })
    );

    imageFiles.forEach((file) => {
      submitData.append("images", file);
    });

    if (deletedImageNos.length > 0) {
      deletedImageNos.forEach((imageNo) => {
        submitData.append("deletedImageNos", imageNo);
      });
    }

    onSubmit(submitData);
  };

  // 별점
  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingChange(i)}
          className={`text-2xl transition-colors ${
            i <= formData.rating ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-400`}
        >
          ⋰˚★
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        {reviewData ? "리뷰 수정" : "리뷰 작성"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 별점 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            별점 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-1">
            {renderStarRating()}
            <span className="ml-2 text-sm text-gray-600">
              ({formData.rating}/5)
            </span>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* 리뷰 제목 */}
        <div>
          <label
            htmlFor="reviewTitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            리뷰 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="reviewTitle"
            name="reviewTitle"
            value={formData.reviewTitle}
            onChange={handleInputChange}
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
              errors.reviewTitle
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="리뷰 제목을 입력해주세요"
          />
          <div className="flex justify-between items-center mt-1">
            {errors.reviewTitle ? (
              <p className="text-sm text-red-600">{errors.reviewTitle}</p>
            ) : (
              <span></span>
            )}
            <span className="text-xs text-gray-500">
              {formData.reviewTitle.length}/100
            </span>
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div>
          <label
            htmlFor="reviewContent"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            리뷰 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reviewContent"
            name="reviewContent"
            value={formData.reviewContent}
            onChange={handleInputChange}
            rows={6}
            maxLength={1000}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${
              errors.reviewContent
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="여행 경험을 자세히 공유해주세요"
          />
          <div className="flex justify-between items-center mt-1">
            {errors.reviewContent ? (
              <p className="text-sm text-red-600">{errors.reviewContent}</p>
            ) : (
              <span></span>
            )}
            <span className="text-xs text-gray-500">
              {formData.reviewContent.length}/1000
            </span>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 업로드 (최대 5개)
          </label>

          {/* 기존 이미지들 (수정 시) */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">기존 이미지</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {existingImages.map((image) => (
                  <div key={image.imageNo} className="relative">
                    <img
                      src={image.imageUrl}
                      alt="기존 이미지"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image.imageNo)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 이미지 미리보기 */}
          {imagePreviewUrls.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">새 이미지</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`미리보기 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 이미지 선택 버튼 */}
          {imageFiles.length + existingImages.length < 5 && (
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              이미지 선택
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}

          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG, GIF 파일만 가능하며, 각 파일은 10MB 이하여야 합니다.
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3 pt-4">
          <StepButton
            type="prev" // step.jsx에서 import
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="min-w-[120px] px-6"
          >
            취소
          </StepButton>

          <StepButton
            type="next" // step.jsx에서 import
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSubmitting) {
                handleSubmit(e);
              }
            }}
            className="min-w-[120px] px-6"
          >
            <div className="flex items-center gap-2">
              {/* 제출 중일 때 로딩 스피너 표시 */}
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {/* 버튼 텍스트 */}
              {isSubmitting ? "저장 중" : reviewData ? "수정하기" : "작성하기"}
            </div>
          </StepButton>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm; // 기본 내보내기 추가
