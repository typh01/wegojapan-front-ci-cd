import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = window.ENV?.API_URL + "/api";

const PlannerStep2 = ({
  onDataChange,
  onValidationChange,
  initialData = {},
  showErrors = false,
}) => {
  // 선택된 지역 상태
  const [selectedRegion, setSelectedRegion] = useState(
    initialData.selectedRegion || ""
  );
  // 지역 목록
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 구글 맵 관련
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const selectedMarkerRef = useRef(null);
  const markersRef = useRef([]);

  const [errors, setErrorsState] = useState({
    selectedRegion: "",
  });

  useEffect(() => {
    const fetchRegions = () => {
      setIsLoading(true);
      setError(null);

      axios
        .get(`${API_BASE_URL}/admin/travels/gu`)
        .then((response) => {
          let regionsData;

          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            regionsData = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            regionsData = response.data;
          } else {
            throw new Error("서버로부터 받은 데이터 형식이 올바르지 않습니다.");
          }

          // 백엔드 데이터를 프론트엔드 형식으로 변환
          const transformedRegions = regionsData
            .filter((region) => region.guStatus === "Y") // 활성화된 구만 필터링
            .map((region) => ({
              id: region.guNo, // guNo -> id
              name: region.guName, // guName -> name
              lat: parseFloat(region.guMapY) || 0, // guMapY(위도) -> lat, 숫자 변환
              lng: parseFloat(region.guMapX) || 0, // guMapX(경도) -> lng, 숫자 변환
              cityNo: region.cityNo, // 추가 정보 보존
              cityName: region.cityName, // 추가 정보 보존
              status: region.guStatus, // 추가 정보 보존
            }))
            .filter((region) => region.lat !== 0 && region.lng !== 0);

          console.log("변환된 지역 데이터:", transformedRegions);

          // 데이터가 없는 경우 처리
          if (transformedRegions.length === 0) {
            throw new Error(
              "등록된 구 정보가 없습니다. 관리자에게 문의해주세요."
            );
          }

          setRegions(transformedRegions);
          setError(null);

          console.log(
            `총 ${transformedRegions.length}개의 구 데이터 로드 완료`
          );
        })
        .catch((err) => {
          console.error("지역 데이터를 불러오는 데 실패했습니다.", err);

          // 에러 타입별 처리
          if (err.response) {
            if (err.response.status === 404) {
              setError("구 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.");
            } else if (err.response.status >= 500) {
              setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            } else {
              setError(
                err.response.data?.message ||
                  "구 정보를 불러오는데 실패했습니다."
              );
            }
          } else if (err.request) {
            setError("네트워크 연결을 확인해주세요.");
          } else {
            setError(err.message || "알 수 없는 오류가 발생했습니다.");
          }
        })
        .finally(() => {
          // 로딩 종료
          setIsLoading(false);
        });
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    console.log("initialData 변경:", initialData);
    console.log("초기 선택된 지역:", initialData.selectedRegion);
    setSelectedRegion(initialData.selectedRegion || "");
  }, [initialData]);

  useEffect(() => {
    const apiKey = window.ENV?.GOOGLE_MAPS_API_KEY;

    const initMap = () => {
      if (
        window.google &&
        window.google.maps &&
        mapRef.current &&
        regions.length > 0
      ) {
        console.log("Google Maps 초기화 시작, 지역 개수:", regions.length);

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 34.6937, lng: 135.5023 }, // 오사카 중심 좌표
          zoom: 12,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        mapInstanceRef.current = map; // 맵 인스턴스 저장

        // 기존 마커들 제거
        markersRef.current.forEach((markerData) =>
          markerData.marker.setMap(null)
        );
        markersRef.current = [];

        // 각 지역에 대해 마커 생성
        regions.forEach((region) => {
          // 좌표가 유효한지 확인
          if (
            isNaN(region.lat) ||
            isNaN(region.lng) ||
            region.lat === 0 ||
            region.lng === 0
          ) {
            console.warn(`좌표가 유효하지 않은 지역 스킵 : ${region.name}`);
            return;
          }

          const marker = new window.google.maps.Marker({
            position: { lat: region.lat, lng: region.lng },
            map: map, // 마커가 표시될 맵
            title: region.name, // 마커 제목 (호버 시 표시)
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });

          marker.addListener("click", () => {
            handleRegionSelect(region.name, marker);
          });

          markersRef.current.push({ marker, regionName: region.name });
        });

        if (initialData.selectedRegion) {
          const initialMarker = markersRef.current.find(
            (item) => item.regionName === initialData.selectedRegion
          );
          if (initialMarker) {
            updateMarkerStyle(initialMarker.marker, true);
            selectedMarkerRef.current = initialMarker.marker;

            // 선택된 지역으로 맵 중심 이동
            const selectedRegionData = regions.find(
              (region) => region.name === initialData.selectedRegion
            );
            if (selectedRegionData) {
              map.panTo({
                lat: selectedRegionData.lat,
                lng: selectedRegionData.lng,
              });
              map.setZoom(14);
            }
          }
        }
      }
    };

    // 지역 데이터가 로드된 후 맵 초기화
    if (regions.length > 0) {
      if (apiKey) {
        if (window.google && window.google.maps) {
          initMap();
        } else {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = initMap;
          script.onerror = () => {
            console.error("Google Maps API 로드 실패");
            setError(
              "지도를 불러올 수 없습니다. 새로고침 후 다시 시도해주세요."
            );
          };
          document.head.appendChild(script); // 스크립트 추가

          // 컴포넌트 언마운트 시 스크립트 제거
          return () => {
            if (document.head.contains(script)) {
              document.head.removeChild(script);
            }
          };
        }
      } else {
        console.warn(
          "Google Maps API 키가 설정되지 않았습니다. 지도 없이 지역 목록만 표시됩니다."
        );
      }
    }
  }, [regions, initialData.selectedRegion]);

  // 마커 스타일 업데이트
  const updateMarkerStyle = (marker, isSelected) => {
    if (isSelected) {
      // 선택된 마커: 파란색, 큰 크기
      marker.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      });
    } else {
      // 기본 마커: 빨간색, 작은 크기
      marker.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(32, 32),
      });
    }
  };

  // 지역 선택 처리 함수
  const handleRegionSelect = (regionName, marker) => {
    console.log("지역 선택:", regionName);

    if (selectedMarkerRef.current) {
      updateMarkerStyle(selectedMarkerRef.current, false);
    }

    if (marker) {
      updateMarkerStyle(marker, true);
      selectedMarkerRef.current = marker;
    }

    setSelectedRegion(regionName);

    updateData(regionName);

    // 맵 중심을 선택된 지역으로 이동
    if (mapInstanceRef.current) {
      const selectedRegionData = regions.find(
        (region) => region.name === regionName
      );
      if (selectedRegionData) {
        mapInstanceRef.current.panTo({
          lat: selectedRegionData.lat,
          lng: selectedRegionData.lng,
        });
        mapInstanceRef.current.setZoom(14); // 줌 레벨 증가
      }
    }
  };

  const validateData = (selectedRegionName) => {
    const newErrors = { selectedRegion: "" };
    let isValid = true;

    if (!selectedRegionName) {
      newErrors.selectedRegion = "방문할 지역을 선택해주세요.";
      isValid = false;
    }

    setErrorsState(newErrors);
    return { isValid, errors: newErrors };
  };

  const updateData = (selectedRegionName) => {
    const validationResult = validateData(selectedRegionName);
    onDataChange({ selectedRegion: selectedRegionName });
    onValidationChange(validationResult.isValid);
  };

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">오사카 구 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 발생 시 UI
  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="text-red-800 font-medium mb-2">데이터 로드 실패</div>
          <div className="text-red-600 text-sm mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  // 메인 렌더링
  return (
    <div className="max-h-[600px] overflow-y-auto space-y-4">
      {/* 구글 맵 컨테이너 */}
      <div className="relative">
        <div
          ref={mapRef} // 맵이 렌더링될 DOM 요소
          className="w-full h-96 rounded-lg border border-gray-300 shadow-sm"
          style={{ minHeight: "384px" }} // 최소 높이 설정
        />
        {/* 맵 로딩 오버레이 */}
        {regions.length > 0 && !window.google && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-gray-600 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-sm">지도를 불러오는 중...</div>
            </div>
          </div>
        )}
      </div>

      {/* 선택된 지역 표시 */}
      {selectedRegion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            {/* 체크 아이콘 */}
            <div className="w-5 h-5 text-blue-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {/* 선택된 지역 텍스트 */}
            <span className="text-blue-800 font-medium text-sm">
              선택된 지역: {selectedRegion}
            </span>
          </div>
        </div>
      )}

      {/* 지역 목록 그리드 */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          오사카시 구(區) 목록 ({regions.length}개)
        </h3>
        {/* 4열 그리드로 지역 목록 표시 */}
        <div className="grid grid-cols-4 gap-1 text-xs">
          {regions.map((region) => (
            <div
              key={region.id} // 고유 키
              className={`p-1.5 rounded cursor-pointer transition-colors duration-200 text-center ${
                selectedRegion === region.name
                  ? "bg-blue-100 text-blue-800 font-medium" // 선택된 지역 스타일
                  : "bg-white text-gray-600 hover:bg-gray-100" // 기본 지역 스타일
              }`}
              onClick={() => {
                // 지역 클릭 시 해당 마커 찾아서 선택 처리
                const markerData = markersRef.current.find(
                  (item) => item.regionName === region.name
                );
                handleRegionSelect(region.name, markerData?.marker);
              }}
              title={`${region.name} (${region.cityName})`}
            >
              {region.name} {/* 지역 이름 표시 */}
            </div>
          ))}
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {showErrors && errors.selectedRegion && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-red-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-red-800 text-sm">
              {errors.selectedRegion}
            </span>
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="text-xs text-gray-500 text-center pb-2">
        지도의 마커를 클릭하거나 아래 지역 목록에서 선택해주세요.
      </div>
    </div>
  );
};

export default PlannerStep2;
