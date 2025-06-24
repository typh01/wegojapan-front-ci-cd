import React from "react";

function CustomerCenter() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        고객센터
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <section className="text-center border-b pb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            WeGoJapan 고객센터에 오신 것을 환영합니다
          </h2>
          <p className="text-gray-600 leading-relaxed">
            오사카 여행과 관련된 모든 문의사항에 대해 친절하게
            안내해드리겠습니다. 언제든지 편하게 문의해주세요.
          </p>
        </section>

        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            📞 연락처 정보
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="text-lg mr-2">📞</span>
                전화 문의
              </h3>
              <p className="text-blue-700 text-lg font-bold mb-1">1588-1234</p>
              <p className="text-blue-600 text-sm">
                평일 09:00 ~ 18:00
                <br />
                (토요일, 일요일, 공휴일 휴무)
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <span className="text-lg mr-2">📧</span>
                이메일 문의
              </h3>
              <p className="text-green-700 font-bold mb-1">
                semo970921@gmail.com
              </p>
              <p className="text-green-600 text-sm">
                24시간 접수 가능
                <br />
                영업일 기준 24시간 내 답변
              </p>
            </div>
          </div>
        </section>

        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            ❓ 자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Q. 회원가입은 어떻게 하나요?
              </h3>
              <p className="text-gray-600 text-sm">
                A. 상단의 '회원가입' 버튼을 클릭하시어 필수 정보를 입력하시면
                됩니다. 이메일 인증 후 바로 서비스를 이용하실 수 있습니다.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Q. 여행 계획은 어떻게 세우나요?
              </h3>
              <p className="text-gray-600 text-sm">
                A. '나의 플랜 세우기' 메뉴에서 원하는 지역, 기간, 취향 등을
                입력하여 여행계획을 세우면 됩니다.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Q. 일본 여행 시 유용한 팁이 있나요?
              </h3>
              <p className="text-gray-600 text-sm">
                A. 일본은 현금 사용이 많으니 충분한 엔화를 준비하시고, JR패스를
                미리 구입하시면 교통비를 절약할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 오시는 길 섹션 */}
        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            🗺️ 오시는 길
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>주소:</strong> 서울특별시 중구 남대문로 120 대일빌딩
              </p>
              <p>
                <strong>지하철:</strong>
                <span className="ml-2">
                  1호선/4호선 서울역 2번 출구 (도보 5분)
                  <br />
                  <span className="ml-[4.5rem]">
                    2호선 을지로입구역 7번 출구 (도보 10분)
                  </span>
                </span>
              </p>
              <p>
                <strong>버스:</strong>
                <span className="ml-2">
                  간선버스: 150, 162, 421, 472
                  <br />
                  <span className="ml-[3.2rem]">지선버스: 7016, 7022</span>
                </span>
              </p>
              <p>
                <strong>주차:</strong> 건물 지하 1층 ~ 지하 3층 (유료)
              </p>
            </div>
          </div>
        </section>

        <section className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">
            ⏰ 운영시간 및 공지사항
          </h2>
          <div className="text-yellow-700 space-y-2">
            <div>
              <p>
                <strong>전화 상담:</strong> 평일 09:00 ~ 18:00 (점심시간
                12:00~13:00 제외)
              </p>
              <p>
                <strong>이메일 문의:</strong> 24시간 접수, 영업일 기준 24시간 내
                답변
              </p>
              <p>
                <strong>방문 상담:</strong> 평일 10:00 ~ 17:00 (사전 예약 필수)
              </p>
            </div>
            <div className="pt-2 border-t border-yellow-200">
              <p className="text-sm">
                <strong>📢 공지:</strong> 연말연시(12/29~1/3) 및 추석 연휴
                기간에는 고객센터 운영이 중단됩니다. 긴급한 문의사항은 이메일로
                접수해주시면 연휴 후 순차적으로 답변드리겠습니다.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center text-gray-500 text-sm pt-4 border-t">
          <p>고객센터 운영시간 및 연락처는 변경될 수 있습니다.</p>
          <p>최종 업데이트: 2025년 6월 24일</p>
          <p>WeGoJapan © 2025. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerCenter;
