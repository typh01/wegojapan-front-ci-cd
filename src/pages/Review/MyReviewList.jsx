import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/Context/AuthContext";
import ReviewEditModal from "./ReviewEditModal";
import StepButton from "../../components/common/MyPlan/StepButton";
import axios from "axios";

const MyReviewList = ({ onEditReview, onDeleteReview }) => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [myReviews, setMyReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // 현재 보여지는 리뷰 개수

  // 삭제 확인 모달 상태
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    reviewNo: null,
  });

  // 수정 모달 상태
  const [editModal, setEditModal] = useState({
    show: false,
    reviewData: null,
  });

  const API_BASE_URL = window.ENV?.API_URL + "/api";
  const limit = 3; // 한 번에 더 보여줄 리뷰 개수

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

  const fetchMyReviews = () => {
    setLoading(true);
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError("인증 토큰이 없습니다.");
      setLoading(false);
      return Promise.reject(new Error("인증 토큰이 없습니다."));
    }

    return axios
      .get(`${API_BASE_URL}/reviews/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        let reviewsData = [];
        if (data && data.data) {
          if (Array.isArray(data.data)) {
            reviewsData = data.data;
          } else if (data.data.reviews && Array.isArray(data.data.reviews)) {
            reviewsData = data.data.reviews;
          }
        } else if (Array.isArray(data)) {
          reviewsData = data;
        }

        setAllReviews(reviewsData);
        setVisibleCount(3); // 처음에는 3개만 보여주기

        return data;
      })
      .catch((err) => {
        setError(err.message || "리뷰를 불러오는데 실패했습니다.");
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + limit); // step.jsx
  };

  // 더 불러올 리뷰가 있는지 확인
  const hasMore = visibleCount < allReviews.length;

  // 여행지 상세 페이지로 이동
  const handleTravelClick = (travelNo) => {
    if (travelNo) {
      navigate(`/travels/detail/${travelNo}`);
    } else {
      alert("여행지 정보를 찾을 수 없습니다.");
    }
  };

  // 리뷰 수정 ㅇ려기
  const openEditModal = (reviewData) => {
    setEditModal({ show: true, reviewData });
  };

  // 리뷰 수정 모달 닫기
  const closeEditModal = () => {
    setEditModal({ show: false, reviewData: null });
  };

  // 리뷰 수정 성공
  const handleEditSuccess = (updatedReview) => {
    fetchMyReviews()
      .then(() => {
        if (onEditReview) {
          onEditReview(updatedReview);
        }
      })
      .catch((error) => {
        console.error("리뷰 목록 새로고침 실패:", error);
        window.location.reload();
      });
  };

  // 리뷰 삭제 확인 열기
  const openDeleteModal = (reviewNo) => {
    setDeleteModal({ show: true, reviewNo });
  };

  // 리뷰 삭제 확인 모달 닫기
  const closeDeleteModal = () => {
    setDeleteModal({ show: false, reviewNo: null });
  };

  // 리뷰 삭제 처리
  const handleDeleteConfirm = () => {
    const token = getAuthToken();
    if (!token) {
      alert("인증 토큰이 없습니다. 다시 로그인해주세요.");
      return;
    }

    axios
      .delete(`${API_BASE_URL}/reviews/${deleteModal.reviewNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // 삭제 성공시 전체 리뷰 목록에서 해당 리뷰 제거
        setAllReviews((prev) =>
          prev.filter((review) => review.reviewNo !== deleteModal.reviewNo)
        );

        if (onDeleteReview) {
          onDeleteReview(deleteModal.reviewNo);
        }

        alert("리뷰가 삭제되었습니다.");
        closeDeleteModal();
      })
      .catch((err) => {
        console.error("리뷰 삭제 실패:", err);
        alert(err.message || "리뷰 삭제에 실패했습니다.");
      });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ⋰˚★
        </span>
      );
    }
    return stars;
  };

  // 날짜를 한국어 형식으로 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 내 리뷰 목록 불러오기
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchMyReviews();
    }
  }, [auth.isAuthenticated]);

  // 전체 리뷰 목록이 변경되거나 보여줄 개수가 변경될 때 화면 업데이트
  useEffect(() => {
    const displayReviews = allReviews.slice(0, visibleCount);

    setMyReviews(displayReviews);
  }, [allReviews, visibleCount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">내 리뷰를 불러오는 중...</span>
      </div>
    );
  }

  // 에러 발생시 화면
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchMyReviews}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          내가 작성한 리뷰 ({allReviews.length}개)
        </h2>
      </div>

      {/* 리뷰가 없을 때 표시 */}
      {myReviews.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl text-gray-600 mb-2">
            작성한 리뷰가 없습니다.
          </h3>
          <p className="text-gray-500">여행 후기를 공유해보세요!</p>
        </div>
      ) : (
        /* 내 리뷰 목록 표시 */
        <div className="grid gap-6">
          {myReviews.map((review) => (
            <div
              key={review.reviewNo}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 리뷰 헤더 영역 */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {/* 여행지명을 클릭 가능한 버튼으로 표시 */}
                    <button
                      onClick={() => handleTravelClick(review.travelNo)}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                      title="여행지 상세 페이지로 이동"
                    >
                      {review.travelName}
                    </button>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      여행지
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-700 mb-1">
                    {review.reviewTitle}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-1">({review.rating}/5)</span>
                    </div>
                    <span>{formatDate(review.createdDate)}</span>
                  </div>
                </div>

                {/* 수정/삭제 액션 버튼들 */}
                <div className="flex items-center space-x-2">
                  {/* 수정 버튼 - 모달 열기 */}
                  <button
                    onClick={() => openEditModal(review)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="수정"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => openDeleteModal(review.reviewNo)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 리뷰 본문 내용 */}
              <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                {review.reviewContent}
              </p>

              {/* 리뷰에 첨부된 이미지들 */}
              {review.imageList && review.imageList.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {review.imageList.slice(0, 6).map((image, index) => (
                    <div key={image.imageNo} className="relative aspect-square">
                      <img
                        src={image.imageUrl}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(image.imageUrl, "_blank")}
                      />
                      {/* 6개 이상 이미지가 있을 때 추가 개수 표시 */}
                      {index === 5 && review.imageList.length > 6 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <span className="text-white font-semibold">
                            +{review.imageList.length - 6}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {!loading && hasMore && (
        <div className="flex justify-center pt-4">
          <StepButton
            type="next"
            onClick={handleLoadMore}
            className="inline-block text-lg font-semibold px-0 py-2 leading-tight"
          >
            <span className="block w-full text-center">
              더보기 ({myReviews.length}/{allReviews.length})
            </span>
          </StepButton>
        </div>
      )}

      {/* 리뷰 수정 모달 */}
      <ReviewEditModal
        isOpen={editModal.show}
        onClose={closeEditModal}
        reviewData={editModal.reviewData}
        onSubmitSuccess={handleEditSuccess}
      />

      {/* 삭제 확인 모달 */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              리뷰 삭제
            </h3>
            <p className="text-gray-600 mb-6">
              정말로 이 리뷰를 삭제하시겠습니까?
              <br />
              삭제된 리뷰는 복구할 수 없습니다.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewList;
