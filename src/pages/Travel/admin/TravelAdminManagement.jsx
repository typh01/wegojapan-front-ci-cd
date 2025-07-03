import { useEffect, useState } from "react";
import {
  Settings,
  Search,
  Edit,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import axios from "axios";

export default function TravelAdminManagement() {
  // 필터 및 페이징 상태
  const [activeThema, setActiveThema] = useState("전체");
  const [periodFilter, setPeriodFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showThemaModal, setShowThemaModal] = useState(false);
  const [selectedTravelId, setSelectedTravelId] = useState(null);
  const [travelData, setTravelData] = useState([
    {
      no: 1,
      name: "오사카 성",
      registrationDate: "2023.07.24",
      modificationDate: "2023.07.25",
      status: "등록완료",
      isActive: true,
      themes: ["문화/역사"],
    },
  ]);

  // 테마 목록 상태
  const [themas, setThemas] = useState(["전체"]);
  const totalPages = 7;

  // API 설정
  const API_URL = window.ENV.API_URL;
  const token = JSON.parse(localStorage.getItem("tokens"))?.accessToken;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchThemas();
  }, []);

  // 테마 목록 조회
  const fetchThemas = () => {
    axios
      .get(`${API_URL}/api/admin/travels/thema`, { headers })
      .then((res) => {
        const list = res.data.data.map((t) => ({
          id: t.themaNo,
          name: t.themaName,
          status: t.themaStatus === "Y" ? "ACTIVE" : "INACTIVE",
          createdDate: t.themaCreatedDate,
          modifiedDate: t.themaModifiedDate,
        }));
        setThemas(["전체", ...list]);
      })
      .catch((err) => console.error("테마 목록 조회 실패:", err));
  };

  // 모달 상태

  // 상태 토글
  const handleStatusToggle = (no) => {
    setTravelData((prev) =>
      prev.map((item) =>
        item.no === no
          ? {
              ...item,
              isActive: !item.isActive,
              status: item.isActive ? "비활성" : "등록완료",
            }
          : item
      )
    );
  };

  const handleEdit = (no) => {
    console.log(`수정: ${no}`);
  };
  const handleSearch = () => {
    console.log("검색:", { periodFilter, statusFilter, searchTerm });
  };

  // 테마 추가 모달 열기
  const handleThemaRegistration = (travelId) => {
    setSelectedTravelId(travelId);
    setShowThemaModal(true);
  };

  // 여행지-테마 추가/삭제
  const handleThemaAdd = (travelId, themaName) => {
    setTravelData((prev) =>
      prev.map((item) =>
        item.no === travelId
          ? {
              ...item,
              themes: item.themes.includes(themaName)
                ? item.themes
                : [...item.themes, themaName],
            }
          : item
      )
    );
  };
  const handleThemaRemove = (travelId, themaName) => {
    setTravelData((prev) =>
      prev.map((item) =>
        item.no === travelId
          ? { ...item, themes: item.themes.filter((t) => t !== themaName) }
          : item
      )
    );
  };

  // 스타일 헬퍼
  const getStatusColor = (status) =>
    status === "등록완료"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  const getStatusText = (status) =>
    status === "등록완료" ? "등록완료" : "비활성";
  const getThemaColor = (name) => {
    const map = {
      "자연/경관": "bg-green-100 text-green-800",
      "문화/역사": "bg-purple-100 text-purple-800",
      "음식/맛집": "bg-orange-100 text-orange-800",
      쇼핑: "bg-pink-100 text-pink-800",
      엔터테인먼트: "bg-blue-100 text-blue-800",
      체험활동: "bg-yellow-100 text-yellow-800",
      "휴양/힐링": "bg-teal-100 text-teal-800",
    };
    return map[name] || "bg-gray-100 text-gray-800";
  };

  // 필터링
  const filteredData = travelData.filter((item) => {
    const matchThema =
      activeThema === "전체" || item.themes.includes(activeThema);
    const matchStatus =
      !statusFilter ||
      (statusFilter === "active" && item.isActive) ||
      (statusFilter === "inactive" && !item.isActive);
    const matchSearch =
      !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchPeriod = true;
    if (periodFilter !== "전체") {
      const today = new Date();
      const d = new Date(item.registrationDate.replace(/\./g, "-"));
      if (periodFilter === "오늘")
        matchPeriod = d.toDateString() === today.toDateString();
      else if (periodFilter === "최근 7일")
        matchPeriod = d >= new Date(today.getTime() - 7 * 86400000);
      else if (periodFilter === "최근 30일")
        matchPeriod = d >= new Date(today.getTime() - 30 * 86400000);
    }
    return matchThema && matchStatus && matchSearch && matchPeriod;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 제목 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="h-6 w-6" /> 여행지 관리
          </h1>
        </div>

        {/* 필터 영역 */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          {/* 테마별 조회 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              테마별 조회
            </h2>
            <div className="flex flex-wrap gap-3">
              {themas.map((thema) => {
                const label = typeof thema === "string" ? thema : thema.name;
                return (
                  <button
                    key={typeof thema === "string" ? thema : thema.id}
                    onClick={() => setActiveThema(label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeThema === label
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 검색 필터 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              검색 필터
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  등록 기간
                </label>
                <div className="flex flex-wrap gap-2">
                  {["전체", "오늘", "최근 7일", "최근 30일"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodFilter(p)}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        periodFilter === p
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* 상태 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  <option value="active">등록완료</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>

              {/* 검색어 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  여행지명 검색
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="여행지명을 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  여행지명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  테마
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수정일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.no} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.no}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.themes.map((t) => (
                        <span
                          key={t}
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getThemaColor(
                            t
                          )}`}
                        >
                          {t}
                          <button
                            onClick={() => handleThemaRemove(item.no, t)}
                            className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => handleThemaRegistration(item.no)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 border border-dashed border-gray-300 rounded-full hover:border-gray-400 hover:text-gray-700"
                      >
                        <Plus className="h-3 w-3" />
                        테마 추가
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.modificationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.no)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs"
                      >
                        <Edit className="h-3 w-3" />
                        수정하기
                      </button>
                      <button
                        onClick={() => handleStatusToggle(item.no)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors text-xs ${
                          item.isActive
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <PowerOff className="h-3 w-3" />
                            비활성화
                          </>
                        ) : (
                          <>
                            <Power className="h-3 w-3" />
                            활성화
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              총 {filteredData.length}개의 여행지
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    currentPage === idx + 1
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 테마 추가 모달 */}
        {showThemaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  테마 추가
                </h3>
                <button
                  onClick={() => setShowThemaModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {themas.slice(1).map((th) => (
                  <button
                    key={th.id}
                    onClick={() =>
                      !travelData
                        .find((it) => it.no === selectedTravelId)
                        .themes.includes(th.name) &&
                      handleThemaAdd(selectedTravelId, th.name)
                    }
                    disabled={travelData
                      .find((it) => it.no === selectedTravelId)
                      .themes.includes(th.name)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      travelData
                        .find((it) => it.no === selectedTravelId)
                        .themes.includes(th.name)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {" "}
                    <div className="flex items-center justify-between">
                      <span>{th.name}</span>
                      {travelData
                        .find((it) => it.no === selectedTravelId)
                        .themes.includes(th.name) && (
                        <span className="text-xs text-gray-400">
                          이미 추가됨
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowThemaModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
