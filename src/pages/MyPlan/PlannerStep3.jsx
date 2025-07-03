import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PlannerStep3 = ({
  onDataChange,
  onValidationChange,
  initialData = {},
  selectedRegion = "",
  showErrors = false,
  authToken = null,
}) => {
  // 선택된 여행지들 상태 관리
  const [selectedPlaces, setSelectedPlaces] = useState(
    initialData.selectedPlaces || []
  );
  // 지역별 여행지 목록 상태 관리
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 구글맵 관련 레퍼런스
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [errors, setErrorsState] = useState({
    selectedPlaces: "",
  });

  const API_BASE_URL = window.ENV?.API_URL + "/api";

  useEffect(() => {
    if (!selectedRegion) {
      setPlaces([]);
      return;
    }

    // 여행지 목록을 서버에서 가져오는 함수
    const fetchPlaces = () => {
      setIsLoading(true);
      setError(null);

      const headers = {
        "Content-Type": "application/json",
      };

      // 인증 토큰이 있으면 헤더에 추가
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      axios
        .get(`${API_BASE_URL}/admin/travels/places`, {
          params: { guName: selectedRegion },
          headers: headers,
        })
        .then((response) => {
          let placesData;
          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            placesData = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            placesData = response.data;
          } else {
            throw new Error("서버로부터 받은 데이터 형식이 올바르지 않습니다.");
          }

          // 백엔드 데이터를 프론트엔드에서 사용할 형식으로 변환
          const transformedPlaces = placesData.map((place) => ({
            id: place.travelNo || place.id,
            name: place.title || place.travelName || place.name,
            lat: parseFloat(place.mapY || place.travelMapY || place.lat),
            lng: parseFloat(place.mapX || place.travelMapX || place.lng),
            description:
              place.description ||
              place.explain ||
              place.travelDescription ||
              "설명이 없습니다.",
            image:
              (place.imageList && place.imageList.length > 0
                ? place.imageList[0].imageUrl
                : null) ||
              place.travelImage ||
              `https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(
                place.title || place.name || "여행지"
              )}`,
            guName: place.guName,
            address: place.address || place.travelAddress,
          }));

          // 유효한 여행지만 필터링 (필수 필드가 있는 것만)
          const validPlaces = transformedPlaces.filter(
            (place) =>
              place.id && place.name && !isNaN(place.lat) && !isNaN(place.lng)
          );

          // 유효한 여행지가 없으면 에러 발생
          if (validPlaces.length === 0) {
            throw new Error(
              `${selectedRegion} 지역에 유효한 여행지 데이터가 없습니다.`
            );
          }

          // 여행지 목록 상태 업데이트
          setPlaces(validPlaces);

          console.log(
            `${selectedRegion} 지역 여행지 로드 완료: ${validPlaces.length}개`
          );
        })
        .catch((err) => {
          console.error(
            `${selectedRegion}의 여행지 정보를 불러오는 데 실패했습니다.`,
            err
          );

          if (err.response) {
            console.error("응답 에러 상세:", {
              status: err.response.status,
              statusText: err.response.statusText,
              data: err.response.data,
              headers: err.response.headers,
            });

            if (err.response.status === 401) {
              setError("인증이 필요합니다. 로그인을 다시 해주세요.");
            } else if (err.response.status === 403) {
              setError("접근 권한이 없습니다. 관리자에게 문의하세요.");
            } else if (err.response.status === 404) {
              setError(
                `${selectedRegion} 지역의 여행지 정보를 찾을 수 없습니다.`
              );
            } else if (err.response.status === 500) {
              setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            } else {
              setError(
                `여행지 정보를 불러오는 중 오류가 발생했습니다. (${err.response.status})`
              );
            }
          } else if (err.request) {
            // 네트워크 에러
            console.error("요청 에러:", err.request);
            setError("네트워크 연결을 확인해주세요.");
          } else {
            // 기타 에러
            console.error("기타 에러:", err.message);
            setError(
              err.message || "여행지 정보를 불러오는 중 오류가 발생했습니다."
            );
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchPlaces();
  }, [selectedRegion, API_BASE_URL]);

  // 초기 데이터가 변경될 때 선택된 여행지 업데이트
  useEffect(() => {
    setSelectedPlaces(initialData.selectedPlaces || []);
  }, [initialData]);

  // 구글 맵 초기화 useEffect
  useEffect(() => {
    const apiKey = window.ENV?.GOOGLE_MAPS_API_KEY;

    // 구글 맵 초기화 함수
    const initMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        console.log("Google Maps 초기화 시작");

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 34.6937, lng: 135.5023 }, // 오사카 중심 좌표
          zoom: 13, // 줌 레벨
        });

        // 지도 인스턴스 저장
        mapInstanceRef.current = map;

        console.log("Google Maps 초기화 완료");
      }
    };

    if (apiKey) {
      // 구글 맵 API가 이미 로드되어 있는지 확인
      if (window.google && window.google.maps) {
        initMap();
      } else {
        // 구글 맵 API 스크립트 동적 로드
        console.log("Google Maps API 스크립트 로딩 중...");
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap; // 스크립트 로드 완료 후 지도 초기화
        document.head.appendChild(script);

        // 컴포넌트 언마운트 시 스크립트 제거
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      }
    } else {
      console.warn(
        "Google Maps API 키가 설정되지 않았습니다. 지도 없이 여행지 목록만 표시됩니다."
      );
    }
  }, []);

  // 선택된 여행지 변경 시 지도 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && selectedPlaces.length > 0) {
      updateMapWithMarkers(); // 마커 업데이트
    } else if (mapInstanceRef.current) {
      clearMapMarkers(); // 마커 초기화
    }
  }, [selectedPlaces]);

  // 지도 마커 초기화 함수
  const clearMapMarkers = () => {
    // 기존 마커들 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  // 선택된 여행지들로 지도 마커 업데이트 함수
  const updateMapWithMarkers = () => {
    if (!mapInstanceRef.current || selectedPlaces.length === 0) return;

    // 기존 마커 초기화
    clearMapMarkers();

    // 각 선택된 여행지에 순서가 표시된 마커 생성
    selectedPlaces.forEach((place, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng }, // 마커 위치
        map: mapInstanceRef.current, // 지도 인스턴스
        title: `${index + 1}. ${place.name}`, // 마커 툴팁
        icon: {
          // 순서가 표시된 마커 아이콘
          url: `http://maps.google.com/mapfiles/kml/paddle/${index + 1}.png`,
          scaledSize: new window.google.maps.Size(32, 32), // 아이콘 크기
        },
      });
      markersRef.current.push(marker); // 마커 배열에 추가
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (selectedPlaces.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      selectedPlaces.forEach((place) =>
        bounds.extend({ lat: place.lat, lng: place.lng })
      );
      mapInstanceRef.current.fitBounds(bounds); // 지도 범위 맞춤
    }
  };

  // 여행지 선택/해제 처리
  const handlePlaceToggle = (place) => {
    const isSelected = selectedPlaces.some((p) => p.id === place.id);

    if (isSelected) {
      // 이미 선택된 여행지를 클릭한 경우 -> 선택 해제
      const newSelectedPlaces = selectedPlaces.filter((p) => p.id !== place.id);
      setSelectedPlaces(newSelectedPlaces);
      updateData(newSelectedPlaces);
    } else {
      // 새로운 여행지를 선택한 경우
      if (selectedPlaces.length >= 5) {
        alert("최대 5개까지만 선택할 수 있습니다.");
        return;
      }
      const newSelectedPlaces = [...selectedPlaces, place];
      setSelectedPlaces(newSelectedPlaces);
      updateData(newSelectedPlaces);
    }
  };

  // 선택된 여행지 제거 함수
  const handleRemovePlace = (placeId) => {
    const newSelectedPlaces = selectedPlaces.filter((p) => p.id !== placeId);
    setSelectedPlaces(newSelectedPlaces);
    updateData(newSelectedPlaces);
  };

  // 여행지 순서 위로 이동 함수
  const handleMoveUp = (index) => {
    if (index > 0) {
      const newSelectedPlaces = [...selectedPlaces];
      // 배열 요소 위치 교환
      [newSelectedPlaces[index - 1], newSelectedPlaces[index]] = [
        newSelectedPlaces[index],
        newSelectedPlaces[index - 1],
      ];
      setSelectedPlaces(newSelectedPlaces);
      updateData(newSelectedPlaces);
    }
  };

  // 여행지 순서 아래로 이동 함수
  const handleMoveDown = (index) => {
    if (index < selectedPlaces.length - 1) {
      const newSelectedPlaces = [...selectedPlaces];
      // 배열 요소 위치 교환
      [newSelectedPlaces[index], newSelectedPlaces[index + 1]] = [
        newSelectedPlaces[index + 1],
        newSelectedPlaces[index],
      ];
      setSelectedPlaces(newSelectedPlaces);
      updateData(newSelectedPlaces);
    }
  };

  // 데이터 유효성 검사 함수
  const validateData = (selectedPlacesArray) => {
    const newErrors = { selectedPlaces: "" };
    let isValid = true;

    // 최소 1개 이상 선택했는지 확인
    if (selectedPlacesArray.length === 0) {
      newErrors.selectedPlaces = "최소 1개 이상의 여행지를 선택해주세요.";
      isValid = false;
    }

    setErrorsState(newErrors);
    return { isValid, errors: newErrors };
  };

  const updateData = (selectedPlacesArray) => {
    const validationResult = validateData(selectedPlacesArray);
    onDataChange({ selectedPlaces: selectedPlacesArray });
    onValidationChange(validationResult.isValid);
  };

  return (
    <div className="h-full flex gap-6">
      {/* 왼쪽: 여행지 목록 */}
      <div className="w-1/2 flex flex-col">
        {/* 선택된 지역 표시 */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">
            선택된 지역: {selectedRegion}
          </h3>
          <p className="text-xs text-blue-600 mt-1">
            아래에서 방문하고 싶은 여행지를 최대 5개까지 선택해주세요.
          </p>
        </div>

        {/* 여행지 목록 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            // 로딩 중 표시
            <div className="text-center text-gray-500 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              여행지 목록을 불러오는 중...
            </div>
          ) : error ? (
            // 에러 발생 시 표시
            <div className="text-center text-red-600 py-8">
              <div className="mb-4">⚠️</div>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                다시 시도
              </button>
            </div>
          ) : places.length === 0 ? (
            // 여행지가 없을 때 표시
            <div className="text-center text-gray-500 py-8">
              <p>해당 지역의 여행지 정보가 없습니다.</p>
              <p className="text-sm mt-2">다른 지역을 선택해주세요.</p>
            </div>
          ) : (
            // 여행지 목록 표시
            <div className="grid grid-cols-1 gap-3">
              {places.map((place) => {
                const isSelected = selectedPlaces.some(
                  (p) => p.id === place.id
                );
                const selectedIndex = selectedPlaces.findIndex(
                  (p) => p.id === place.id
                );

                return (
                  <div
                    key={place.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handlePlaceToggle(place)}
                  >
                    {/* 선택된 순서 표시 */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {selectedIndex + 1}
                      </div>
                    )}

                    <div className="flex gap-3">
                      {/* 여행지 이미지 */}
                      <div className="w-20 h-16 bg-gray-200 rounded-md flex-shrink-0">
                        <img
                          src={
                            place.image ||
                            `https://placehold.co/80x64/e2e8f0/64748b?text=${encodeURIComponent(
                              place.name
                            )}`
                          }
                          alt={place.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            // 이미지 로드 실패 시 플레이스홀더로 대체
                            e.target.src = `https://placehold.co/80x64/e2e8f0/64748b?text=${encodeURIComponent(
                              place.name
                            )}`;
                          }}
                        />
                      </div>

                      {/* 여행지 정보 */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-sm mb-1 ${
                            isSelected ? "text-blue-800" : "text-gray-800"
                          }`}
                        >
                          {place.name}
                        </h4>
                        <p
                          className={`text-xs leading-relaxed ${
                            isSelected ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          {place.description}
                        </p>
                        {/* 주소 정보 표시 */}
                        {place.address && (
                          <p className="text-xs text-gray-500 mt-1">
                            📍 {place.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 에러 메시지 표시 */}
        {showErrors && errors.selectedPlaces && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="text-red-800 text-sm">
              {errors.selectedPlaces}
            </span>
          </div>
        )}
      </div>

      {/* 오른쪽: 지도 및 선택된 여행지 목록 */}
      <div className="w-1/2 flex flex-col">
        {/* 구글 지도 */}
        <div className="flex-1 mb-4">
          <div
            ref={mapRef}
            className="w-full h-full rounded-lg border border-gray-300 shadow-sm"
            style={{ minHeight: "300px" }}
          />
        </div>

        {/* 선택된 여행지 목록 */}
        {selectedPlaces.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              선택된 여행지 ({selectedPlaces.length}/5)
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedPlaces.map((place, index) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between bg-white p-2 rounded border"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {/* 순서 번호 */}
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    {/* 여행지 이름 */}
                    <span className="text-sm truncate">{place.name}</span>
                  </div>

                  {/* 순서 변경 및 삭제 버튼들 */}
                  <div className="flex items-center space-x-1">
                    {/* 위로 이동 버튼 */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="위로 이동"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>

                    {/* 아래로 이동 버튼 */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedPlaces.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="아래로 이동"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemovePlace(place.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="선택 해제"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannerStep3;
