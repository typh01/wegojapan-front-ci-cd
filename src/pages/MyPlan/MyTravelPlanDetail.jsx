import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Hotel,
  Map,
  Navigation,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import StatusButton from "../../components/common/MyPlan/StatusButton";
import StepButton from "../../components/common/MyPlan/StepButton";
import { AuthContext } from "../../components/Context/AuthContext";
import axios from "axios";

const API_BASE_URL = window.ENV?.API_URL + "/api";

const MyTravelPlanDetail = () => {
  const { planNo } = useParams();
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
  const [planDetail, setPlanDetail] = useState(null); // 플랜 상세 정보
  const [error, setError] = useState(null); // 에러 상태

  // 구글맵 관련 레퍼런
  const mapRef = useRef(null); // 지도 DOM 참조
  const mapInstanceRef = useRef(null); // 지도 인스턴스 참조
  const markersRef = useRef([]); // 마커 배열 참조

  // 수정 가능한 데이터 상태들
  const [editableData, setEditableData] = useState({
    planTitle: "",
    planDescription: "",
    transportReservationLink: "",
    accommodationLink: "",
  });

  const [editablePlaces, setEditablePlaces] = useState([]);

  // 인증 토큰을 가져오는 함수
  const getAuthToken = useCallback(() => {
    if (auth?.isAuthenticated && auth?.tokens) {
      const token =
        auth.tokens.accessToken || auth.tokens.authToken || auth.tokens.jwt;
      return token;
    }
    return null;
  }, [auth?.isAuthenticated, auth?.tokens]);

  // 구글 맵 초기화
  const setupGoogleMap = useCallback(() => {
    const apiKey = window.ENV?.GOOGLE_MAPS_API_KEY;

    // 지도 초기화 실행
    const initializeMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        try {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 34.6937, lng: 135.5023 },
            zoom: 12,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          });

          // 지도 인스턴스를 ref에 저장
          mapInstanceRef.current = map;

          // 지도 로드 완료 후 마커 업데이트
          if (editablePlaces && editablePlaces.length > 0) {
            renderMapMarkers(); // 즉시 마커 업데이트 시도

            // 지도 로드 완료 이벤트에서도 마커 업데이트
            google.maps.event.addListenerOnce(map, "idle", () => {
              renderMapMarkers();
            });
          }
        } catch (error) {
          console.error("Google Maps 초기화 실패:", error);
        }
      }
    };

    if (!apiKey) {
      console.warn("Google Maps API 키가 설정되지 않았습니다.");
      return;
    }

    // 구글 맵 API가 이미 로드되어 있는지 확인
    if (window.google && window.google.maps) {
      initializeMap(); // 지연 없이 즉시 초기화
    } else {
      // 구글 맵 API 스크립트 로드
      const existingScript = document.querySelector(
        `script[src*="maps.googleapis.com"]`
      );
      if (existingScript) {
        existingScript.addEventListener("load", initializeMap);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.defer = true; // 지연 로드

      script.onload = () => {
        initializeMap(); // 지연 없이 즉시 초기화
      };

      script.onerror = (error) => {
        console.error("Google Maps API 스크립트 로드 실패:", error);
      };

      document.head.appendChild(script); // 문서 헤드에 스크립트 추가

      // 컴포넌트 언마운트 시 스크립트 제거
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);
  // 지도 마커 초기화
  const removeAllMapMarkers = () => {
    // 기존 마커들을 지도에서 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };
  // 여행지들로 지도 마커 업데이트
  const renderMapMarkers = useCallback(() => {
    if (!mapInstanceRef.current || editablePlaces.length === 0) return;

    // 기존 마커 초기화
    removeAllMapMarkers();

    // 각 여행지에 순서가 표시된 마커 생성
    editablePlaces.forEach((place, index) => {
      // 위도, 경도가 유효한지 확인
      if (!isNaN(place.lat) && !isNaN(place.lng)) {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: mapInstanceRef.current,
          title: `${index + 1}. ${place.name}`,
          icon: {
            url: `http://maps.google.com/mapfiles/kml/paddle/${index + 1}.png`,
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h4 style="margin: 0 0 5px 0; font-weight: bold;">${index + 1}. ${
            place.name
          }</h4>
              <p style="margin: 0; font-size: 12px; color: #666;">${
                place.description
              }</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
      }
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (editablePlaces.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      editablePlaces.forEach((place) => {
        if (!isNaN(place.lat) && !isNaN(place.lng)) {
          bounds.extend({ lat: place.lat, lng: place.lng });
        }
      });

      // 즉시 지도 범위 조정
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [editablePlaces]);

  useEffect(() => {
    if (editablePlaces.length > 0) {
      setupGoogleMap();
    }
  }, [editablePlaces]);

  useEffect(() => {
    if (window.ENV?.GOOGLE_MAPS_API_KEY) {
      setupGoogleMap();
    }
  }, []);

  // 구글 맵 초기화
  useEffect(() => {
    // 지도가 초기화되고 여행지 데이터가 있을 때 즉시 마커 업데이트
    if (mapInstanceRef.current && editablePlaces.length > 0) {
      renderMapMarkers();
    } else if (mapInstanceRef.current) {
      removeAllMapMarkers();
    }
  }, [editablePlaces, renderMapMarkers]);

  const loadPlanDetailFromAPI = useCallback(() => {
    const token = getAuthToken();

    if (!token) {
      setError("인증 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setError(null);

    const apiUrl = `${API_BASE_URL}/my-plans/${planNo}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
        withCredentials: true,
      })
      .then((response) => {
        const responseData = response.data?.data;
        if (response.data?.code === "200" && responseData) {
          setPlanDetail(responseData);

          let places = (responseData.selectedPlaces || []).map(
            (place, index) => ({
              id: place.travelId,
              name: place.travelName,
              lat: parseFloat(place.mapY),
              lng: parseFloat(place.mapX),
              description: place.travelDescription || "설명 없음",
              order: place.choiceOrder || index + 1,
            })
          );

          // choiceOrder 기준으로 정렬하여 올바른 순서 유지
          places.sort((a, b) => a.order - b.order);

          setEditablePlaces(places);

          setEditableData({
            planTitle: responseData.planTitle || "",
            planDescription: responseData.planDescription || "",
            transportReservationLink:
              responseData.transportReservationLink || "",
            accommodationLink: responseData.accommodationLink || "",
          });
        } else {
          throw new Error(
            response.data?.message ||
              "플랜 상세 정보를 불러오는 데 실패했습니다."
          );
        }
      })
      .catch((error) => {
        let errorMessage = "플랜 상세 정보를 불러오는 중 오류가 발생했습니다.";

        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
            logout();
          }
          if (error.response.status === 403) {
            errorMessage = "해당 플랜에 접근할 권한이 없습니다.";
          }
          setError(errorMessage);
          setPlanDetail(null);
        }
      });
  }, [planNo, getAuthToken, logout]);

  useEffect(() => {
    if (auth?.isAuthenticated && planNo) {
      loadPlanDetailFromAPI();
    } else if (!auth?.isLoading && !auth?.isAuthenticated) {
      setError("로그인이 필요한 서비스입니다.");
    }
  }, [planNo, auth?.isAuthenticated, auth?.isLoading, loadPlanDetailFromAPI]);

  // 여행지 순서 위로 이동
  const movePlaceUp = (index) => {
    if (index > 0) {
      const newPlaces = [...editablePlaces];
      [newPlaces[index - 1], newPlaces[index]] = [
        newPlaces[index],
        newPlaces[index - 1],
      ];
      newPlaces.forEach((place, idx) => {
        place.order = idx + 1;
      });
      setEditablePlaces(newPlaces);
    }
  };

  // 여행지 순서 아래로 이동
  const movePlaceDown = (index) => {
    if (index < editablePlaces.length - 1) {
      const newPlaces = [...editablePlaces];
      [newPlaces[index], newPlaces[index + 1]] = [
        newPlaces[index + 1],
        newPlaces[index],
      ];
      newPlaces.forEach((place, idx) => {
        place.order = idx + 1;
      });
      setEditablePlaces(newPlaces);
    }
  };
  // 목록으로 돌아가기
  const navigateToList = () => {
    navigate("/myplan/list");
  };

  // 수정 모드
  const startEditMode = () => {
    setIsEditMode(true);
  };

  // 수정 취소
  const cancelEditMode = () => {
    // 원래 데이터로 복구
    if (planDetail) {
      // 여행지 목록도 원래 데이터로 복구
      const places = (planDetail.selectedPlaces || []).map((place, index) => ({
        id: place.travelId,
        name: place.travelName,
        lat: parseFloat(place.mapY),
        lng: parseFloat(place.mapX),
        description: place.travelDescription || "설명 없음",
        order: place.choiceOrder || index + 1,
      }));

      // 원래 순서대로 정렬
      places.sort((a, b) => a.order - b.order);

      setEditablePlaces(places);

      setEditableData({
        planTitle: planDetail.planTitle || "",
        planDescription: planDetail.planDescription || "",
        transportReservationLink: planDetail.transportReservationLink || "",
        accommodationLink: planDetail.accommodationLink || "",
      });
    }

    setIsEditMode(false);
  };

  // 수정 저장 함수
  const savePlanEditChanges = () => {
    // 유효성 검사
    if (!editableData.planTitle.trim()) {
      alert("여행 제목을 입력해주세요.");
      return;
    }

    if (!editableData.planDescription.trim()) {
      alert("여행 설명을 입력해주세요.");
      return;
    }

    if (
      editableData.transportReservationLink &&
      !editableData.transportReservationLink.startsWith("http")
    ) {
      alert("항공편 링크는 http:// 또는 https://로 시작해야 합니다.");
      return;
    }

    if (
      editableData.accommodationLink &&
      !editableData.accommodationLink.startsWith("http")
    ) {
      alert("숙소 링크는 http:// 또는 https://로 시작해야 합니다.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("인증 정보가 없습니다. 다시 로그인해주세요.");
      logout();
      return;
    }

    const updateData = {
      planTitle: editableData.planTitle,
      planDescription: editableData.planDescription,
      transportReservationLink: editableData.transportReservationLink,
      accommodationLink: editableData.accommodationLink,
      selectedPlaces: editablePlaces.map((place, index) => ({
        travelId: place.id,
        choiceOrder: index + 1,
      })),
    };

    axios
      .put(`${API_BASE_URL}/my-plans/${planNo}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
        withCredentials: true,
      })
      .then((response) => {
        if (response.data?.code === "200") {
          alert("여행 플랜이 성공적으로 수정되었습니다!");
          setIsEditMode(false); // 수정 모드 해제
          // 수정된 데이터로 다시 로드
          loadPlanDetailFromAPI();
        } else {
          throw new Error(
            response.data?.message || "플랜 수정에 실패했습니다."
          );
        }
      })
      .catch((error) => {
        let errorMessage = "플랜 수정 중 오류가 발생했습니다.";

        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
            logout();
          } else if (error.response.status === 403) {
            errorMessage = "해당 플랜을 수정할 권한이 없습니다.";
          } else {
            errorMessage =
              error.response.data?.message ||
              `서버 에러 (${error.response.status})`;
          }
        }

        alert(errorMessage);
      });
  };

  // 플랜 삭제
  const deletePlanCompletely = () => {
    const isConfirmed = window.confirm(
      `"${editableData.planTitle}" 플랜을 정말로 삭제하시겠습니까?\n\n삭제된 플랜은 복구할 수 없습니다.`
    );

    if (isConfirmed) {
      const token = getAuthToken();
      if (!token) {
        alert("인증 정보가 없습니다. 다시 로그인해주세요.");
        logout();
        return;
      }

      axios
        .delete(`${API_BASE_URL}/my-plans/${planNo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 15000,
          withCredentials: true,
        })
        .then((response) => {
          if (response.data?.code === "200") {
            alert("여행 플랜이 성공적으로 삭제되었습니다!");
            navigate("/myplan/list");
          } else {
            throw new Error(
              response.data?.message || "플랜 삭제에 실패했습니다."
            );
          }
        })
        .catch((error) => {
          let errorMessage = "플랜 삭제 중 오류가 발생했습니다.";

          if (error.response) {
            if (error.response.status === 401) {
              errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
              logout();
            } else if (error.response.status === 403) {
              errorMessage = "해당 플랜을 삭제할 권한이 없습니다.";
            } else {
              errorMessage =
                error.response.data?.message ||
                `서버 에러 (${error.response.status})`;
            }
          }

          alert(errorMessage);
        });
    }
  };

  // 입력 필드 값 변경 처리
  const updateInputValue = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 날짜 포맷팅
  const formatDateString = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "잘못된 날짜";
      return `${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일`;
    } catch (error) {
      return "날짜 오류";
    }
  };

  // 예산 포맷팅
  const formatBudgetRange = (minBudget, maxBudget) => {
    if (!minBudget && !maxBudget) return "예산 미설정";
    if (minBudget && maxBudget) {
      return `${minBudget.toLocaleString()}원 ~ ${maxBudget.toLocaleString()}원`;
    }
    if (minBudget) return `${minBudget.toLocaleString()}원 이상`;
    if (maxBudget) return `${maxBudget.toLocaleString()}원 이하`;
    return "예산 미설정";
  };

  // 에러가 있거나 플랜 정보가 없는 경우
  if (error || !planDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">
            {error || "플랜 정보를 찾을 수 없습니다."}
          </div>
          <button
            onClick={navigateToList}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-sm">
        {/* 헤더 영역 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {isEditMode ? (
              <input
                type="text"
                value={editableData.planTitle}
                onChange={(e) => updateInputValue("planTitle", e.target.value)}
                className="text-xl font-semibold text-gray-800 border border-gray-300 rounded px-3 py-1 flex-1 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="여행 제목을 입력하세요"
              />
            ) : (
              <h1 className="text-xl font-semibold text-gray-800">
                {editableData.planTitle}
              </h1>
            )}

            <button
              onClick={navigateToList}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isEditMode}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">목록으로</span>
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <StatusButton
                type={
                  planDetail.planStatus === "예정"
                    ? "planned"
                    : planDetail.planStatus === "완료"
                    ? "completed"
                    : "ongoing"
                }
                isActive={true}
              >
                {planDetail.planStatus}
              </StatusButton>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <div>
                <span className="font-medium">생성일:</span>{" "}
                {formatDateString(planDetail.createDate)}
              </div>
              <div>
                <span className="font-medium">수정일:</span>{" "}
                {formatDateString(planDetail.updateDate)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* 여행 정보 영역 */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              여행 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-3 text-blue-600" />
                <span className="font-medium text-gray-700 mr-2">
                  선택된 지역:
                </span>
                <span className="text-gray-600">
                  {planDetail.selectedRegion ||
                    planDetail.selectRegion ||
                    "미지정"}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                <span className="font-medium text-gray-700 mr-2">
                  여행 기간:
                </span>
                <span className="text-gray-600">
                  {formatDateString(planDetail.travelStartDate)} ~{" "}
                  {formatDateString(planDetail.travelEndDate)}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-3 text-blue-600" />
                <span className="font-medium text-gray-700 mr-2">
                  여행 인원:
                </span>
                <span className="text-gray-600">{planDetail.groupSize}명</span>
              </div>

              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-3 text-blue-600" />
                <span className="font-medium text-gray-700 mr-2">
                  예상 예산:
                </span>
                <span className="text-gray-600">
                  {formatBudgetRange(
                    planDetail.minBudget,
                    planDetail.maxBudget
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700 text-sm">
                  여행 설명:
                </span>
              </div>
              {isEditMode ? (
                <textarea
                  value={editableData.planDescription}
                  onChange={(e) =>
                    updateInputValue("planDescription", e.target.value)
                  }
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="3"
                  placeholder="여행에 대한 설명을 입력하세요"
                />
              ) : (
                <p className="text-gray-600 text-sm mt-1">
                  {editableData.planDescription || "설명이 없습니다."}
                </p>
              )}
            </div>
          </div>

          {/* 예약 정보 영역 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              예약 정보
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Plane className="w-4 h-4 mr-2 text-gray-600" />
                  항공편 링크:
                </span>
                {isEditMode ? (
                  <input
                    type="url"
                    value={editableData.transportReservationLink}
                    onChange={(e) =>
                      updateInputValue(
                        "transportReservationLink",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    placeholder="https://example.com/flight"
                  />
                ) : editableData.transportReservationLink ? (
                  <a
                    href={editableData.transportReservationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    항공편 확인하기
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">링크 없음</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Hotel className="w-4 h-4 mr-2 text-gray-600" />
                  숙소 링크:
                </span>
                {isEditMode ? (
                  <input
                    type="url"
                    value={editableData.accommodationLink}
                    onChange={(e) =>
                      updateInputValue("accommodationLink", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    placeholder="https://example.com/hotel"
                  />
                ) : editableData.accommodationLink ? (
                  <a
                    href={editableData.accommodationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    숙소 확인하기
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">링크 없음</span>
                )}
              </div>
            </div>
          </div>

          {editablePlaces.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Map className="w-5 h-5 mr-2 text-gray-600" />
                여행지 지도
              </h2>

              {/* API 키 확인 */}
              {!window.ENV?.GOOGLE_MAPS_API_KEY ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-yellow-600 mr-2">⚠️</div>
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">
                        Google Maps API 키가 설정되지 않았습니다.
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        지도를 표시하려면 환경 설정에서 GOOGLE_MAPS_API_KEY를
                        설정해주세요.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <div
                      ref={mapRef}
                      className="w-full h-96"
                      style={{ minHeight: "400px", backgroundColor: "#f8f9fa" }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 여행지 목록 영역 */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2 text-gray-600" />
              여행지 목록 ({editablePlaces.length}개)
              {isEditMode && (
                <span className="text-sm text-gray-600 ml-2">
                  (순서 변경 가능)
                </span>
              )}
            </h2>
            {editablePlaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editablePlaces.map((place, index) => (
                  <div
                    key={place.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      {/* 순서 번호 */}
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>

                      {/* 여행지 정보 */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm mb-1">
                          {place.name}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {place.description}
                        </p>
                      </div>

                      {/* 수정 모드일 때만 순서 변경 버튼 표시 */}
                      {isEditMode && (
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => movePlaceUp(index)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="위로 이동"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => movePlaceDown(index)}
                            disabled={index === editablePlaces.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="아래로 이동"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Navigation className="w-8 h-8 mx-auto mb-4 text-gray-300" />
                <p>선택된 여행지가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between">
              <div>
                {!isEditMode && (
                  <StepButton type="prev" onClick={deletePlanCompletely}>
                    플랜삭제
                  </StepButton>
                )}
              </div>

              {/* 오른쪽 : 수정/저장/취소 버튼 */}
              <div className="flex space-x-3">
                {isEditMode ? (
                  <>
                    <StepButton type="prev" onClick={cancelEditMode}>
                      취소하기
                    </StepButton>
                    <StepButton type="next" onClick={savePlanEditChanges}>
                      저장
                    </StepButton>
                  </>
                ) : (
                  <StepButton type="next" onClick={startEditMode}>
                    수정하기
                  </StepButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTravelPlanDetail;
