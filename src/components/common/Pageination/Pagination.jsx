import React from "react";

const Pagination = ({
  currentPage = 1, // 현재 페이지 번호
  totalPages = 1, // 전체 페이지 수
  onPageChange, // 페이지 변경 시 호출되는 함숭
  maxVisiblePages = 5, // 한번에 보여줄 페이지 번호 개수
  className = "",
}) => {
  // 현재 페이지를 가운데에 두고.. 좌우로 균등하게 페이지 번호를 배치
  // 페이징에서 보여줄 패이지 번호들 계산
  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2)); // 시작 페이지 계산
    const end = Math.min(totalPages, start + maxVisiblePages - 1); // 끝 페이지

    // 페이지 번호 배열 생성
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 이전 페이지로 이동(<)
  const goToPrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 첫 페이지로 이동(<<)
  const goToFirst = () => {
    onPageChange(1);
  };

  // 다음 페이지로 이동(>)
  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 마지막 페이지로 이동(>>)
  const goToLast = () => {
    onPageChange(totalPages);
  };

  // 특정 페이지로 이동
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* << */}
      <button
        onClick={goToFirst}
        disabled={currentPage === 1} // 현재 페이지가 1일 때 비활성화
        className={`flex w-[30px] h-[33px] flex-col justify-center items-center gap-[10px] flex-shrink-0 rounded-[16px] text-sm font-medium transition-all duration-200 ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)] text-white hover:opacity-80 active:scale-95"
        }`}
      >
        ≪
      </button>

      {/* < */}
      <button
        onClick={goToPrev}
        disabled={currentPage === 1}
        className={`flex w-[30px] h-[33px] flex-col justify-center items-center gap-[10px] flex-shrink-0 rounded-[16px] text-sm font-medium transition-all duration-200 ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)] text-white hover:opacity-80 active:scale-95"
        }`}
      >
        ‹
      </button>

      {/* 페이지 번호들을 순회하며 각각 버튼으로 생성 */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`flex w-[30px] h-[33px] flex-col justify-center items-center gap-[10px] flex-shrink-0 rounded-[16px] text-sm font-medium transition-all duration-200 hover:opacity-80 active:scale-95 ${
            page === currentPage
              ? "bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* > */}
      <button
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className={`flex w-[30px] h-[33px] flex-col justify-center items-center gap-[10px] flex-shrink-0 rounded-[16px] text-sm font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)] text-white hover:opacity-80 active:scale-95"
        }`}
      >
        ›
      </button>

      {/* >> */}
      <button
        onClick={goToLast}
        disabled={currentPage === totalPages}
        className={`flex w-[30px] h-[33px] flex-col justify-center items-center gap-[10px] flex-shrink-0 rounded-[16px] text-sm font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)] text-white hover:opacity-80 active:scale-95"
        }`}
      >
        ≫
      </button>
    </div>
  );
};
export default Pagination;
