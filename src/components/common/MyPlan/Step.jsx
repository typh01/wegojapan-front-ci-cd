import React, { useState, useEffect, useRef } from "react";
import StepButton from "./StepButton";
import StepIndicator from "./StepIndicator";
import PlannerStep1 from "../../../pages/MyPlan/PlannerStep1";

const Step = () => {
  // "나의 플랜 세우기" 페이지의 고유 식별자
  const PAGE_KEY = "myPlanPage";

  // 각 스텝 컴포넌트에 대한 ref (유효성 검사 함수 호출용)
  const step1Ref = useRef(null);
  // ====================step2, step3, step4의 ref 추가 하기 ====================

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
  // ====================step2, step3, step4 데이터 상태 추가====================

  // currentStep이 변경 -> 세션스토리지에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_currentStep`, currentStep.toString());
  }, [currentStep]);

  // step1Data가 변경 ->  세션스토리지에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_step1Data`, JSON.stringify(step1Data));
  }, [step1Data]);
  // ====================step2, step3, step4 저장도 추가하기====================

  // PlannerStep1에서 데이터가 변경될 경우
  const handleStep1DataChange = (data) => {
    setStep1Data(data);
  };
  // ====================step2, step3, step4 데이터 변경 핸들러 추가 ====================

  // 다음 단계로 넘어갈때의 유효성 검사
  // 현재 스텝에 따라 해당 스텝의 유효성 검사 함수 호출
  const goToNextStep = () => {
    if (currentStep === 1) {
      if (step1Ref.current) {
        const validationResult = step1Ref.current.validateStep();
        if (!validationResult.isValid) {
          alert(validationResult.errorMessage);
          return; // 다음 단계로 이동하지 않음
        }
      } else {
        alert("데이터를 입력해주세요.");
        return;
      }
    }
    // ====================step2, step3, step4 유효성 검사 추가 예정====================

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
    // ====================step2, step3, step4 초기화 추가====================

    // 모든 상태 초기화
    SetCurrentStep(1);
    setStep1Data({
      startDate: "",
      endDate: "",
      travelers: "",
    });
    // ====================step2, step3, step4 상태 초기화 추가하기 ====================
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-[1294px] h-[834px] flex-shrink-0 rounded-[20px] bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.10)] p-8 flex flex-col">
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
          <div className="bg-white p-6 rounded-lg shadow-sm border h-full flex flex-col justify-center">
            {currentStep === 1 && (
              <PlannerStep1
                ref={step1Ref}
                onDataChange={handleStep1DataChange}
                initialData={step1Data}
              />
            )}

            {currentStep === 2 && (
              <div className="text-center text-gray-400">지역선택 내용~~~~</div>
            )}

            {currentStep === 3 && (
              <div className="text-center text-gray-400">방문지선택 내용~~</div>
            )}
            {currentStep === 4 && (
              <div className="text-center text-gray-400">플랜완성 내용~~!</div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-auto">
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
