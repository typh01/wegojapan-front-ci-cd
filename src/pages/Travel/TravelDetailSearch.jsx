import { useState } from "react";
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Search,
  X,
  ArrowLeft,
} from "lucide-react";

export default function TravelDetailSearchPage() {
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 여행지 리스트 데이터
  const travelDestinations = [
    {
      id: 1,
      title: "경복궁",
      category: "관광지",
      location: "종로구 사직로 161",
      district: "종로구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.5,
      reviews: 1234,
      tags: ["역사", "궁궐", "전통"],
      facilities: ["주차가능", "장애인편의"],
      price: "무료",
    },
    {
      id: 2,
      title: "명동 교자",
      category: "맛집",
      location: "중구 명동길 29",
      district: "중구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.3,
      reviews: 856,
      tags: ["만두", "전통", "맛집"],
      facilities: ["예약필요"],
      price: "15,000원~",
    },
    {
      id: 3,
      title: "롯데월드타워",
      category: "관광지",
      location: "송파구 올림픽로 300",
      district: "송파구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.4,
      reviews: 2341,
      tags: ["전망", "쇼핑", "현대"],
      facilities: ["주차가능", "장애인편의", "화장실"],
      price: "27,000원",
    },
    {
      id: 4,
      title: "홍대 놀이터",
      category: "액티비티",
      location: "마포구 와우산로 94",
      district: "마포구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.2,
      reviews: 567,
      tags: ["클럽", "젊음", "밤문화"],
      facilities: ["화장실"],
      price: "입장료 별도",
    },
    {
      id: 5,
      title: "북촌 한옥마을",
      category: "관광지",
      location: "종로구 계동길 37",
      district: "종로구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.6,
      reviews: 1876,
      tags: ["한옥", "전통", "사진"],
      facilities: ["화장실"],
      price: "무료",
    },
    {
      id: 6,
      title: "이태원 맛집거리",
      category: "맛집",
      location: "용산구 이태원로 200",
      district: "용산구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.1,
      reviews: 432,
      tags: ["세계음식", "다양성", "이국적"],
      facilities: ["주차가능", "화장실"],
      price: "20,000원~",
    },
    {
      id: 7,
      title: "강남 스파",
      category: "숙박",
      location: "강남구 테헤란로 152",
      district: "강남구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      reviews: 234,
      tags: ["휴식", "스파", "럭셔리"],
      facilities: ["주차가능", "장애인편의", "화장실", "예약필요"],
      price: "150,000원~",
    },
    {
      id: 8,
      title: "동대문 쇼핑",
      category: "쇼핑",
      location: "중구 을지로 281",
      district: "중구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.0,
      reviews: 678,
      tags: ["쇼핑", "패션", "24시간"],
      facilities: ["주차가능", "화장실"],
      price: "상품별 상이",
    },
    {
      id: 9,
      title: "남산타워",
      category: "관광지",
      location: "용산구 남산공원길 105",
      district: "용산구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.3,
      reviews: 3421,
      tags: ["전망", "야경", "데이트"],
      facilities: ["주차가능", "화장실"],
      price: "16,000원",
    },
    {
      id: 10,
      title: "광장시장",
      category: "맛집",
      location: "종로구 창경궁로 88",
      district: "종로구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.2,
      reviews: 1567,
      tags: ["전통시장", "길거리음식", "저렴"],
      facilities: ["화장실"],
      price: "5,000원~",
    },
    {
      id: 11,
      title: "한강공원",
      category: "액티비티",
      location: "여의도동 한강공원",
      district: "영등포구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.4,
      reviews: 2134,
      tags: ["자연", "피크닉", "자전거"],
      facilities: ["주차가능", "화장실", "장애인편의"],
      price: "무료",
    },
    {
      id: 12,
      title: "명동성당",
      category: "관광지",
      location: "중구 명동길 74",
      district: "중구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.1,
      reviews: 892,
      tags: ["종교", "건축", "역사"],
      facilities: ["장애인편의"],
      price: "무료",
    },
  ];

  const categories = ["전체", "관광지", "맛집", "숙박", "액티비티", "쇼핑"];
  const districts = [
    "전체",
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ];

  // 모든 태그와 편의시설 추출
  const allTags = [...new Set(travelDestinations.flatMap((dest) => dest.tags))];
  const allFacilities = [
    ...new Set(travelDestinations.flatMap((dest) => dest.facilities)),
  ];

  // 찜하기 토글
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  // 태그 토글
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 편의시설 토글
  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  // 필터 초기화
  const resetFilters = () => {
    setSelectedCategory("전체");
    setSelectedDistrict("전체");
    setSelectedTags([]);
    setSelectedFacilities([]);
    setSearchTerm("");
  };

  // 활성 필터 개수
  const activeFilterCount = [
    selectedCategory !== "전체",
    selectedDistrict !== "전체",
    selectedTags.length > 0,
    selectedFacilities.length > 0,
    searchTerm !== "",
  ].filter(Boolean).length;

  // 필터링된 여행지
  const filteredDestinations = travelDestinations.filter((destination) => {
    const matchesCategory =
      selectedCategory === "전체" || destination.category === selectedCategory;
    const matchesDistrict =
      selectedDistrict === "전체" || destination.district === selectedDistrict;
    const matchesSearch =
      destination.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => destination.tags.includes(tag));
    const matchesFacilities =
      selectedFacilities.length === 0 ||
      selectedFacilities.some((facility) =>
        destination.facilities.includes(facility)
      );

    return (
      matchesCategory &&
      matchesDistrict &&
      matchesSearch &&
      matchesTags &&
      matchesFacilities
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>뒤로가기</span>
          </button>
        </div>

        {/* 페이지 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            여행지 상세 검색
          </h1>
          <p className="text-gray-600">
            원하는 조건으로 완벽한 여행지를 찾아보세요
          </p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          {/* 검색창 */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="여행지명, 위치로 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>

          {/* 필터 옵션들 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽 컬럼 */}
            <div className="space-y-6">
              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  카테고리
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 지역구 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  지역구
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="space-y-6">
              {/* 편의시설 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  편의시설
                </label>
                <div className="flex flex-wrap gap-2">
                  {allFacilities.map((facility) => (
                    <button
                      key={facility}
                      onClick={() => toggleFacility(facility)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedFacilities.includes(facility)
                          ? "bg-purple-100 text-purple-800 border border-purple-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {facility}
                    </button>
                  ))}
                </div>
              </div>

              {/* 태그 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  태그
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          {activeFilterCount > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={resetFilters}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                전체 초기화 ({activeFilterCount}개 필터 적용중)
              </button>
            </div>
          )}
        </div>

        {/* 활성 필터 표시 */}
        {activeFilterCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {selectedCategory !== "전체" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                카테고리: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("전체")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedDistrict !== "전체" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                지역: {selectedDistrict}
                <button
                  onClick={() => setSelectedDistrict("전체")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedFacilities.map((facility) => (
              <span
                key={facility}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
              >
                편의시설: {facility}
                <button
                  onClick={() => toggleFacility(facility)}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                태그: #{tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                검색어: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-yellow-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* 여행지 리스트 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            여행지 리스트
          </h2>
          <p className="text-gray-600">
            총{" "}
            <span className="font-semibold text-blue-600">
              {filteredDestinations.length}
            </span>
            개의 여행지를 찾았습니다
          </p>
        </div>

        {/* 여행지 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {destination.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={() => toggleFavorite(destination.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      favorites.has(destination.id)
                        ? "bg-red-500 text-white"
                        : "bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100"
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">
                  {destination.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{destination.location}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {destination.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({destination.reviews})
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {destination.price}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {destination.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 편의시설 표시 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {destination.facilities.slice(0, 2).map((facility, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                    >
                      {facility}
                    </span>
                  ))}
                  {destination.facilities.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{destination.facilities.length - 2}
                    </span>
                  )}
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 결과가 없을 때 */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500 mb-4">
              다른 검색어나 필터 조건을 시도해보세요
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              전체 여행지 보기
            </button>
          </div>
        )}

        {/* 더보기 버튼 */}
        {filteredDestinations.length > 0 && (
          <div className="text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
              더 많은 여행지 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
