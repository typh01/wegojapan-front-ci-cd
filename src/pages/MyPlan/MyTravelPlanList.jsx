import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Page/Pagination";
import { AuthContext } from "../../components/Context/AuthContext";
import axios from "axios";

const API_BASE_URL = window.ENV?.API_URL + "/api";

const MyTravelPlanList = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const listPerPage = 3; // 페이지당 표시할 항목 수

  const getAuthToken = useCallback(() => {
    // 인증이 완료되고 토큰이 존재하는지 확인
    if (auth?.isAuthenticated && auth?.tokens) {
      const token =
        auth.tokens.accessToken || // 액세스 토큰
        auth.tokens.authToken || // 인증 토큰
        auth.tokens.jwt; // JWT 토큰
      return token;
    }
    return null;
  }, [auth?.isAuthenticated, auth?.tokens]);

  // 나의 여행 플랜 목록  가져옴
  const getMyTravelPlans = useCallback(
    (page, filter, keyword) => {
      const token = getAuthToken();

      // 토큰이 없으면 로그아웃
      if (!token) {
        alert("인증 정보가 없습니다. 다시 로그인 해주세요.");
        logout();
        return;
      }

      const statusFilter = filter === "전체" ? "" : filter;

      axios
        .get(`${API_BASE_URL}/my-plans`, {
          params: {
            page,
            size: listPerPage, // 페이지당 항목 수
            status: statusFilter,
            searchKeyword: keyword || "",
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 15000, // 15초
          withCredentials: true,
        })
        .then((response) => {
          const responseData = response.data?.data;

          if (response.data?.code === "200" && responseData) {
            setPlans(responseData.plans || []);
            setTotalPages(responseData.totalPages || 0);
            setTotalElements(responseData.totalElements || 0);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              alert("인증이 만료되었습니다. 다시 로그인해주세요.");
              logout();
            }
            if (error.response.status === 403) {
              alert("접근 권한이 없습니다.");
            }
          }
        });
    },
    [getAuthToken, logout]
  );

  // 필터나 검색어가 변경되면 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchKeyword]);

  // 페이지, 필터, 검색어, 인증 상태가 변경될 때마다 데이터 재로드
  useEffect(() => {
    // 인증이 완료된 상태에서만
    if (auth?.isAuthenticated) {
      getMyTravelPlans(currentPage, selectedFilter, searchKeyword);
    }
  }, [
    currentPage,
    selectedFilter,
    searchKeyword,
    auth?.isAuthenticated,
    auth?.isLoading,
    getMyTravelPlans,
  ]);

  // 페이지 변경
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 필터 변경
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  // 검색어 변경
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 플랜 클릭( >> 상세페이지로)
  const handlePlanClick = (planNo) => {
    navigate(`/myplan/detail/${planNo}`);
  };

  // 날짜 문자열을 "YYYY년 M월 D일" 형식으로 변환
  const formatDate = (dateString) => {
    if (!dateString) return ""; // null/undefined 값 방어
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "잘못된 날짜"; // 유효하지 않은 날짜 처리
      return `${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일`;
    } catch (error) {
      return "날짜 오류";
    }
  };

  // 인증 정보 로딩 중일 때
  if (auth?.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">인증 정보 확인 중~</div>
      </div>
    );
  }

  // 로그인하지 않은 상태일 때
  if (!auth?.isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">로그인이 필요한 서비스입니다.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-[1400px] bg-white rounded-2xl shadow-lg">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            나의 여행 플랜
          </h1>
          <p className="text-sm text-gray-500">
            총 {totalElements}개의 여행플랜이 있습니다.
          </p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="p-6">
          {/* 검색 입력 필드 */}
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="플랜 제목이나 지역명으로 검색"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 필터 버튼들 */}
          <div className="flex items-center space-x-2">
            {["전체", "예정", "완료"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 여행 플랜 목록 섹션 */}
        {plans.length === 0 ? (
          // 데이터가 없을 때
          <div className="text-center py-16">
            <div className="text-gray-500 text-base mb-2">
              {searchKeyword || selectedFilter !== "전체"
                ? "조건에 맞는 플랜이 없습니다."
                : "작성된 여행 플랜이 없습니다."}{" "}
              {/* 전체 데이터가 없는 경우 */}
            </div>
            <p className="text-sm text-gray-400">새로운 여행을 계획해보세요!</p>
          </div>
        ) : (
          // 플랜 목록 표시
          <div className="divide-y divide-gray-100">
            {plans.map((plan) => (
              <div
                key={plan.planNo}
                onClick={() => handlePlanClick(plan.planNo)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {/* 플랜 제목과 상태 */}
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-base font-medium text-gray-900">
                        {plan.planTitle || "제목 없음"}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          plan.planStatus === "예정"
                            ? "bg-teal-500"
                            : plan.planStatus === "완료"
                            ? "bg-gray-400"
                            : "bg-blue-500"
                        }`}
                      >
                        {plan.planStatus}
                      </span>
                    </div>

                    {/* 플랜 상세 정보 */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        📍 지역 :{" "}
                        {plan.selectedRegion || plan.selectRegion || "미지정"}
                      </p>
                      <p>
                        📅 기간 : {formatDate(plan.travelStartDate)} ~{" "}
                        {formatDate(plan.travelEndDate)}
                      </p>
                      <p>👥 인원 : {plan.groupSize}명</p>
                    </div>

                    {/* 작성일 정보 */}
                    <div className="mt-3 text-xs text-gray-400">
                      작성일: {formatDate(plan.createDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 (전체 페이지가 2 이상일 때만 표시) */}
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
