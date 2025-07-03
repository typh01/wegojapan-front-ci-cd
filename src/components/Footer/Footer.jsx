import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full h-[145px] bg-gray-700 flex-shrink-0 fixed bottom-0 left-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 h-full flex flex-col justify-center">
        <div className="text-white text-sm mb-2">
          <Link
            to="/privacy-policy"
            className="hover:text-blue-300 cursor-pointer"
          >
            개인정보 처리방침
          </Link>
          <span className="mx-2">|</span>
          <Link
            to="/email-collection-policy"
            className="hover:text-blue-300 cursor-pointer"
          >
            이메일 무단수집 거부
          </Link>
          <span className="mx-2">|</span>
          <Link
            to="/terms-of-service"
            className="hover:text-blue-300 cursor-pointer"
          >
            이용약관
          </Link>
          <span className="mx-2">|</span>
          <Link
            to="/customer-service"
            className="hover:text-blue-300 cursor-pointer"
          >
            고객센터
          </Link>
        </div>

        <div className="text-white text-sm mb-1 font-medium">
          WeGoJapan - 나만의 여행 계획을 세우는 통합 플랫폼
        </div>

        <div className="text-gray-300 text-xs">
          서울특별시 중구 남대문로 120 대일빌딩 | 고객센터: 1588-1234 | 이메일:
          semo970921@gmail.com
        </div>

        <div className="text-gray-400 text-xs mt-1">
          © 2025 WeGoJapan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
