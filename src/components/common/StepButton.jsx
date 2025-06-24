import React from "react";

const StepButton = ({
  type = "next", // type의 기본값
  onClick, // 버튼 클릭 시 실행할 함수
  className = "", // 외부에서 전달되는 테일윈드 클래스
  children, // 버튼안에 표시될 거
}) => {
  const defaultText = type === "next" ? "다음단계" : "이전단계";

  const backgroundClass =
    type === "next"
      ? "bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)]"
      : "bg-[linear-gradient(180deg,_rgba(150,152,154,0.95),_rgba(150,152,154,0.95))]";

  const buttonClasses = [
    "flex",
    "w-[79px]",
    "px-2 py-2",
    "justify-center",
    "items-center",
    "gap-[10px]",
    "rounded-[16px]",
    backgroundClass,
    "text-white text-sm font-medium",
    "transition-all duration-200",
    "cursor-pointer hover:opacity-80 active:scale-95",
    className,
  ].join(" ");

  return (
    <button type="button" className={buttonClasses} onClick={onClick}>
      {children || defaultText}
    </button>
  );
};
export default StepButton;
