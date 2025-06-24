import React from "react";

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        개인정보 처리방침
      </h1>

      {/* 내용 */}
      <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {/* 제1조 - 개인정보 처리 목적 */}
        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제1조 (개인정보 처리 목적)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            WeGoJapan은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
            있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용
            목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를
            받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="mt-3 ml-4 space-y-1 text-gray-600">
            <li>
              • 회원 가입 및 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별
            </li>
            <li>• 여행 서비스 제공: 여행지 정보 제공, 맞춤형 여행 계획 수립</li>
            <li>
              • 고객 상담 및 서비스 개선: 문의사항 처리, 서비스 만족도 조사
            </li>
            <li>• 마케팅 및 광고 활용: 이벤트 정보 및 광고성 정보 전송</li>
          </ul>
        </section>

        {/* 제2조 - 개인정보 수집 항목 */}
        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제2조 (개인정보 수집 항목)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              <strong>필수항목:</strong> 이름, 이메일, 비밀번호
            </p>
            <p>
              <strong>선택항목:</strong> 선호 여행지, 여행 스타일
            </p>
            <p>
              <strong>자동수집항목:</strong> IP주소, 쿠키, 방문일시, 서비스
              이용기록
            </p>
          </div>
        </section>

        {/* 제3조 - 개인정보 처리 및 보유기간 */}
        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제3조 (개인정보의 처리 및 보유기간)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
            개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
            개인정보를 처리·보유합니다.
          </p>
          <ul className="mt-3 ml-4 space-y-1 text-gray-600">
            <li>
              • 회원 정보: 회원 탈퇴 시까지 (단, 관련 법령에 따라 일정기간 보관)
            </li>
            <li>• 여행 계획 정보: 회원 탈퇴 후 1년</li>
            <li>• 서비스 이용 기록: 3개월</li>
          </ul>
        </section>

        {/* 제4조 - 개인정보 제3자 제공 */}
        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제4조 (개인정보의 제3자 제공)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            회사는 정보주체의 개인정보를 제1조(개인정보 처리 목적)에서 명시한
            범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등
            개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게
            제공합니다.
          </p>
        </section>

        {/* 제5조 - 개인정보 처리 위탁
        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제5조 (개인정보 처리 위탁)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
            처리업무를 위탁하고 있습니다.
          </p>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">
              <strong>위탁업체:</strong> 카카오페이, 네이버페이 등
            </p>
            <p className="text-gray-600">
              <strong>위탁업무:</strong> 결제 처리 및 관련 고객 상담
            </p>
          </div>
        </section> */}

        {/* 제6조 - 정보주체의 권리 */}
        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제5조 (정보주체의 권리·의무 및 행사방법)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련
            권리를 행사할 수 있습니다.
          </p>
          <ul className="mt-3 ml-4 space-y-1 text-gray-600">
            <li>• 개인정보 처리현황 통지 요구</li>
            <li>• 개인정보 열람 요구</li>
            <li>• 개인정보 정정·삭제 요구</li>
            <li>• 개인정보 처리정지 요구</li>
          </ul>
        </section>

        {/* 연락처 정보 */}
        <section className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">
            개인정보보호 책임자
          </h3>
          <div className="text-blue-700 space-y-1">
            <p>이메일: semo970921@gmail.com</p>
            <p>전화번호: 1588-1234</p>
            <p>처리방침 시행일자: 2025년 06월 24일</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
