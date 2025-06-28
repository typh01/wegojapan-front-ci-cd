import React, { useState, useEffect } from "react";

const PlannerStep4 = ({
  onDataChange,
  onValidationChange,
  initialData = {},
  step1Data = {},
  step2Data = {},
  step3Data = {},
  showErrors = false,
}) => {
  const [planTitle, setPlanTitle] = useState(initialData.planTitle || "");
  const [planDescription, setPlanDescription] = useState(
    initialData.planDescription || ""
  );
  const [minBudget, setMinBudget] = useState(initialData.minBudget || "");
  const [maxBudget, setMaxBudget] = useState(initialData.maxBudget || "");
  const [flightLink, setFlightLink] = useState(initialData.flightLink || "");
  const [hotelLink, setHotelLink] = useState(initialData.hotelLink || "");

  const [errors, setErrors] = useState({
    planTitle: "",
    planDescription: "",
    minBudget: "",
    maxBudget: "",
    flightLink: "",
    hotelLink: "",
  });

  const recommendedSites = {
    flight: [
      { name: "스카이스캐너", url: "https://www.skyscanner.co.kr" },
      { name: "익스피디아", url: "https://www.expedia.co.kr" },
      { name: "모두투어", url: "https://www.modetour.com" },
      { name: "하나투어", url: "https://www.hanatour.com" },
    ],
    hotel: [
      { name: "부킹닷컴", url: "https://www.booking.com" },
      { name: "아고다", url: "https://www.agoda.com" },
      { name: "익스피디아", url: "https://www.expedia.co.kr" },
      { name: "야놀자", url: "https://www.yanolja.com" },
    ],
  };

  useEffect(() => {
    setPlanTitle(initialData.planTitle || "");
    setPlanDescription(initialData.planDescription || "");
    setMinBudget(initialData.minBudget || "");
    setMaxBudget(initialData.maxBudget || "");
    setFlightLink(initialData.flightLink || "");
    setHotelLink(initialData.hotelLink || "");
  }, [initialData]);

  const isValidUrl = (url) => {
    if (!url) return true; // 선택사항
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 유효성 검사
  const validateData = (
    title,
    description,
    minBudgetValue,
    maxBudgetValue,
    flightLinkValue,
    hotelLinkValue
  ) => {
    const newErrors = {
      planTitle: "",
      planDescription: "",
      minBudget: "",
      maxBudget: "",
      flightLink: "",
      hotelLink: "",
    };

    let isValid = true;

    // 플랜 제목 검사
    if (!title.trim()) {
      newErrors.planTitle = "플랜 제목을 입력해주세요.";
      isValid = false;
    } else if (title.trim().length < 2) {
      newErrors.planTitle = "플랜 제목은 최소 2글자 이상 입력해주세요.";
      isValid = false;
    } else if (title.trim().length > 50) {
      newErrors.planTitle = "플랜 제목은 최대 50글자까지 입력 가능합니다.";
      isValid = false;
    }

    // 플랜 설명 검사
    if (!description.trim()) {
      newErrors.planDescription = "플랜 설명을 입력해주세요.";
      isValid = false;
    } else if (description.trim().length < 10) {
      newErrors.planDescription = "플랜 설명은 최소 10글자 이상 입력해주세요.";
      isValid = false;
    } else if (description.trim().length > 500) {
      newErrors.planDescription =
        "플랜 설명은 최대 500글자까지 입력 가능합니다.";
      isValid = false;
    }

    // 예산 검사
    if (minBudgetValue && !/^\d+$/.test(minBudgetValue)) {
      newErrors.minBudget = "예산은 숫자만 입력 가능합니다.";
      isValid = false;
    } else if (minBudgetValue && parseInt(minBudgetValue) < 0) {
      newErrors.minBudget = "예산은 0원 이상 입력해주세요.";
      isValid = false;
    }

    if (maxBudgetValue && !/^\d+$/.test(maxBudgetValue)) {
      newErrors.maxBudget = "예산은 숫자만 입력 가능합니다.";
      isValid = false;
    } else if (maxBudgetValue && parseInt(maxBudgetValue) < 0) {
      newErrors.maxBudget = "예산은 0원 이상 입력해주세요.";
      isValid = false;
    }

    // 예산 범위 검사
    if (
      minBudgetValue &&
      maxBudgetValue &&
      parseInt(minBudgetValue) > parseInt(maxBudgetValue)
    ) {
      newErrors.maxBudget = "최대 예산은 최소 예산보다 커야 합니다.";
      isValid = false;
    }

    // URL 형식 검사
    if (flightLinkValue && !isValidUrl(flightLinkValue)) {
      newErrors.flightLink = "올바른 URL 형식으로 입력해주세요.";
      isValid = false;
    }

    if (hotelLinkValue && !isValidUrl(hotelLinkValue)) {
      newErrors.hotelLink = "올바른 URL 형식으로 입력해주세요.";
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const updateData = (
    title,
    description,
    minBudgetValue,
    maxBudgetValue,
    flightLinkValue,
    hotelLinkValue
  ) => {
    const validationResult = validateData(
      title,
      description,
      minBudgetValue,
      maxBudgetValue,
      flightLinkValue,
      hotelLinkValue
    );

    onDataChange({
      planTitle: title,
      planDescription: description,
      minBudget: minBudgetValue,
      maxBudget: maxBudgetValue,
      flightLink: flightLinkValue,
      hotelLink: hotelLinkValue,
    });

    onValidationChange(validationResult.isValid);
  };

  // 플랜 제목 변경
  const handlePlanTitleChange = (e) => {
    const newTitle = e.target.value;
    setPlanTitle(newTitle);
    updateData(
      newTitle,
      planDescription,
      minBudget,
      maxBudget,
      flightLink,
      hotelLink
    );
  };

  // 플랜 설명 변경
  const handlePlanDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setPlanDescription(newDescription);
    updateData(
      planTitle,
      newDescription,
      minBudget,
      maxBudget,
      flightLink,
      hotelLink
    );
  };

  // 최소 예산 변경
  const handleMinBudgetChange = (e) => {
    const newMinBudget = e.target.value;
    setMinBudget(newMinBudget);
    updateData(
      planTitle,
      planDescription,
      newMinBudget,
      maxBudget,
      flightLink,
      hotelLink
    );
  };

  // 최대 예산 변경
  const handleMaxBudgetChange = (e) => {
    const newMaxBudget = e.target.value;
    setMaxBudget(newMaxBudget);
    updateData(
      planTitle,
      planDescription,
      minBudget,
      newMaxBudget,
      flightLink,
      hotelLink
    );
  };

  // 항공편 링크 변경
  const handleFlightLinkChange = (e) => {
    const newFlightLink = e.target.value;
    setFlightLink(newFlightLink);
    updateData(
      planTitle,
      planDescription,
      minBudget,
      maxBudget,
      newFlightLink,
      hotelLink
    );
  };

  // 숙소 링크
  const handleHotelLinkChange = (e) => {
    const newHotelLink = e.target.value;
    setHotelLink(newHotelLink);
    updateData(
      planTitle,
      planDescription,
      minBudget,
      maxBudget,
      flightLink,
      newHotelLink
    );
  };

  // 추천 사이트 링크
  const handleRecommendedSiteClick = (url, type) => {
    if (type === "flight") {
      setFlightLink(url);
      updateData(
        planTitle,
        planDescription,
        minBudget,
        maxBudget,
        url,
        hotelLink
      );
    } else if (type === "hotel") {
      setHotelLink(url);
      updateData(
        planTitle,
        planDescription,
        minBudget,
        maxBudget,
        flightLink,
        url
      );
    }
  };

  // 여행 기간 계산
  const calculateTravelDuration = () => {
    if (step1Data.startDate && step1Data.endDate) {
      const startDate = new Date(step1Data.startDate);
      const endDate = new Date(step1Data.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="max-h-[500px] overflow-y-auto space-y-6">
      {/* 기본 정보 입력 섹션 */}
      <div className="space-y-6">
        {/* 플랜 제목 입력 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <label className="text-sm font-medium text-gray-700">
              플랜 제목 <span className="text-red-500">*</span>
            </label>
          </div>
          <input
            type="text"
            value={planTitle}
            onChange={handlePlanTitleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
              showErrors && errors.planTitle
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="최소2글자 이상, 최대50글자까지 입력해주세요."
            maxLength="50"
          />
          <div className="flex justify-between items-center text-xs">
            <span
              className={`${
                showErrors && errors.planTitle
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {showErrors && errors.planTitle ? errors.planTitle : "2-50글자"}
            </span>
            <span className="text-gray-400">{planTitle.length}/50</span>
          </div>
        </div>

        {/* 플랜 설명 입력 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <label className="text-sm font-medium text-gray-700">
              플랜 설명 <span className="text-red-500">*</span>
            </label>
          </div>
          <textarea
            value={planDescription}
            onChange={handlePlanDescriptionChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
              showErrors && errors.planDescription
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="여행 계획에 대한 간단한 설명을 입력해주세요. 최대 500글자까지 입력 가능합니다."
            maxLength="500"
          />
          <div className="flex justify-between items-center text-xs">
            <span
              className={`${
                showErrors && errors.planDescription
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {showErrors && errors.planDescription
                ? errors.planDescription
                : "10-500글자"}
            </span>
            <span className="text-gray-400">{planDescription.length}/500</span>
          </div>
        </div>
      </div>

      {/* 예산 정보 섹션 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <div className="w-5 h-5 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <span>예산 정보</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* 최소 예산 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">최소 예산(원)</label>
            <input
              type="number"
              value={minBudget}
              onChange={handleMinBudgetChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                showErrors && errors.minBudget
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="0"
              min="0"
            />
            {showErrors && errors.minBudget && (
              <p className="text-red-500 text-xs">{errors.minBudget}</p>
            )}
          </div>

          {/* 최대 예산 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">최대 예산(원)</label>
            <input
              type="number"
              value={maxBudget}
              onChange={handleMaxBudgetChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                showErrors && errors.maxBudget
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="0"
              min="0"
            />
            {showErrors && errors.maxBudget && (
              <p className="text-red-500 text-xs">{errors.maxBudget}</p>
            )}
          </div>
        </div>
      </div>

      {/* 예약 정보 섹션 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <div className="w-5 h-5 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <span>예약 정보</span>
        </h3>

        {/* 항공편 예약 링크 */}
        <div className="space-y-3">
          <label className="text-sm text-gray-600">✈️ 항공편 예약 링크</label>
          <input
            type="url"
            value={flightLink}
            onChange={handleFlightLinkChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
              showErrors && errors.flightLink
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="https://www.koreanair.com/booking"
          />
          {showErrors && errors.flightLink && (
            <p className="text-red-500 text-xs">{errors.flightLink}</p>
          )}

          {/* 항공편 추천 사이트 */}
          <div>
            <p className="text-xs text-gray-500 mb-2">
              추천 항공편 예약 사이트:
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendedSites.flight.map((site, index) => (
                <button
                  key={index}
                  onClick={() => handleRecommendedSiteClick(site.url, "flight")}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors duration-200"
                >
                  {site.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 숙소 예약 링크 */}
        <div className="space-y-3">
          <label className="text-sm text-gray-600">🏨 숙소 예약 링크</label>
          <input
            type="url"
            value={hotelLink}
            onChange={handleHotelLinkChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
              showErrors && errors.hotelLink
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="https://kr.trip.com/hotels/osaka-hotels-list-210"
          />
          {showErrors && errors.hotelLink && (
            <p className="text-red-500 text-xs">{errors.hotelLink}</p>
          )}

          {/* 숙소 추천 사이트 */}
          <div>
            <p className="text-xs text-gray-500 mb-2">추천 숙소 예약 사이트:</p>
            <div className="flex flex-wrap gap-2">
              {recommendedSites.hotel.map((site, index) => (
                <button
                  key={index}
                  onClick={() => handleRecommendedSiteClick(site.url, "hotel")}
                  className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors duration-200"
                >
                  {site.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 여행 정보 요약 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center space-x-2">
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
          <span>여행 계획 요약</span>
        </h3>

        <div className="space-y-3 text-sm">
          {/* 여행 기간 */}
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">여행 기간:</span>
            <span className="text-gray-700">
              {step1Data.startDate && step1Data.endDate
                ? `${step1Data.startDate} ~ ${
                    step1Data.endDate
                  } (${calculateTravelDuration()}일)`
                : "미설정"}
            </span>
          </div>

          {/* 여행 인원 */}
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">여행 인원:</span>
            <span className="text-gray-700">
              {step1Data.travelers ? `${step1Data.travelers}명` : "미설정"}
            </span>
          </div>

          {/* 방문 지역 */}
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">방문 지역:</span>
            <span className="text-gray-700">
              {step2Data.selectedRegion || "미설정"}
            </span>
          </div>

          {/* 방문 여행지 */}
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">방문 여행지:</span>
            <div className="text-gray-700">
              {step3Data.selectedPlaces && step3Data.selectedPlaces.length > 0
                ? step3Data.selectedPlaces
                    .map((place, index) => `${index + 1}. ${place.name}`)
                    .join(", ")
                : "미설정"}
            </div>
          </div>

          {/* 예산 정보 */}
          {(minBudget || maxBudget) && (
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-bold">예산:</span>
              <span className="text-gray-700">
                {minBudget && maxBudget
                  ? `${parseInt(minBudget).toLocaleString()}원 ~ ${parseInt(
                      maxBudget
                    ).toLocaleString()}원`
                  : minBudget
                  ? `${parseInt(minBudget).toLocaleString()}원 이상`
                  : `${parseInt(maxBudget).toLocaleString()}원 이하`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlannerStep4;
