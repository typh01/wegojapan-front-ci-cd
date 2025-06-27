import { useState } from "react";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Check,
  Database,
  MapPin,
  Tag,
  Building,
  List,
  Filter,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { useEffect } from "react";

export default function TravelOptionsManagement() {
  const API_URL = window.ENV.API_URL;

  useEffect(() => {
    fetchCities(); // 초기 로드 시 시/도 데이터 조회
  }, []);

  // 시 데이터 (TB_CITY)
  const [cities, setCities] = useState([]);

  // 카테고리 데이터 (TB_TRAVEL_CATEGORY)
  const [categories, setCategories] = useState([
    {
      id: 4,
      name: "액티비티",
      status: "ACTIVE",
      createdDate: "2024-01-01",
      modifiedDate: "2024-01-01",
    },
  ]);

  // 구 데이터 (TB_GU)
  const [districts, setDistricts] = useState([
    {
      id: 1,
      name: "강남구",
      cityNo: 1,
      status: "ACTIVE",
      createdDate: "2024-01-01",
      modifiedDate: "2024-01-01",
    },
  ]);

  // 여행지 태그 데이터 (TB_TRAVEL_TAG)
  const [travelTags, setTravelTags] = useState([
    {
      id: 1,
      name: "가족여행",
      createdDate: "2024-01-01",
      modifiedDate: "2024-01-01",
    },
  ]);

  // 여행지 옵션 데이터 (TB_TRAVEL_OPTION)
  const [travelOptions, setTravelOptions] = useState([
    {
      id: 1,
      name: "주차 가능",
      detail: "주차장 이용 가능",
      status: "ACTIVE",
      createdDate: "2024-01-01",
      modifiedDate: "2024-01-01",
    },
  ]);

  // UI 상태
  const [activeTab, setActiveTab] = useState("categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState({
    status: "ALL",
    cityNo: "ALL",
    dateRange: "ALL",
  });

  // 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    detail: "",
    status: "ACTIVE",
    cityNo: "",
  });

  // 탭 설정
  const tabs = [
    {
      key: "categories",
      label: "카테고리",
      icon: List,
      data: categories,
      setter: setCategories,
    },
    {
      key: "cities",
      label: "시/도",
      icon: Building,
      data: cities,
      setter: setCities,
    },
    {
      key: "districts",
      label: "구/군",
      icon: MapPin,
      data: districts,
      setter: setDistricts,
    },
    {
      key: "travelTags",
      label: "여행지 태그",
      icon: Tag,
      data: travelTags,
      setter: setTravelTags,
    },
    {
      key: "travelOptions",
      label: "여행지 옵션",
      icon: Database,
      data: travelOptions,
      setter: setTravelOptions,
    },
  ];

  const currentTab = tabs.find((tab) => tab.key === activeTab);
  const currentData = currentTab?.data || [];
  const currentSetter = currentTab?.setter;

  // 시/도 목록 조회 (중복된 함수 제거)
  const fetchCities = () => {
    axios
      .get(`${API_URL}/api/admin/travels/city`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMjEiLCJpYXQiOjE3NTA5MjM4OTksImV4cCI6MTc1MTE4MzA5OX0.YvvcDWBW-r9098a4iBs8y2eWxFcGoHYFkltyiG3epfU`,
        },
      })
      .then((res) => {
        const cityList = res.data.data.map((city) => ({
          id: city.cityNo,
          name: city.cityName,
          status: city.cityStatus === "Y" ? "ACTIVE" : "INACTIVE",
          mapX: city.cityMapX || "",
          mapY: city.cityMapY || "",
          createdDate: city.cityCreatedDate,
          modifiedDate: city.cityModifiedDate,
        }));
        console.log("시/도 목록 조회 성공:", res.data);
        setCities(cityList);
      })
      .catch((err) => {
        console.error("시/도 목록 조회 실패:", err);
      });
  };

  const createCity = () => {
    return axios
      .post(
        `${API_URL}/api/admin/travels/city`,
        {
          cityName: formData.name,
          cityMapX: formData.mapX || "",
          cityMapY: formData.mapY || "",
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMjEiLCJpYXQiOjE3NTA5MjM4OTksImV4cCI6MTc1MTE4MzA5OX0.YvvcDWBW-r9098a4iBs8y2eWxFcGoHYFkltyiG3epfU`,
          },
        }
      )
      .then((res) => {
        const newCity = res.data.data;
        const now = new Date().toISOString().split("T")[0];
        const newItem = {
          id: newCity.cityNo,
          name: newCity.cityName,
          mapX: newCity.cityMapX || "",
          mapY: newCity.cityMapY || "",
          status: newCity.cityStatus === "Y" ? "ACTIVE" : "INACTIVE",
          createdDate: newCity.cityCreatedDate || now,
          modifiedDate: newCity.cityModifiedDate || now,
        };
        console.log("시/도 추가 성공:", res.data);
        setCities((prev) => [...prev, newItem]);
        closeModal();
      })
      .catch((err) => {
        console.error("시/도 추가 실패:", err);
        alert("시/도 등록에 실패했습니다.");
      });
  };

  const updateCity = () => {
    axios
      .put(
        `${API_URL}/api/admin/travels/city/${editingItem.id}`,
        {
          cityName: formData.name,
          cityMapX: formData.mapX || "",
          cityMapY: formData.mapY || "",
          cityStatus: formData.status === "ACTIVE" ? "Y" : "N",
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMjEiLCJpYXQiOjE3NTA5MjM4OTksImV4cCI6MTc1MTE4MzA5OX0.YvvcDWBW-r9098a4iBs8y2eWxFcGoHYFkltyiG3epfU`,
          },
        }
      )
      .then((res) => {
        console.log("수정 성공:", res.data);
        fetchCities(); // 목록 다시 불러오기
        closeModal();
      })
      .catch((err) => {
        console.error("수정 실패:", err);
        alert("수정 실패");
      });
  };

  const deleteCity = (id) => {
    axios
      .delete(`${API_URL}/api/admin/travels/city/${id}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMjEiLCJpYXQiOjE3NTA5MjM4OTksImV4cCI6MTc1MTE4MzA5OX0.YvvcDWBW-r9098a4iBs8y2eWxFcGoHYFkltyiG3epfU`,
        },
      })
      .then((res) => {
        console.log("삭제 성공:", res.data);
        fetchCities(); // 목록 재조회
        setDeleteConfirm(null);
      })
      .catch((err) => {
        console.error("삭제 실패:", err);
        alert("삭제 실패");
      });
  };

  // 검색 및 필터링
  const filteredData = currentData.filter((item) => {
    // 텍스트 검색
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 상태 필터
    const matchesStatus =
      filters.status === "ALL" || item.status === filters.status;

    // 시/도 필터 (구/군 탭에서만)
    const matchesCity =
      activeTab !== "districts" ||
      filters.cityNo === "ALL" ||
      item.cityNo === Number.parseInt(filters.cityNo);

    // 날짜 필터
    let matchesDate = true;
    if (filters.dateRange !== "ALL") {
      const today = new Date();
      const itemDate = new Date(item.createdDate);
      const daysDiff = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));

      switch (filters.dateRange) {
        case "TODAY":
          matchesDate = daysDiff === 0;
          break;
        case "WEEK":
          matchesDate = daysDiff <= 7;
          break;
        case "MONTH":
          matchesDate = daysDiff <= 30;
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesStatus && matchesCity && matchesDate;
  });

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      status: "ALL",
      cityNo: "ALL",
      dateRange: "ALL",
    });
  };

  // 활성 필터 개수
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "ALL"
  ).length;

  // 모달 열기
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);

    if (item) {
      setFormData({
        name: item.name,
        detail: item.detail || "",
        status: item.status || "ACTIVE",
        cityNo: item.cityNo || "",
        mapX: item.mapX || "",
        mapY: item.mapY || "",
      });
    } else {
      setFormData({
        name: "",
        detail: "",
        status: "ACTIVE",
        cityNo: "",
      });
    }

    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "", detail: "", status: "ACTIVE", cityNo: "" });
  };

  // 저장
  const handleSave = () => {
    if (!formData.name.trim()) return;

    const now = new Date().toISOString().split("T")[0];

    if (modalType === "add") {
      if (activeTab === "cities") {
        createCity();
        return;
      }
      const newItem = {
        id: Math.max(...currentData.map((item) => item.id), 0) + 1,
        name: formData.name,
        ...(activeTab === "travelOptions" && { detail: formData.detail }),
        ...(activeTab === "districts" && {
          cityNo: Number.parseInt(formData.cityNo) || 1,
        }),
        ...(["categories", "cities", "districts", "travelOptions"].includes(
          activeTab
        ) && { status: formData.status }),
        createdDate: now,
        modifiedDate: now,
      };
      currentSetter([...currentData, newItem]);
    } else {
      if (activeTab === "cities") {
        updateCity(); // ✅ 수정 API 호출
        return;
      }
      currentSetter(
        currentData.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formData.name,
                ...(activeTab === "travelOptions" && {
                  detail: formData.detail,
                }),
                ...(activeTab === "districts" && {
                  cityNo: Number.parseInt(formData.cityNo) || item.cityNo,
                }),
                ...([
                  "categories",
                  "cities",
                  "districts",
                  "travelOptions",
                ].includes(activeTab) && {
                  status: formData.status,
                }),
                modifiedDate: now,
              }
            : item
        )
      );
    }

    closeModal();
  };

  // 삭제
  const handleDelete = (id) => {
    if (activeTab === "cities") {
      deleteCity(id);
    } else {
      currentSetter(currentData.filter((item) => item.id !== id));
      setDeleteConfirm(null);
    }
  };

  // 상태 색상
  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 헤더 */}
          <div
            className="text-white p-6 rounded-t-lg"
            style={{
              background:
                "linear-gradient(135deg, #61A0D4 0%, #73B3DF 50%, #76D9E4 100%)",
            }}
          >
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6" />
              여행지 데이터 관리
            </h1>
            <p className="text-blue-100 mt-1">
              카테고리, 지역, 태그, 옵션 등 여행지 관련 모든 데이터를 관리합니다
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.key
                        ? "border-blue-400 text-blue-400 bg-white"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {tab.data.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* 검색, 필터 및 추가 버튼 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                {/* 검색 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={`${currentTab?.label} 검색...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>

                {/* 필터 버튼 */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      activeFilterCount > 0
                        ? "border-blue-500 bg-blue-50 text-blue-400"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    필터
                    {activeFilterCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isFilterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* 필터 드롭다운 */}
                  {isFilterOpen && (
                    <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">
                            필터 옵션
                          </h3>
                          <button
                            onClick={resetFilters}
                            className="text-sm text-blue-400 hover:text-blue-400"
                          >
                            초기화
                          </button>
                        </div>

                        {/* 상태 필터 */}
                        {[
                          "categories",
                          "cities",
                          "districts",
                          "travelOptions",
                        ].includes(activeTab) && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              상태
                            </label>
                            <select
                              value={filters.status}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  status: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="ALL">전체</option>
                              <option value="ACTIVE">활성</option>
                              <option value="INACTIVE">비활성</option>
                            </select>
                          </div>
                        )}

                        {/* 시/도 필터 (구/군 탭에서만) */}
                        {activeTab === "districts" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              시/도
                            </label>
                            <select
                              value={filters.cityNo}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  cityNo: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="ALL">전체</option>
                              {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* 날짜 필터 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            생성일
                          </label>
                          <select
                            value={filters.dateRange}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                dateRange: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="ALL">전체</option>
                            <option value="TODAY">오늘</option>
                            <option value="WEEK">최근 7일</option>
                            <option value="MONTH">최근 30일</option>
                          </select>
                        </div>

                        {/* 필터 결과 */}
                        <p className="text-sm text-gray-600">
                          총 {currentData.length}개 중 {filteredData.length}개
                          표시
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => openModal("add")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4" />
                {currentTab?.label} 추가
              </button>
            </div>

            {/* 활성 필터 표시 */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {filters.status !== "ALL" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                    상태: {filters.status === "ACTIVE" ? "활성" : "비활성"}
                    <button
                      onClick={() => setFilters({ ...filters, status: "ALL" })}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.cityNo !== "ALL" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                    시/도:{" "}
                    {
                      cities.find(
                        (city) => city.id === Number.parseInt(filters.cityNo)
                      )?.name
                    }
                    <button
                      onClick={() => setFilters({ ...filters, cityNo: "ALL" })}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.dateRange !== "ALL" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                    생성일:{" "}
                    {filters.dateRange === "TODAY"
                      ? "오늘"
                      : filters.dateRange === "WEEK"
                      ? "최근 7일"
                      : filters.dateRange === "MONTH"
                      ? "최근 30일"
                      : ""}
                    <button
                      onClick={() =>
                        setFilters({ ...filters, dateRange: "ALL" })
                      }
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* 데이터 테이블 */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이름
                      </th>
                      {activeTab === "travelOptions" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상세
                        </th>
                      )}
                      {activeTab === "districts" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          시/도
                        </th>
                      )}
                      {["cities", "districts"].includes(activeTab) && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            위도
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            경도
                          </th>
                        </>
                      )}
                      {[
                        "categories",
                        "cities",
                        "districts",
                        "travelOptions",
                      ].includes(activeTab) && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        생성일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        수정일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        {activeTab === "travelOptions" && (
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.detail}
                          </td>
                        )}
                        {activeTab === "districts" && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cities.find((city) => city.id === item.cityNo)
                              ?.name || "미지정"}
                          </td>
                        )}
                        {["cities", "districts"].includes(activeTab) && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.mapY || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.mapX || "-"}
                            </td>
                          </>
                        )}
                        {[
                          "categories",
                          "cities",
                          "districts",
                          "travelOptions",
                        ].includes(activeTab) && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status === "ACTIVE" ? "활성" : "비활성"}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.createdDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.modifiedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal("edit", item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  id: item.id,
                                  name: item.name,
                                })
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {searchTerm || activeFilterCount > 0
                      ? "검색 조건에 맞는 데이터가 없습니다."
                      : "데이터가 없습니다."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 추가/수정 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {modalType === "add" ? "추가" : "수정"} - {currentTab?.label}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                {activeTab === "travelOptions" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상세 설명
                    </label>
                    <textarea
                      value={formData.detail}
                      onChange={(e) =>
                        setFormData({ ...formData, detail: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="상세 설명을 입력하세요"
                    />
                  </div>
                )}

                {activeTab === "districts" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시/도 *
                    </label>
                    <select
                      value={formData.cityNo}
                      onChange={(e) =>
                        setFormData({ ...formData, cityNo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">시/도를 선택하세요</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {["cities", "districts"].includes(activeTab) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        위도 (MapY)
                      </label>
                      <input
                        type="text"
                        value={formData.mapY || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, mapY: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 37.5665"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        경도 (MapX)
                      </label>
                      <input
                        type="text"
                        value={formData.mapX || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, mapX: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 126.9780"
                      />
                    </div>
                  </>
                )}

                {[
                  "categories",
                  "cities",
                  "districts",
                  "travelOptions",
                ].includes(activeTab) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상태
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">활성</option>
                      <option value="INACTIVE">비활성</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-2">삭제 확인</h3>
              <p className="text-gray-600 mb-4">
                "{deleteConfirm.name}"을(를) 정말 삭제하시겠습니까?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
