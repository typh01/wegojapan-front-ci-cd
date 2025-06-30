import React, { useState, useEffect } from "react";
import StatusButton from "../../components/common/MyPlan/StatusButton";
import Pagination from "../../components/common/Page/Pagination";

const MyTravelPlanList = () => {
  // 현재 선택된 필터 상태(전체 || 예정 || 완료)
  const [selectedFilter, setSelectedFilter] = useState("전체");

  // 사용자가 입력한 검색 키워드 상태 관리
  const [searchKeyword, setSearchKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const listPerPage = 3;

  // 여행 플랜 더미데이터
  const [travelPlans] = useState([
    {
      id: 1, // 플랜 고유 ID
      title: "키타구 3박4일 여행",
      status: "예정",
      region: "오사카 키타구",
      startDate: "2025년 7월 17일",
      endDate: "2025년 7월 21일",
      travelers: "4명",
      createdDate: "2025년 6월 19일",
    },
    {
      id: 2,
      title: "남자친구와 키타구 3박4일 여행",
      status: "완료",
      region: "오사카 키타구",
      startDate: "2025년 7월 17일",
      endDate: "2025년 7월 21일",
      travelers: "2명",
      createdDate: "2025년 6월 19일",
    },
    {
      id: 3,
      title: "가족여행 오사카 5박6일",
      status: "예정",
      region: "오사카 키타구",
      startDate: "2025년 8월 15일",
      endDate: "2025년 8월 20일",
      travelers: "5명",
      createdDate: "2025년 6월 20일",
    },
    {
      id: 4,
      title: "신혼여행 오사카",
      status: "완료",
      region: "오사카 니시구",
      startDate: "2025년 5월 1일",
      endDate: "2025년 5월 5일",
      travelers: "2명",
      createdDate: "2025년 4월 10일",
    },
    // Array.from을 사용해 추가 더미 데이터 16개 생성
    ...Array.from({ length: 16 }, (_, index) => ({
      id: index + 5, // ID를 5부터 시작해서 중복 방지
      title: `오사카 여행 플랜 ${index + 5}`, // 동적으로 제목 생성
      status: index % 2 === 0 ? "예정" : "완료", // 짝수 인덱스는 예정, 홀수는 완료
      region: `오사카 ${["중앙구", "키타구", "니시구", "미나토구"][index % 4]}`, // 배열에서 순환하며 지역 선택
      startDate: `2025년 ${7 + (index % 3)}월 ${10 + index}일`, // 동적으로 날짜 생성
      endDate: `2025년 ${7 + (index % 3)}월 ${15 + index}일`, // 시작일에서 5일 후로 설정
      travelers: `${(index % 4) + 1}명`, // 1~4명 사이로 인원 설정
      createdDate: `2025년 6월 ${(index % 28) + 1}일`, // 6월 1~28일 사이로 생성일 설정
    })),
  ]);

  // 필터링된 여행 플랜 목록을 계산
  const filteredPlans = travelPlans.filter((plan) => {
    // 상태 필터링
    const statusFilter =
      selectedFilter === "전체" || plan.status === selectedFilter;

    // 검색어 필터링
    const searchFilter =
      !searchKeyword || // 검색어가 비어있으면 모든 항목 통과
      plan.title.toLowerCase().includes(searchKeyword.toLowerCase()) || // 제목 대소문자 구분 없이 검색
      plan.region.toLowerCase().includes(searchKeyword.toLowerCase()); // 지역 대소문자 구분 없이 검색

    // 상태 필터와 검색 필터를 모두 만족하는 항목만 반환
    return statusFilter && searchFilter;
  });

  // 페이지네이션을 계산
  const totalPages = Math.ceil(filteredPlans.length / listPerPage);
  const startIndex = (currentPage - 1) * listPerPage;
  const endIndex = startIndex + listPerPage;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  }, [selectedFilter, searchKeyword]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePlanClick = (planId) => {
    // TODO: 여행 플랜 상세 페이지로 이동!!!!!!
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-50">
      <div
        className="w-full max-w-[1400px] bg-white"
        style={{
          borderRadius: "20px",
          boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.10)",
        }}
      >
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            나의 여행 플랜
          </h1>
          <p className="text-sm text-gray-500">
            총 {filteredPlans.length}개의 여행플랜이 있습니다.
          </p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              {/* 검색 아이콘 */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="플랜 제목이나 지역명으로 검색"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 필터 버튼들 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedFilter("전체")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "전체"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              전체
            </button>

            <button
              onClick={() => setSelectedFilter("예정")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "예정"
                  ? "bg-teal-100 text-teal-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              예정
            </button>

            <button
              onClick={() => setSelectedFilter("완료")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "완료"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              완료
            </button>
          </div>
        </div>

        {/* 여행 플랜 목록 */}
        <div className="divide-y divide-gray-100">
          {currentPlans.length > 0 ? (
            currentPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanClick(plan.id)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-base font-medium text-gray-900">
                        {plan.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          plan.status === "예정"
                            ? "bg-[#00A79F] text-white"
                            : "bg-[#9FA1A8] text-white"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* 지역 정보 */}
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-4 h-4 mr-2 text-gray-400">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <span>{plan.region}</span>
                      </div>

                      {/* 여행 기간 */}
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-4 h-4 mr-2 text-gray-400">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span>
                          여행일: {plan.startDate} ~ {plan.endDate}
                        </span>
                      </div>

                      {/* 여행 인원 */}
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-4 h-4 mr-2 text-gray-400">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <span>여행인원: {plan.travelers}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      만든날: {plan.createdDate}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // 검색 결과 없음 메시지
            <div className="text-center py-16">
              <div className="text-gray-400 text-base mb-2">
                검색 결과가 없습니다
              </div>
              <div className="text-gray-500 text-sm">
                다른 검색어로 시도해보세요
              </div>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center py-6 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxVisiblePages={5}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default MyTravelPlanList;
