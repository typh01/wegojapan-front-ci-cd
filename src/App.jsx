import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import EmailCollectionPolicy from "./components/Footer/EmailCollectionPolicy";
import TermsOfService from "./components/Footer/TermsOfService";
import CustomerCenter from "./components/Footer/CustomerCenter";
import StepIndicator from "./components/common/MyPlan/Step";
import TravelRegister from "./pages/Travel/TravelRegister";
import FestivalRegister from "./pages/Travel/FestivalRegister";
import TravelOptionsManagement from "./pages/Travel/TravelOptionManagement";
import TravelPage from "./pages/Travel/TravelPage";
import TravelDetailSearchPage from "./pages/Travel/TravelDetailSearch";
import FestivalPage from "./pages/Travel/FestivalPage";
import TravelDetailPage from "./pages/Travel/TravelDetail";
import TravelAdminManagement from "./pages/Travel/TravelAdminManagement";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/email-collection-policy"
            element={<EmailCollectionPolicy />}
          />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/customer-service" element={<CustomerCenter />} />
          <Route path="/myplan" element={<StepIndicator />} />

          {/* 사용자 여행지 */}
          <Route path="/travels" element={<TravelPage />} />
          <Route path="/travels/search" element={<TravelDetailSearchPage />} />
          <Route path="/travels/detail" element={<TravelDetailPage />} />
          <Route path="/festivals" element={<FestivalPage />} />

          {/* 여행지 관련 관리자 기능 */}
          <Route path="/admin/travels" element={<TravelRegister />} />
          <Route path="/admin/festivals" element={<FestivalRegister />} />
          <Route
            path="/admin/travels/management"
            element={<TravelAdminManagement />}
          />
          <Route
            path="/admin/travels/options/management"
            element={<TravelOptionsManagement />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
