import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Star, UserCircle, Flag } from "lucide-react";
import { AuthContext } from "../../components/Context/AuthContext";
import ReviewReportModal from "../../components/report/ReviewReportModal";
import ReviewLike from "../../components/reviews/ReviewLike";

// 날짜를 한국어 형식으로 변환하는 함수
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

// 별점을 별 아이콘으로 표시하는 컴포넌트
const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

function TravelReviewList({ travelNo, onStatsUpdate, onEdit, onDelete }) {
  const { auth } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]); // 현재 불러온 리뷰 목록
  const [offset, setOffset] = useState(0); // 페이징을 위한 오프셋 값
  const [totalCount, setTotalCount] = useState(0); // 전체 리뷰 개수
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 발생 상태

  // 신고 모달 관련 상태
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportReview, setSelectedReportReview] = useState(null);

  const limit = 3; // 한 번에 불러올 리뷰 개수

  const apiUrl = window.ENV?.API_URL;

  // 리뷰 목록을 서버에서 가져오는 함수
  const fetchReviews = (currentOffset) => {
    if (!travelNo) {
      console.warn("travelNo가 없습니다.");
      return;
    }

    setIsLoading(true); // 로딩 상태 시작
    setError(null); // 이전 에러 상태 초기화

    console.log(
      `리뷰 요청: ${apiUrl}/api/reviews/travel/${travelNo}?offset=${currentOffset}&limit=${limit}`
    );

    // axios GET 요청으로 리뷰 목록 조회
    axios
      .get(
        `${apiUrl}/api/reviews/travel/${travelNo}?offset=${currentOffset}&limit=${limit}`,
        {
          timeout: 10000, // 10초 타임아웃 설정
        }
      )
      .then((response) => {
        console.log("API 응답:", response.data);

        // 응답 데이터에서 필요한 정보 추출
        const responseData = response.data;
        let reviewsData, totalCountData, averageRating;

        if (responseData.data) {
          // RequestData 구조로 래핑된 경우
          const data = responseData.data;
          reviewsData = data.reviews || [];
          totalCountData = data.totalCount || 0;
          averageRating = data.averageRating || 0;
        } else {
          // 직접 데이터가 응답된 경우
          reviewsData = responseData.reviews || [];
          totalCountData = responseData.totalCount || 0;
          averageRating = responseData.averageRating || 0;
        }

        console.log("추출된 데이터:", {
          reviewsData,
          totalCountData,
          averageRating,
        });

        // 리뷰 목록 업데이트
        if (currentOffset === 0) {
          setReviews(reviewsData);
        } else {
          setReviews((prev) => [...prev, ...reviewsData]);
        }

        setTotalCount(totalCountData);
        setOffset(currentOffset + limit);

        // 첫 로드시에만 상위 컴포넌트에 통계 정보 전달
        if (currentOffset === 0 && onStatsUpdate) {
          onStatsUpdate({
            count: totalCountData,
            rating: averageRating,
          });
        }
      })
      .catch((err) => {
        console.error("리뷰 목록 조회 실패:", err);

        // 에러 타입별 메시지 설정
        let errorMessage = "리뷰를 불러오는 중 오류가 발생했습니다.";

        if (err.code === "ECONNABORTED") {
          errorMessage = "요청 시간이 초과되었습니다. 다시 시도해주세요.";
        } else if (err.response) {
          // 서버 응답은 받았지만 에러 상태코드
          const status = err.response.status;
          switch (status) {
            case 404:
              errorMessage = "리뷰 데이터를 찾을 수 없습니다.";
              break;
            case 500:
              errorMessage = "서버 내부 오류가 발생했습니다.";
              break;
            default:
              errorMessage = `서버 오류가 발생했습니다. (${status})`;
          }
        } else if (err.request) {
          // 요청 전송했지만 응답 없음
          errorMessage = "서버에 연결할 수 없습니다. 네트워크를 확인해주세요.";
        }

        setError(errorMessage);
      })
      .finally(() => {
        setIsLoading(false); // 로딩 상태 종료
      });
  };

  // 컴포넌트 마운트 또는 travelNo 변경시 리뷰 목록 로드
  useEffect(() => {
    if (travelNo) {
      // 상태 초기화 후 새로운 데이터 로드
      setReviews([]);
      setOffset(0);
      setTotalCount(0);
      setError(null);

      fetchReviews(0);
    }
  }, [travelNo]);

  // 더보기 버튼 클릭시 추가 리뷰 로드
  const handleLoadMore = () => {
    fetchReviews(offset);
  };

  // 리뷰 신고하기 버튼 클릭 핸들러
  const handleReportClick = (review) => {
    setSelectedReportReview(review); // 신고할 리뷰 정보 저장
    setIsReportModalOpen(true); // 신고 모달 열기
  };

  // 신고 모달 닫기 핸들러
  const handleReportModalClose = () => {
    setIsReportModalOpen(false); // 신고 모달 닫기
    setSelectedReportReview(null); // 선택된 리뷰 정보 초기화
  };

  // 더 불러올 리뷰가 있는지 확인
  const hasMore = reviews.length < totalCount;

  // 에러 발생시 에러 화면 표시
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">⚠️ 오류 발생</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchReviews(0)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 리뷰 목록을 카드 형태로 렌더링 */}
      {reviews.map((review) => (
        <div key={review.reviewNo} className="border-t border-gray-200 pt-6">
          {/* 리뷰 헤더: 작성자 정보와 액션 버튼들 */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <UserCircle className="h-10 w-10 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-800">
                  {review.memberName || "익명"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(review.createdDate)}
                </p>
              </div>
            </div>

            {/* 별점과 신고 버튼 영역 */}
            <div className="flex items-center gap-3">
              <StarRating rating={review.rating || 0} />

              {auth.user?.memberNo !== review.memberNo && (
                <button
                  onClick={() => handleReportClick(review)}
                  className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="리뷰 신고하기"
                >
                  <Flag className="h-4 w-4" />
                  <span className="text-sm">신고</span>
                </button>
              )}
            </div>
          </div>

          {/* 리뷰 콘텐츠 영역 */}
          <div className="mt-4 pl-13 space-y-2">
            <h4 className="font-semibold text-lg">{review.reviewTitle}</h4>
            <p className="text-gray-600 leading-relaxed">
              {review.reviewContent}
            </p>

            {/* 리뷰에 첨부된 이미지들 */}
            {review.imageList && review.imageList.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {review.imageList.map((image) => (
                  <img
                    key={image.imageNo}
                    src={image.imageUrl}
                    alt="리뷰 이미지"
                    className="w-24 h-24 rounded-md object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(image.imageUrl, "_blank")}
                  />
                ))}
              </div>
            )}

            {/* 본인이 작성한 리뷰인 경우 수정/삭제 버튼, 아닌 경우 좋아요 버튼 표시 */}
            <div className="pt-2 flex justify-between items-center">
              {/* 본인 리뷰인 경우 수정/삭제 버튼 */}
              {(() => {
                console.log("인증 사용자 번호:", auth.user?.memberNo);
                console.log("리뷰 작성자 번호:", review.memberNo);
                console.log(
                  "버튼 표시 조건:",
                  auth.user?.memberNo === review.memberNo
                );

                return auth.user?.memberNo === review.memberNo;
              })() && (
                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(review)}
                    className="text-sm text-blue-600 hover:underline transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(review.reviewNo)}
                    className="text-sm text-red-600 hover:underline transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}

              {/* 좋아요 버튼 */}
              <div className="ml-auto">
                <ReviewLike
                  reviewNo={review.reviewNo}
                  isLiked={review.isLiked || false}
                  initialLikeCount={review.likeCount || 0}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 데이터 로딩중 표시 */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-gray-500">리뷰를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 더보기 버튼 (더 불러올 데이터가 있을 때만) */}
      {!isLoading && hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={handleLoadMore}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            더보기 ({reviews.length}/{totalCount})
          </button>
        </div>
      )}

      {/* 리뷰가 없는 경우 안내 메시지 */}
      {!isLoading && reviews.length === 0 && !error && (
        <div className="text-center py-10 text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg mb-2">작성된 리뷰가 없습니다.</p>
          <p>첫 리뷰를 작성해보세요!</p>
        </div>
      )}

      {/* 리뷰 신고 모달 */}
      <ReviewReportModal
        isOpen={isReportModalOpen}
        onClose={handleReportModalClose}
        author={selectedReportReview?.memberName || "익명"}
        postTitle={selectedReportReview?.reviewTitle || ""}
      />
    </div>
  );
}

export default TravelReviewList;
