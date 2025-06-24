import React from "react";

function EmailCollectionPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        이메일 무단수집 거부
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-3 flex items-center">
            <span className="text-2xl mr-2">⚠️</span>
            이메일 무단수집 금지 안내
          </h2>
          <p className="text-red-700 leading-relaxed">
            본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그
            밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를
            위반시 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 의해
            형사처벌됨을 유의하시기 바랍니다.
          </p>
        </div>

        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            법적 근거
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              정보통신망 이용촉진 및 정보보호 등에 관한 법률 제50조의 2
            </h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              누구든지 전자우편주소의 수집을 거부하는 의사를 명시한 인터넷
              홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램 그 밖의
              기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니 된다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>처벌 조항:</strong> 1년 이하의 징역 또는 1천만원 이하의
              벌금
            </p>
          </div>
        </section>

        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            무단수집 금지 대상
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>웹사이트에 게시된 모든 이메일 주소</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>고객센터 및 문의 관련 이메일 주소</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>회원가입 또는 서비스 이용 과정에서 수집된 이메일 주소</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>기타 WeGoJapan 서비스와 관련된 모든 이메일 주소</span>
            </li>
          </ul>
        </section>

        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            금지되는 행위
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">
                자동수집 프로그램
              </h3>
              <p className="text-orange-700 text-sm">
                웹 크롤러, 스크래핑 봇 등을 이용한 이메일 주소 자동 수집
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">무단 복사</h3>
              <p className="text-orange-700 text-sm">
                웹페이지 소스코드에서 이메일 주소 무단 복사 및 활용
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">스팸 발송</h3>
              <p className="text-orange-700 text-sm">
                수집된 이메일로 동의 없는 광고성 정보 발송
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">제3자 제공</h3>
              <p className="text-orange-700 text-sm">
                수집된 이메일 주소를 제3자에게 판매 또는 제공
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            신고 및 문의
          </h2>
          <p className="text-blue-700 mb-4">
            이메일 무단수집 및 스팸 발송 신고는 아래 연락처로 문의하시기
            바랍니다.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-blue-700">
            <div>
              <p>
                <strong>이메일:</strong> semo970921@gmail.com
              </p>
              <p>
                <strong>전화:</strong> 1588-1234
              </p>
            </div>
            <div>
              <p>
                <strong>개인정보보호위원회:</strong> WeGoJapan.privacy.go.kr
              </p>
            </div>
          </div>
        </section>

        {/* 마지막 업데이트 정보 */}
        <div className="text-center text-gray-500 text-sm pt-4 border-t">
          <p>최종 업데이트: 2025년 06월 24일</p>
          <p>WeGoJapan © 2025. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default EmailCollectionPolicy;
