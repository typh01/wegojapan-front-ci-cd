import { MapPin, Star, Share2 } from "lucide-react";
import TagList from "./TagList";
import FacilityList from "./FacilityList";
import BookMark from "./BookMark"; // 추가
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../components/Context/AuthContext"; // 실제 AuthContext 경로 확인

function DestinationGrid({ destinations }) {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // 현재 로그인된 사용자 정보

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {destinations.map((dest) => {
        const id = dest.travelNo;
        const imageUrl = dest.imageList?.[0]?.imageUrl || "/placeholder.svg";
        const category = dest.categoryName || "기타";
        const location = dest.address || dest.guName || "미정";
        const rating = dest.rating || "4.5";
        const tags =
          dest.tagListForView?.map((t) => t.tagName || t.themaName) || [];
        const facilities =
          dest.optionListForView?.map((o) => o.optionName) || [];

        return (
          <div
            key={id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={imageUrl}
                alt={dest.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {category}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                <BookMark
                  travelNo={id}
                  memberNo={auth?.memberNo}
                  isBookmarked={dest.isBookmarked}
                />
                <button className="p-1.5 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2">{dest.title}</h3>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{location}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
              <TagList tags={tags} />
              <FacilityList facilities={facilities} />
              <button
                onClick={() => navigate(`/travels/detail/${id}`)}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                상세보기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DestinationGrid;
