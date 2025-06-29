import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import EmailCollectionPolicy from "./components/Footer/EmailCollectionPolicy";
import TermsOfService from "./components/Footer/TermsOfService";
import CustomerCenter from "./components/Footer/CustomerCenter";
import StepIndicator from "./components/common/MyPlan/Step";
import MyTravelPlanList from "./pages/MyPlan/MyTravelPlanList";

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

          {/* 나의 여행 플랜 */}
          <Route path="/myplan" element={<StepIndicator />} />
          <Route path="/myplan/list" element={<MyTravelPlanList />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
