import React, { useContext, useState } from "react";
import WeGoJapanLogo from "../../assets/icons/WeGoJapan_Logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navi = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (path) => {
    navi(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <div className="w-full bg-white z-50">
      {/* 상단 헤더 영역 */}
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-3 relative">
        {/* 로고 */}
        <img
          src={WeGoJapanLogo}
          className="h-12 object-contain cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={() => goTo("/")}
        />

        {/* 햄버거 버튼 (모바일용) */}
        <div className="md:hidden">
          {menuOpen ? (
            <X
              className="w-7 h-7 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <Menu
              className="w-7 h-7 cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          )}
        </div>

        {/* 로그인/회원가입/로그아웃 등 (PC용) */}
        <div className="hidden md:flex items-center space-x-4">
          {auth.isAuthenticated ? (
            <>
              {auth.loginInfo?.authorities?.some(
                (a) => a.authority === "ROLE_ADMIN"
              ) ? (
                <button
                  onClick={() => goTo("/adminPage")}
                  className="cursor-pointer text-blue-600 font-semibold hover:text-white hover:bg-blue-500 hover:shadow-lg px-4 py-2 rounded-full active:scale-95 active:shadow-md transition-all duration-200 text-sm"
                >
                  관리자 페이지
                </button>
              ) : (
                <button
                  onClick={() => goTo("/myPage")}
                  className="cursor-pointer text-gray-700 hover:text-white hover:bg-sky-500 hover:shadow-lg px-4 py-2 rounded-full active:scale-95 active:shadow-md transition-all duration-200 text-sm"
                >
                  나의 정보
                </button>
              )}
              <button
                onClick={handleLogout}
                className="cursor-pointer text-gray-700 hover:text-white hover:bg-red-500 hover:shadow-lg px-4 py-2 rounded-full active:scale-95 active:shadow-md transition-all duration-200 text-sm"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => goTo("/login")}
                className="cursor-pointer text-gray-700 hover:text-white hover:bg-sky-500 hover:shadow-lg px-4 py-2 rounded-full active:scale-95 active:shadow-md transition-all duration-200 text-sm"
              >
                로그인
              </button>
              <button
                onClick={() => goTo("/signup")}
                className="cursor-pointer text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-500 hover:shadow-lg px-4 py-2 rounded-full active:scale-95 active:shadow-md transition-all duration-200 text-sm"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>

      {/* 메뉴 전체: 네비게이션 + (모바일용) 로그인/로그아웃 등 */}
      <div
        className={`w-full md:flex ${
          menuOpen ? "block" : "hidden"
        } transition-all duration-300`}
        style={{
          background:
            "linear-gradient(90deg, #87CEEB 0%, #4682B4 25%, #5F9EA0 50%, #20B2AA 75%, #48D1CC 100%)",
        }}
      >
        {/* 네비게이션 메뉴 (공통) */}
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row w-full">
          <button
            onClick={() => goTo("/")}
            className="cursor-pointer text-white font-medium hover:bg-blue-600 hover:bg-opacity-40 hover:shadow-lg hover:-translate-y-0.5 px-4 py-3 text-center w-full active:scale-95 active:shadow-md transition-all duration-200"
          >
            HOME
          </button>
          <button
            onClick={() => goTo("/thema/travels")}
            className="cursor-pointer text-white font-medium hover:bg-teal-600 hover:bg-opacity-40 hover:shadow-lg hover:-translate-y-0.5 px-4 py-3 text-center w-full active:scale-95 active:shadow-md transition-all duration-200"
          >
            테마
          </button>
          <button
            onClick={() => goTo("/travels")}
            className="cursor-pointer text-white font-medium hover:bg-cyan-600 hover:bg-opacity-40 hover:shadow-lg hover:-translate-y-0.5 px-4 py-3 text-center w-full active:scale-95 active:shadow-md transition-all duration-200"
          >
            여행지
          </button>
          <button
            onClick={() => goTo("/myplan")}
            className="cursor-pointer text-white font-medium hover:bg-sky-600 hover:bg-opacity-40 hover:shadow-lg hover:-translate-y-0.5 px-4 py-3 text-center w-full active:scale-95 active:shadow-md transition-all duration-200"
          >
            나의 플랜 세우기
          </button>
        </div>

        {/* 로그인/회원가입/로그아웃 (모바일용) */}
        {menuOpen && (
          <div className="bg-white border-t">
            <div className="flex flex-col md:hidden bg-white px-4 py-4 space-y-2 border-t">
              {auth.isAuthenticated ? (
                <>
                  {auth.loginInfo?.authorities?.some(
                    (a) => a.authority === "ROLE_ADMIN"
                  ) ? (
                    <button
                      onClick={() => goTo("/adminPage")}
                      className="text-blue-600 font-semibold hover:text-white hover:bg-blue-500 hover:shadow px-4 py-2 rounded"
                    >
                      관리자 페이지
                    </button>
                  ) : (
                    <button
                      onClick={() => goTo("/myPage")}
                      className="text-gray-700 hover:text-white hover:bg-sky-500 hover:shadow px-4 py-2 rounded"
                    >
                      나의 정보
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-white hover:bg-red-500 hover:shadow px-4 py-2 rounded"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => goTo("/login")}
                    className="text-gray-700 hover:text-white hover:bg-sky-500 hover:shadow px-4 py-2 rounded"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => goTo("/signup")}
                    className="text-gray-700 hover:text-white hover:bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow px-4 py-2 rounded"
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
