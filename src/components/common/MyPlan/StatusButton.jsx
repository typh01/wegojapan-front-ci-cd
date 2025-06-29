import React from "react";

const StatusButton = ({
  type = "planned", // planned(예정), completed(완료)
  onClick,
  children,
  className = "",
  isActive = false,
}) => {
  // 타입별 기본 텍스트 설정
  const defaultText = {
    planned: "예정",
    completed: "완료",
  };

  const getButtonClasses = () => {
    const baseClasses =
      "flex justify-center items-center transition-all duration-200 cursor-pointer hover:opacity-80 active:scale-95";

    switch (type) {
      case "planned":
        return `${baseClasses} w-[83px] h-[28px] px-4 rounded-[15px] ${
          isActive ? "bg-[#00A79F]" : "bg-gray-300"
        } text-white text-sm font-medium`;

      case "completed":
        return `${baseClasses} w-[81px] px-[17px] pb-[3px] rounded-[15px] ${
          isActive ? "bg-[#9FA1A8]" : "bg-gray-300"
        } text-white text-sm font-medium`;

      default:
        return baseClasses;
    }
  };

  return (
    <button
      type="button"
      className={`${getButtonClasses()} ${className}`}
      onClick={onClick}
    >
      {children || defaultText[type]}
    </button>
  );
};

export default StatusButton;
