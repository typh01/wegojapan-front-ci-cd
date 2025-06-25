import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const PlannerStep1 = forwardRef(({ onDataChange, initialData = {} }, ref) => {
  const [startDate, setStartDate] = useState(initialData.startDate || "");
  const [endDate, setEndDate] = useState(initialData.endDate || "");
  const [travelers, setTravelers] = useState(initialData.travelers || "");

  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
    travelers: "",
  });

  const [touched, setTouched] = useState({
    startDate: false,
    endDate: false,
    travelers: false,
  });

  // initialData가 변경될 때 상태 업데이트
  useEffect(() => {
    setStartDate(initialData.startDate || "");
    setEndDate(initialData.endDate || "");
    setTravelers(initialData.travelers || "");
  }, [initialData]);

  // 유효성 검사
  const validateData = (
    newStartDate,
    newEndDate,
    newTravelers,
    showAllErrors = false
  ) => {
    const newErrors = {
      startDate: "",
      endDate: "",
      travelers: "",
    };

    let isValid = true;

    if (showAllErrors || touched.startDate) {
      if (!newStartDate) {
        newErrors.startDate = "여행 시작일을 선택해주세요.";
        isValid = false;
      }
    }

    if (showAllErrors || touched.endDate) {
      if (!newEndDate) {
        newErrors.endDate = "여행 종료일을 선택해주세요.";
        isValid = false;
      } else if (newStartDate && newEndDate < newStartDate) {
        newErrors.endDate = "종료일은 시작일보다 늦어야 합니다.";
        isValid = false;
      }
    }

    if (showAllErrors || touched.travelers) {
      if (!newTravelers) {
        newErrors.travelers = "여행 인원을 입력해주세요.";
        isValid = false;
      } else if (parseInt(newTravelers) < 1) {
        newErrors.travelers = "최소 1명 이상이어야 합니다.";
        isValid = false;
      } else if (parseInt(newTravelers) > 20) {
        newErrors.travelers = "최대 20명까지 가능합니다.";
        isValid = false;
      }
    }

    setErrors(newErrors);

    return { isValid, errors: newErrors };
  };

  // 외부에서 호출할 수 있는 유효성 검사 함수 (Step.jsx에서 호출)
  const validateStep = () => {
    setTouched({
      startDate: true,
      endDate: true,
      travelers: true,
    });

    const result = validateData(startDate, endDate, travelers, true);

    if (!result.isValid) {
      const firstError = Object.values(result.errors).find(
        (error) => error !== ""
      );
      return {
        isValid: false,
        errorMessage: firstError || "모든 필드를 올바르게 입력해주세요.",
      };
    }

    return { isValid: true, errorMessage: "" };
  };

  useImperativeHandle(ref, () => ({
    validateStep,
    getData: () => ({ startDate, endDate, travelers }),
  }));

  const updateData = (newStartDate, newEndDate, newTravelers) => {
    validateData(newStartDate, newEndDate, newTravelers);

    onDataChange({
      startDate: newStartDate,
      endDate: newEndDate,
      travelers: newTravelers,
    });
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setTouched((prev) => ({ ...prev, startDate: true }));
    updateData(newStartDate, endDate, travelers);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    setTouched((prev) => ({ ...prev, endDate: true }));
    updateData(startDate, newEndDate, travelers);
  };

  const handleTravelersChange = (e) => {
    const newTravelers = e.target.value;
    setTravelers(newTravelers);
    setTouched((prev) => ({ ...prev, travelers: true }));
    updateData(startDate, endDate, newTravelers);
  };

  return (
    <div className="space-y-8">
      {/* 여행 시작일 입력 섹션 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {/* 달력 아이콘 */}
          <div className="w-5 h-5 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          {/* 여행 시작일 라벨 */}
          <label className="text-sm font-medium text-gray-700">
            여행 시작일
          </label>
        </div>
        {/* 여행 시작일 입력 필드 */}
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
            errors.startDate
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="연도 - 월 - 일"
        />
        {/* 시작일 에러 메시지 표시 */}
        {errors.startDate && (
          <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
        )}
      </div>

      {/* 여행 종료일 입력 섹션 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {/* 달력 아이콘 */}
          <div className="w-5 h-5 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          {/* 여행 종료일 라벨 */}
          <label className="text-sm font-medium text-gray-700">
            여행 종료일
          </label>
        </div>
        {/* 여행 종료일 입력 필드 */}
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate} // 시작일 이후의 날짜만 선택 가능
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
            errors.endDate
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="연도 - 월 - 일"
        />
        {/* 종료일 에러 메시지 표시 */}
        {errors.endDate && (
          <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
        )}
      </div>

      {/* 여행 인원 입력 섹션 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {/* 사람 아이콘 */}
          <div className="w-5 h-5 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          {/* 여행 인원 라벨 */}
          <label className="text-sm font-medium text-gray-700">여행 인원</label>
        </div>
        {/* 여행 인원 입력 필드 */}
        <input
          type="number"
          value={travelers}
          onChange={handleTravelersChange}
          min="1"
          max="20"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
            errors.travelers
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="최소1명, 최대20명 입력해주세요"
        />
        {/* 인원 에러 메시지 표시 */}
        {errors.travelers && (
          <p className="text-red-500 text-sm mt-1">{errors.travelers}</p>
        )}
      </div>
    </div>
  );
});
export default PlannerStep1;
