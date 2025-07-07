import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/Context/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import EmailCollectionPolicy from "./components/Footer/EmailCollectionPolicy";
import TermsOfService from "./components/Footer/TermsOfService";
import CustomerCenter from "./components/Footer/CustomerCenter";
import StepIndicator from "./components/common/MyPlan/Step";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import TravelOptionsManagement from "./pages/Travel/admin/TravelOptionManagement";
import TravelAdminManagement from "./pages/Travel/admin/TravelAdminManagement";
import TravelRegister from "./pages/Travel/admin/TravelRegister";
import TravelPage from "./pages/Travel/TravelPage";
import ThemaTravelPage from "./pages/Travel/ThemaTravelPage";
import TravelDetailPage from "./pages/Travel/TravelDetail";
import TravelDetailSearchPage from "./pages/Travel/TravelDetailSearch";
import MyTravelPlanDetail from "./pages/MyPlan/MyTravelPlanDetail";
import MyTravelPlanList from "./pages/MyPlan/MyTravelPlanList";
import FindId from "./components/Auth/FindId"; 
import FindIdResult from "./components/Auth/FindIdResult";
import FindPassword from "./components/Auth/FindPassword";
import NewPassword from "./components/Auth/NewPassword";
import MyPage from "./components/MyPage/MyPage";
import ChangePassword from "./components/MyPage/ChangePassword";
import DeleteMember from "./components/MyPage/DeleteMember";
import AdminPage from "./admin/AdminPage";
import MemberList from "./admin/MemberList";
import ReviewReportList from "./admin/ReviewReportList";
import TravelReportList from "./admin/TravelReportList";
import BookMarkList from "./components/MyPage/BookMarkList";

import Main from "./pages/Main";

import ReviewForm from "./pages/Review/ReviewForm";
import TravelReviewList from "./pages/Review/TravelReviewList";
import MyReviewList from "./pages/Review/MyReviewList";
import CustomerChat from "./pages/Chat/CustomerChat";
import StaffDashboard from "./pages/Chat/StaffDashboard";

function AppContent() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/adminPage");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-[1440px] mx-auto px-6 py-8 pb-[145px]">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/email-collection-policy"
            element={<EmailCollectionPolicy />}
          />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/customer-service" element={<CustomerCenter />} />
          <Route path="/myplan" element={<StepIndicator />} />
          {/* 로그인 유저 */}
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/findId" element={<FindId />} />
          <Route path="/findIdResult" element={<FindIdResult />} />
          <Route path="/findPassword" element={<FindPassword />} />
          <Route path="/newPassword" element={<NewPassword />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/myPage/changePassword" element={<ChangePassword />} />
          <Route path="/myPage/deleteMember" element={<DeleteMember />} />
          <Route path="/myPage/BookMarkList" element={<BookMarkList />} />
          {/* 관리자 전용 */}
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/adminPage/memberList" element={<MemberList />} />
          <Route
            path="/adminPage/reviewReportList"
            element={<ReviewReportList />}
          />
          <Route
            path="/adminPage/travelReportList"
            element={<TravelReportList />}
          />

          {/* 사용자 여행지 */}
          <Route path="/travels" element={<TravelPage />} />
          <Route path="/thema/travels" element={<ThemaTravelPage />} />
          <Route path="/travels/search" element={<TravelDetailSearchPage />} />
          <Route path="/travels/detail/:id" element={<TravelDetailPage />} />
          {/* 여행지 관련 관리자 기능 */}
          <Route path="/admin/travels" element={<TravelRegister />} />
          <Route path="/admin/travels/:id" element={<TravelRegister />} />
          <Route
            path="/admin/travels/management"
            element={<TravelAdminManagement />}
          />
          <Route
            path="/admin/travels/options/management"
            element={<TravelOptionsManagement />}
          />
          {/* 나의 여행 플랜 */}
          <Route path="/myplan" element={<StepIndicator />} />
          <Route path="/myplan/list" element={<MyTravelPlanList />} />
          <Route
            path="/myplan/detail/:planNo"
            element={<MyTravelPlanDetail />}
          />

          {/* 여행리뷰 */}
          <Route path="/reviews/write" element={<ReviewForm />} />
          <Route path="/reviews/list" element={<TravelReviewList />} />
          <Route path="/myreviews/list" element={<MyReviewList />} />

          {/* 소켓 */}
          <Route path="/admin/staff" element={<StaffDashboard />} />
        </Routes>
      </main>
      <Footer />

      {!isAdminPage && <CustomerChat />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
