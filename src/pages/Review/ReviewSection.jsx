import { useState, useContext } from "react";
import { Star, MessageSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/Context/AuthContext";
import axios from "axios";

import TravelReviewList from "../Review/TravelReviewList";
import ReviewForm from "../Review/ReviewForm";
import StepButton from "../../components/common/MyPlan/StepButton";

function ReviewSection({ travelNo, onStatsUpdate }) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // 상태 관리
  const [reviewStats, setReviewStats] = useState({ count: 0, rating: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const apiUrl = window.ENV?.API_URL;

  // 리뷰 통계 업데이트
  const handleStatsUpdate = (stats) => {
    setReviewStats(stats);
    if (onStatsUpdate) {
      onStatsUpdate(stats);
    }
  };

  // 인증 토큰 가져오기
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

  // 리뷰 작성 버튼 클릭
  const handleWriteReview = () => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setEditingReview(null);
    setShowReviewForm(true);

    // 리뷰 섹션으로 스크롤 이동
    setTimeout(() => {
      const reviewSection = document.getElementById("review-section");
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  // 리뷰 수정 시작
  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);

    // 리뷰 섹션으로 스크롤 이동
    setTimeout(() => {
      const reviewSection = document.getElementById("review-section");
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  const handleReviewSubmit = (formData) => {
    setIsSubmittingReview(true);

    const token = getAuthToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      setIsSubmittingReview(false);
      return;
    }

    const url = editingReview
      ? `${apiUrl}/api/reviews/${editingReview.reviewNo}`
      : `${apiUrl}/api/reviews`;
    const method = editingReview ? "PUT" : "POST";

    axios({
      method: method,
      url: url,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setShowReviewForm(false); // 리뷰 폼 숨김 처리
        setEditingReview(null); // 수정 모드 해제

        window.location.reload(); // 전체 페이지 새로고침으로 최신 데이터 반영
      })
      .catch((err) => {
        console.error("리뷰 저장 실패:", err);

        if (err.response) {
          if (err.response.status === 403) {
            alert("이 리뷰를 수정할 권한이 없습니다.");
            return;
          }
          alert(err.response.data.message || "리뷰 저장에 실패했습니다.");
        }
      })
      .finally(() => {
        setIsSubmittingReview(false); // 제출 완료 상태로 변경
      });
  };

  // 리뷰 폼 취소 핸들러
  const handleCancelReview = () => {
    setShowReviewForm(false); // 리뷰 폼 숨김
    setEditingReview(null); // 수정 모드 해제
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = (reviewNo) => {
    if (!confirm("정말로 이 리뷰를 삭제하시겠습니까?")) return;

    const token = getAuthToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .delete(`${apiUrl}/api/reviews/${reviewNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert("리뷰가 삭제되었습니다.");
        window.location.reload();
      })
      .catch((err) => {
        console.error("리뷰 삭제 실패:", err);

        if (err.response) {
          if (err.response.status === 403) {
            alert("이 리뷰를 삭제할 권한이 없습니다.");
            return;
          }
          alert(err.response.data.message || "리뷰 삭제에 실패했습니다.");
        }
      });
  };

  return (
    <div
      id="review-section"
      className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8"
    >
      <div className="p-6">
        {/* 리뷰 섹션 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            리뷰 ({reviewStats.count.toLocaleString()})
          </h3>

          <StepButton
            type="next"
            onClick={handleWriteReview}
            className="min-w-[150px] w-auto px-8 whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              리뷰작성하기
            </div>
          </StepButton>
        </div>

        {/* 평균 별점 표시 */}
        {reviewStats.count > 0 && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold">
                {reviewStats.rating > 0 ? reviewStats.rating.toFixed(1) : "0.0"}
              </span>
            </div>
            <span className="text-gray-600">
              평균 별점 (총 {reviewStats.count.toLocaleString()}개 리뷰)
            </span>
          </div>
        )}

        {/* 리뷰 작성/수정 폼 */}
        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm
              travelNo={travelNo}
              reviewData={editingReview} // 수정할 리뷰 데이터 (수정시에만)
              onSubmit={handleReviewSubmit}
              onCancel={handleCancelReview}
              isSubmitting={isSubmittingReview}
            />
          </div>
        )}

        {/* 리뷰 목록 */}
        <TravelReviewList
          travelNo={travelNo}
          onStatsUpdate={handleStatsUpdate}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
        />
      </div>
    </div>
  );
}

export default ReviewSection;
