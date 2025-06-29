import { useState, useContext } from "react";
import { nameRegex } from "../Auth/Regex";
import { AuthContext } from "../Context/AuthContext";

const ChangeNameModal = ({ onClose }) => {
  const { auth } = useContext(AuthContext);
  const memberId = auth?.loginInfo?.memberId;

  const [nickname, setNickname] = useState("");
  const [checkResult, setCheckResult] = useState(null);

  const dummyUsers = [
    { memberId: "aaa", nickname: "현우짱" },
    { memberId: "bbb", nickname: "야구고수" },
    { memberId: "ccc", nickname: "takenname" },
  ];

  const handleCheck = () => {
    if (!nameRegex.test(nickname)) {
      alert("닉네임은 한글 또는 영문 2~10자만 가능합니다.");
      return;
    }

    // axios로 대체 예정
    const isDuplicate = dummyUsers.some(
      (user) => user.nickname === nickname && user.memberId !== memberId
    );
    setCheckResult(!isDuplicate);
  };

  const handleChange = () => {
    if (!nameRegex.test(nickname)) {
      alert("닉네임은 한글 또는 영문 2~10자만 가능합니다.");
      return;
    }

    if (!checkResult) {
      alert("닉네임 중복확인을 먼저 해주세요.");
      return;
    }

    alert("닉네임이 변경되었습니다.");
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* 배경 클릭 차단 오버레이 */}
      <div className="absolute inset-0 bg-transparent pointer-events-auto" />

      {/* 모달 박스 */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg p-6 w-[420px] border pointer-events-auto">
        <h2 className="text-xl font-bold mb-4 text-center">닉네임 변경</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setCheckResult(null);
            }}
            placeholder="새 닉네임 입력"
            className="flex-1 border border-gray-300 px-4 py-2 rounded"
          />
          <button
            onClick={handleCheck}
            className="px-4 py-2 rounded text-sm bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:opacity-90"
          >
            중복확인
          </button>
        </div>

        {nickname.length > 0 && !nameRegex.test(nickname) && (
          <p className="text-sm text-red-500 mb-2">
            닉네임은 한글 또는 영문 2~10자만 가능합니다.
          </p>
        )}
        {checkResult !== null && nameRegex.test(nickname) && (
          <p
            className={`text-sm mb-4 ${
              checkResult ? "text-blue-500" : "text-red-500"
            }`}
          >
            {checkResult ? "사용 가능한 닉네임입니다." : "닉네임이 중복입니다."}
          </p>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded text-gray-600 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleChange}
            className={`flex-1 py-2 rounded font-semibold transition ${
              checkResult
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!checkResult}
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeNameModal;
