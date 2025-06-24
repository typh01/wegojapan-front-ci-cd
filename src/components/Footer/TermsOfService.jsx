import React from "react";

function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        이용약관
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제1조 (목적)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            이 약관은 WeGoJapan(이하 "회사")이 제공하는 여행지 통합 플랫폼
            서비스의 이용조건 및 절차, 회사와 이용자 간의 권리·의무 및
            책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제2조 (정의)
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong>1. "서비스"</strong>란 회사가 제공하는 여행지 정보, 여행
              계획 수립, 예약 중개 등의 온라인 서비스를 의미합니다.
            </p>
            <p>
              <strong>2. "이용자"</strong>란 이 약관에 따라 회사가 제공하는
              서비스를 받는 회원 및 비회원을 의미합니다.
            </p>
            <p>
              <strong>3. "회원"</strong>이란 회사에 개인정보를 제공하여
              회원등록을 한 자로서 회사의 정보를 지속적으로 제공받으며 회사가
              제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.
            </p>
            <p>
              <strong>4. "여행 계획"</strong>이란 회원이 본 서비스를 통해 작성한
              개인 맞춤형 여행 일정을 의미합니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제3조 (약관의 효력과 변경)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그
              효력을 발생합니다.
            </p>
            <p>
              2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며,
              약관이 변경되는 경우 적용일자 및 개정사유를 명시하여 현행약관과
              함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지
              공지합니다.
            </p>
            <p>
              3. 이용자는 변경된 약관에 동의하지 않을 경우 회원탈퇴(해지)를
              요청할 수 있으며, 변경된 약관의 효력 발생일로부터 7일 이후에도
              거부의사를 표시하지 아니하고 서비스를 계속 이용할 경우 약관의
              변경에 동의한 것으로 간주됩니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제4조 (서비스의 제공)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            회사는 다음과 같은 서비스를 제공합니다:
          </p>
          <ul className="ml-4 space-y-1 text-gray-600">
            <li>• 오사카 여행지 정보 제공 서비스</li>
            <li>• 개인 맞춤형 여행 계획 수립 서비스</li>
            <li>• 여행 관련 예약 중개 서비스</li>
            <li>• 여행 후기 및 평점 공유 서비스</li>
            <li>• 기타 회사가 정하는 서비스</li>
          </ul>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제5조 (회원가입)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이
              약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
            </p>
            <p>
              2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음
              각 호에 해당하지 않는 한 회원으로 등록합니다:
            </p>
            <ul className="ml-4 mt-2 space-y-1">
              <li>
                • 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이
                있는 경우
              </li>
              <li>• 실명이 아니거나 타인의 명의를 이용한 경우</li>
              <li>
                • 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은
                경우
              </li>
              <li>
                • 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고
                판단되는 경우
              </li>
            </ul>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제6조 (회원의 의무)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            회원은 다음 행위를 하여서는 안 됩니다:
          </p>
          <ul className="ml-4 space-y-1 text-gray-600">
            <li>• 신청 또는 변경 시 허위내용의 등록</li>
            <li>• 타인의 정보 도용</li>
            <li>• 회사가 게시한 정보의 변경</li>
            <li>
              • 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는
              게시
            </li>
            <li>• 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
            <li>
              • 회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
            </li>
            <li>
              • 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는
              정보를 서비스에 공개 또는 게시하는 행위
            </li>
            <li>• 서비스를 상업적 목적으로 이용하는 행위</li>
          </ul>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제7조 (회사의 의무)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를
              하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로
              서비스를 제공하기 위해서 노력합니다.
            </p>
            <p>
              2. 회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록
              이용자의 개인정보보호를 위한 보안 시스템을 구축합니다.
            </p>
            <p>
              3. 회사는 이용자가 원하지 않는 영리목적의 광고성 전자우편을
              발송하지 않습니다.
            </p>
            <p>
              4. 회사는 서비스의 이용과 관련하여 이용자로부터 제기된 의견이나
              불만이 정당하다고 인정할 경우에는 이를 즉시 처리하여야 합니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제8조 (서비스 이용시간)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한
              연중무휴, 1일 24시간 운영을 원칙으로 합니다.
            </p>
            <p>
              2. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장,
              통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을
              일시적으로 중단할 수 있습니다.
            </p>
            <p>
              3. 회사는 제2항의 사유로 서비스의 제공이 일시적으로 중단됨으로
              인하여 이용자 또는 제3자가 입은 손해에 대하여 배상하지 않습니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제9조 (개인정보보호)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 회사는 이용자의 개인정보를 중요시하며, 정보통신망 이용촉진 및
              정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령을 준수하기
              위해 노력합니다.
            </p>
            <p>
              2. 회사는 개인정보보호정책을 통하여 이용자가 제공하는 개인정보가
              어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한
              조치가 취해지고 있는지 알려드립니다.
            </p>
            <p>
              3. 회사는 이용자의 귀책사유로 인한 개인정보 유출에 대하여는
              책임지지 않습니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제10조 (계약해지 및 이용제한)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 회원은 언제든지 마이페이지의 회원탈퇴 메뉴 등을 통하여 이용계약
              해지 신청을 할 수 있으며, 회사는 관련 법령 등이 정하는 바에 따라
              이를 즉시 처리하여야 합니다.
            </p>
            <p>
              2. 회사는 회원이 다음 각 호에 해당하는 행위를 하였을 때는 사전통지
              없이 이용계약을 해지하거나 또는 기간을 정하여 서비스 이용을 중단할
              수 있습니다:
            </p>
            <ul className="ml-4 mt-2 space-y-1">
              <li>
                • 타인의 서비스 이용을 방해하거나 그 정보를 도용하는 등의 행위
              </li>
              <li>
                • 서비스를 이용하여 법령과 이 약관이 금지하는 행위를 하는 경우
              </li>
              <li>• 기타 이 약관에 위배되는 행위를 하는 경우</li>
            </ul>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제11조 (손해배상 및 면책조항)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가
              발생하더라도 회사가 고의로 행한 범죄행위를 제외하고는 이에 대하여
              책임을 부담하지 아니합니다.
            </p>
            <p>
              2. 회사는 회원이 서비스에 게재한 정보, 자료, 사실의 신뢰도, 정확성
              등 내용에 관하여는 책임을 지지 않습니다.
            </p>
            <p>
              3. 회사는 회원 간 또는 회원과 제3자 상호간에 서비스를 매개로 하여
              거래 등을 한 경우에는 책임을 부담하지 아니합니다.
            </p>
            <p>
              4. 회사는 무료로 제공되는 서비스 이용과 관련하여
              개인정보보호정책에서 정하는 내용을 제외하고는 어떠한 개인정보도
              수집하지 않습니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제12조 (분쟁해결)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그
              피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
            </p>
            <p>
              2. 회사는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그
              사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게
              그 사유와 처리일정을 즉시 통보해 드립니다.
            </p>
            <p>
              3. 회사와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의
              피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가
              의뢰하는 분쟁조정기구의 조정에 따를 수 있습니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제13조 (재판권 및 준거법)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 회사와 이용자 간에 발생한 서비스 이용에 관한 분쟁에 대하여는
              대한민국 법을 적용합니다.
            </p>
            <p>
              2. 회사와 이용자 간에 서비스 이용에 관하여 발생한 분쟁에 대해서는
              제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를
              관할하는 지방법원의 전속관할로 합니다. 단, 제소 당시 이용자의 주소
              또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의
              관할법원에 제기합니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제14조 (서비스 중단)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 회사는 다음 각 호에 해당하는 경우 서비스 제공을 중단할 수
              있습니다:
            </p>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• 서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
              <li>
                • 전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를
                중지했을 경우
              </li>
              <li>
                • 국가비상사태, 서비스 설비의 장애 또는 서비스 이용의 폭주
                등으로 정상적인 서비스 이용에 지장이 있는 경우
              </li>
              <li>
                • 기타 중대한 사유로 인하여 회사가 서비스 제공을 지속하는 것이
                부적당하다고 인정하는 경우
              </li>
            </ul>
            <p>
              2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로
              인하여 이용자 또는 제3자가 입은 손해에 대하여 배상하지 않습니다.
              단, 회사의 고의 또는 중과실에 의한 경우는 그러하지 아니합니다.
            </p>
          </div>
        </section>

        <section className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            제15조 (저작권의 귀속 및 이용제한)
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>
              1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에
              귀속합니다.
            </p>
            <p>
              2. 이용자는 회사를 이용함으로써 얻은 정보 중 회사에게 지적재산권이
              귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송
              기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게
              하여서는 안됩니다.
            </p>
            <p>
              3. 회사는 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우
              당해 이용자에게 통보하여야 합니다.
            </p>
          </div>
        </section>

        {/* 부칙 */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">부칙</h2>
          <div className="text-gray-600 space-y-2">
            <p>
              <strong>시행일:</strong> 이 약관은 2025년 6월 24일부터 적용됩니다.
            </p>
            <p>
              <strong>개정일:</strong> 2025년 6월 24일
            </p>
            <p>
              <strong>연락처:</strong>
            </p>
            <div className="ml-4 space-y-1">
              <p>• 상호: WeGoJapan</p>
              <p>• 대표자: 고현우</p>
              <p>• 사업자등록번호: 123-45-67890-12345</p>
              <p>• 이메일: semo970921@gmail.com</p>
              <p>• 전화: 1588-1234</p>
              <p>• 주소: 서울특별시 중구 남대문로 120 대일빌딩</p>
            </div>
          </div>
        </section>

        {/* 마지막 업데이트 정보 */}
        <div className="text-center text-gray-500 text-sm pt-4 border-t">
          <p>최종 업데이트: 2025년 6월 24일</p>
          <p>WeGoJapan © 2025. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
