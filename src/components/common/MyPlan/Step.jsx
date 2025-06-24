import React, { useState } from "react";
import StepButton from "./StepButton";
import StepIndicator from "./StepIndicator";

const Step = () => {
  const [currentStep, SetCurrentStep] = useState(1); // 현재 활성화된 단계(스텝) 저장(초기값은 1)

  // 특정 스텝을 클릭했을 때 해당 스텝으로 이동
  const handleStepClick = (step) => {
    SetCurrentStep(step);
  };

  // 다음 단계로 이동
  const goToNextStep = () => {
    if (currentStep < 4) {
      SetCurrentStep(currentStep + 1);
    }
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    if (currentStep > 1) {
      SetCurrentStep(currentStep - 1);
    }
  };

  // 모든 단계 완료 시 실행
  const handleComplete = () => {
    alert("모든 단계가 완료되었습니다!!");
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
            currentStep={currentStep} // 현재 활성화된 단계 전달
            totalSteps={4} // 전체 단계 수 전달
            onStepClick={handleStepClick} // 단계 클릭 핸들러 전달
          />
        </div>

        {/* 스텝별 제목/부제목 영역 */}
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
              <div className="text-center text-gray-400">내용~~~~</div>
            )}
            {currentStep === 2 && (
              <div className="text-center text-gray-400">내용~~</div>
            )}
            {currentStep === 3 && (
              <div className="text-center text-gray-400">내용~~</div>
            )}
            {currentStep === 4 && (
              <div className="text-center text-gray-400">내용~~!</div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-auto">
          {currentStep > 1 && (
            <StepButton
              type="prev" // 이전 버튼 타입 설정
              onClick={goToPrevStep} // 이전 단계 이동 함수 연결
            />
          )}

          {currentStep < 4 && <StepButton type="next" onClick={goToNextStep} />}

          {/* 완료 버튼 >> 마지막 단계일떄만 */}
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
