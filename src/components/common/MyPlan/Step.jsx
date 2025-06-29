import React, { useState, useEffect } from "react";
import StepButton from "./StepButton";
import StepIndicator from "./StepIndicator";
import PlannerStep1 from "../../../pages/MyPlan/PlannerStep1";
import PlannerStep2 from "../../../pages/MyPlan/PlannerStep2";
import PlannerStep3 from "../../../pages/MyPlan/PlannerStep3";

const Step = () => {
  // "나의 플랜 세우기" 페이지의 고유 식별자
  const PAGE_KEY = "myPlanPage";

  // 몇번째 스텝인지 sessionStorage에서 불러오기(없으면 기본값 1로~)
  const [currentStep, SetCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem(`${PAGE_KEY}_currentStep`);
    return savedStep ? parseInt(savedStep) : 1;
  });

  // 저장된 step1의 데이터 상태 불러오기(없으면 기본값으로)
  const [step1Data, setStep1Data] = useState(() => {
    const savedData = sessionStorage.getItem(`${PAGE_KEY}_step1Data`);
    return savedData
      ? JSON.parse(savedData)
      : {
          startDate: "",
          endDate: "",
          travelers: "",
        };
  });

  // step2 데이터의 상태 불러오기
  const [step2Data, setStep2Data] = useState(() => {
    const savedData = sessionStorage.getItem(`${PAGE_KEY}_step2Data`);
    return savedData
      ? JSON.parse(savedData)
      : {
          selectedRegion: "",
        };
  });

  // step3의 데이터 상태 불러오기
  const [step3Data, setStep3Data] = useState(() => {
    const savedData = sessionStorage.getItem(`${PAGE_KEY}_step3Data`);
    return savedData
      ? JSON.parse(savedData)
      : {
          selectedPlaces: [],
        };
  });
  // TODO step4의 데이터 상태도 넣어야함!!!!!!

  // step의 유효성 검사 상태 관리
  const [step1Valid, setStep1Valid] = useState(false);
  const [step2Valid, setStep2Valid] = useState(false);
  const [step3Valid, setStep3Valid] = useState(false);
  // TODO step4의 유효성 검사 상태도 넣어야함

  // step의 에러 메시지 표시 상태 관리
  const [showStep1Errors, setShowStep1Errors] = useState(false);
  const [showStep2Errors, setShowStep2Errors] = useState(false);
  const [showStep3Errors, setShowStep3Errors] = useState(false);
  // TODO  step4 데이터 상태도 넣어야함!!!!!!

  // currentStep이 변경 -> 세션스토리지에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_currentStep`, currentStep.toString());
  }, [currentStep]);

  // step의 Data가 변경 ->  세션스토리지에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_step1Data`, JSON.stringify(step1Data));
  }, [step1Data]);

  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_step2Data`, JSON.stringify(step2Data));
  }, [step2Data]);

  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_step3Data`, JSON.stringify(step3Data));
  }, [step3Data]);
  // TODO step4의 데이터 변경 시 session에 저장하는 것도 추가하기

  // 각각의 step의 데이터가 변경될 떄 호출
  const handleStep1DataChange = (data) => {
    setStep1Data(data);
    setShowStep1Errors(false); // 데이터가 변경되면 에러 메시지 숨김
  };

  const handleStep2DataChange = (data) => {
    setStep2Data(data);
  };

  const handleStep3DataChange = (data) => {
    setStep3Data(data);
  };

  // Step의 유효성 검사 결과 변경되면 호출
  const handleStep1ValidationChange = (isValid) => {
    setStep1Valid(isValid); // 유효성 검사 결과 업데이트
  };

  const handleStep2ValidationChange = (isValid) => {
    setStep2Valid(isValid);
  };

  const handleStep3ValidationChange = (isValid) => {
    setStep3Valid(isValid);
  };
  // TODO step3, step4도 만들면 추가하기

  // 다음 단계로 넘어갈때의 유효성 검사
  // 현재 스텝에 따라 해당 스텝의 유효성 검사 함수 호출
  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!step1Valid) {
        setShowStep1Errors(true);
        return;
      }
    } else if (currentStep === 2) {
      if (!step2Valid) {
        setShowStep2Errors(true);
        return;
      }
    } else if (currentStep === 3) {
      if (!step3Valid) {
        setShowStep3Errors(true);
        return;
      }
    }
    // TODO step4 유효성 검사 추가 예정

    if (currentStep < 4) {
      SetCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      SetCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    alert("모든 단계가 완료되었습니다!!");
    clearSessionStorageData();
  };

  // 세션스토리지 데이터 초기화
  const clearSessionStorageData = () => {
    sessionStorage.removeItem(`${PAGE_KEY}_currentStep`);
    sessionStorage.removeItem(`${PAGE_KEY}_step1Data`);
    sessionStorage.removeItem(`${PAGE_KEY}_step2Data`);
    sessionStorage.removeItem(`${PAGE_KEY}_step3Data`);
    // TODO step4 초기화 추가

    // 모든 상태 초기화
    SetCurrentStep(1);
    setStep1Data({
      startDate: "",
      endDate: "",
      travelers: "",
    });
    setStep2Data({
      selectedRegion: "",
    });
    setStep3Data({
      selectedPlaces: [],
    });
    // TODO step4 상태 초기화 추가하기

    // Step 유효성 검사 상태 초기화
    setStep1Valid(false);
    setStep2Valid(false);
    setStep3Valid(false);

    // 에러 메시지 표시 상태 초기화
    setShowStep1Errors(false);
    setShowStep2Errors(false);
    setShowStep3Errors(false);
    // TODO step4 상태 초기화 추가하기
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-6">
      <div className="w-full max-w-[1294px] min-h-[834px] flex-shrink-0 rounded-[20px] bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.10)] p-8 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            오사카 여행 플래너
          </h1>
        </div>

        <div className="mb-8">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={4}
            onStepClick={null}
          />
        </div>

        <div className="mb-4 text-center">
          {currentStep === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                언제 오사카로 떠나시나요?
              </h2>
              <p className="text-gray-600">
                여행 날짜와 인원수를 선택해주세요.
              </p>
            </>
          )}
          {currentStep === 2 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                오사카의 어느 지역을 둘러보시겠어요?
              </h2>
              <p className="text-gray-600">관심 있는 지역을 선택해주세요.</p>
            </>
          )}
          {currentStep === 3 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                오사카에서 어디를 방문하시겠어요?
              </h2>
              <p className="text-gray-600">최대 5개까지 선택가능합니다.</p>
            </>
          )}
          {currentStep === 4 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                여행 계획을 완성해주세요.
              </h2>
              <p className="text-gray-600">
                플랜제목과 추가 정보를 입력해주세요.
              </p>
            </>
          )}
        </div>

        {/* 스텝별 컨텐츠 내용 */}
        <div className="mb-8 flex-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {currentStep === 1 && (
              <PlannerStep1
                onDataChange={handleStep1DataChange}
                onValidationChange={handleStep1ValidationChange}
                initialData={step1Data}
                showErrors={showStep1Errors}
              />
            )}
            {currentStep === 2 && (
              <PlannerStep2
                onDataChange={handleStep2DataChange}
                onValidationChange={handleStep2ValidationChange}
                initialData={step2Data}
                showErrors={showStep2Errors}
              />
            )}
            {currentStep === 3 && (
              <PlannerStep3
                onDataChange={handleStep3DataChange}
                onValidationChange={handleStep3ValidationChange}
                initialData={step3Data}
                selectedRegion={step2Data.selectedRegion} // 2단계에서 선택한 지역 정보 전달
                showErrors={showStep3Errors}
              />
            )}
            {/* TODO step4의 컴포넌트 추가하기 */}
            {currentStep === 4 && (
              <div className="text-center text-gray-400">플랜완성 내용~~!</div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-4 pb-2">
          {currentStep > 1 && <StepButton type="prev" onClick={goToPrevStep} />}

          {currentStep < 4 && <StepButton type="next" onClick={goToNextStep} />}

          {currentStep === 4 && (
            <StepButton type="next" onClick={handleComplete}>
              완료
            </StepButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step;
