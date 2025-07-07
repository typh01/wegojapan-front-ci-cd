import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/Context/AuthContext";

const AdminPage = () => {
  const { auth } = useContext(AuthContext);
  const { loginInfo, isLoading, isAuthenticated } = auth;
  const navigate = useNavigate();



  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  //관리자 권한 확인
  const isAdmin = loginInfo?.authorities?.some(
    (auth) => auth.authority === "ROLE_ADMIN"
  );

  if (!isAdmin) {
    return (
      <div className="text-center py-20 text-xl text-red-500">
        관리자만 접근 가능한 페이지입니다.
      </div>
    );
  }

  // 카테고리별로 버튼 분류
  const sections = [
    {
      title: "회원",
      buttons: [
        {
          src: "/회원전체조회.png",
          text: "회원 전체 조회",
          path: "/adminPage/memberList",
        },
      ],
    },
    {
      title: "여행지",
      buttons: [
        {
          src: "/여행지등록.png",
          text: "여행지 등록",
          path: "/admin/travels",
        },
        {
          src: "/여행지관리.png",
          text: "여행지 관리",
          path: "/admin/travels/management",
        },
      ],
    },
    {
      buttons: [
        {
          src: "/축제등록.png",
          text: "여행지 옵션 관리",
          path: "/admin/travels/options/management",
        },
      ],
    },
    {
      title: "신고",
      buttons: [
        {
          src: "/리뷰신고조회.png",
          text: "리뷰 신고 조회",
          path: "/adminPage/reviewReportList",
        },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-gray-500 text-sm mb-2">마이페이지</h2>
      <div className="bg-white shadow p-6 rounded-lg">
        <h1 className="text-xl font-semibold mb-6">
          관리자 {loginInfo.memberName} 님 마이 페이지
        </h1>

        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-lg font-bold mb-1">{section.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {section.buttons.map((btn, index) => (
                <button
                  key={index}
                  onClick={() => navigate(btn.path)}
                  className="flex flex-col items-center gap-2 border p-4 rounded-lg hover:bg-gray-100"
                >
                  <img src={btn.src} alt={btn.text} className="w-20 h-20" />
                  <span className="text-sm">{btn.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => navigate("/admin/staff")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm"
          >
            💬 상담관리
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
