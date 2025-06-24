import React from "react";

const StepIndicator = ({
  currentStep = 1, // 현재 스텝 값
  totalSteps = 4, // 전체 스텝 값
  onStepClick = null, // 스텝 클릭 시 실행될 함수
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {[...Array(totalSteps).keys()].map((i) => {
        const stepNumber = i + 1; // 스텝 번호(1부처~)
        const isActive = stepNumber <= currentStep; // 현재 스텝이거나 이미 지나간 스텝인지 확인

        return (
          <React.Fragment key={stepNumber}>
            {" "}
            {/* key를 이용하여 리액트의 Fragment로 그룹핑 */}
            <div
              onClick={onStepClick ? () => onStepClick(stepNumber) : undefined}
              className={`
                        flex flex-col justify-center items-center 
                        w-8 h-8 
                        rounded-2xl
                        flex-shrink-0
                        transition-all duration-300 ease-in-out
                        text-white font-medium text-sm
                        ${onStepClick ? "cursor-pointer" : "cursor-default"} 
                        ${
                          isActive
                            ? "shadow-lg transform scale-105"
                            : "hover:scale-105"
                        }
                    `}
              style={{
                background: isActive
                  ? "linear-gradient(100deg, rgba(115, 179, 223, 0.95) -49.53%, rgba(97, 160, 212, 0.95) 24.57%, rgba(118, 217, 228, 0.95) 129.21%)"
                  : "#96989A",
              }}
            >
              {stepNumber}
            </div>
            {/* 스텝 사이사이의 연결선 */}
            {stepNumber < totalSteps && (
              <div
                className={`
                w-12 h-0.5 
                transition-colors duration-300
                ${stepNumber < currentStep ? "bg-blue-300" : "bg-gray-300"}
                        `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default StepIndicator;
