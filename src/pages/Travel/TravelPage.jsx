import { useContext, useEffect, useState } from "react";
import SliderSection from "./common/SliderSection";
import CategoryFilter from "./common/CategoryFilter";
import DestinationGrid from "./common/DestinationGrid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookMark from "./common/BookMark";
import { AuthContext } from "../../components/Context/AuthContext";

function TravelPage() {
  const navigate = useNavigate();
  const API_URL = window.ENV.API_URL;
  const { auth } = useContext(AuthContext);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [travelList, setTravelList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [generalList, setGeneralList] = useState([]);
  const [categories, setCategories] = useState([]);

  const memberNo = auth?.loginInfo?.memberNo;

  useEffect(() => {
    fetchCategories();
    fetchTravelList();
  }, []);

  const fetchTravelList = () => {
    axios
      .get(`${API_URL}/api/travels`)
      .then((res) => {
        const data = res.data.data;
        setTravelList(data);
        setPopularList(data.slice(0, 5));
        setGeneralList(data.slice(5, 15));
      })
      .catch((err) => console.error("여행지 목록 조회 실패:", err));
  };

  const fetchCategories = () => {
    axios
      .get(`${API_URL}/api/travels/category`)
      .then((res) => {
        const categoryList = res.data.data.map((cat) => ({
          id: cat.categoryNo,
          name: cat.categoryName,
          status: cat.categoryStatus === "Y" ? "ACTIVE" : "INACTIVE",
          createdDate: cat.categoryCreatedDate,
          modifiedDate: cat.categoryModifiedDate,
        }));
        const fullList = [{ id: 0, name: "전체" }, ...categoryList];
        setCategories(fullList);
      })
      .catch((err) => {
        console.error("카테고리 목록 조회 실패:", err);
      });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const resetFilters = () => {
    setSelectedCategory("전체");
    setSelectedDistrict("전체");
    setSelectedTags([]);
    setSelectedFacilities([]);
    setSearchTerm("");
  };

  const filteredDestinations = generalList.filter((d) => {
    const matchesCategory =
      selectedCategory === "전체" || d.categoryName === selectedCategory;
    const matchesDistrict =
      selectedDistrict === "전체" || d.guName === selectedDistrict;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) =>
        d.tagListForView?.map((t) => t.tagName || t.themaName).includes(tag)
      );
    const matchesFacilities = selectedFacilities.length === 0;

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
        <section className="mb-12">
          <SliderSection
            title="인기 여행지"
            items={popularList || []}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        </section>

        <section>
          <div className="flex flex-col items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">여행지 리스트</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          {auth?.isAuthenticated && memberNo && (
            <DestinationGrid
              destinations={filteredDestinations}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              resetFilters={resetFilters}
              renderBookmark={(travelNo) => (
                <BookMark
                  travelNo={travelNo}
                  isBookmarked={favorites.has(travelNo)}
                />
              )}
            />
          )}

          {filteredDestinations.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => navigate(`/travels/search`)}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                더보기
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default TravelPage;
