import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import EmailCollectionPolicy from "./components/Footer/EmailCollectionPolicy";
import TermsOfService from "./components/Footer/TermsOfService";
import CustomerCenter from "./components/Footer/CustomerCenter";

// 일단 공통모듈 테스트용
import StepButton from "./components/common/MyPlan/StepButton";
//import Step from "./components/common/MyPlan/Step";
import StepIndicator from "./components/common/MyPlan/StepIndicator";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex gap-4 mb-8">
        <StepButton type="prev" onClick={() => alert("이전으로")}>
          이전단계
        </StepButton>
        <StepButton type="next" onClick={() => alert("다음으로")}>
          다음단계
        </StepButton>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/email-collection-policy"
            element={<EmailCollectionPolicy />}
          />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/customer-service" element={<CustomerCenter />} />
          <Route path="/" element={<StepIndicator />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
