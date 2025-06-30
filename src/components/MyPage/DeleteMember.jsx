import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepButton from "../common/MyPlan/StepButton";

const DeleteMember = () => {
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">비밀번호 재확인</h2>
        <p className="text-center text-gray-600 mb-6">
          회원 탈퇴를 하려면 보안을 위해 회원님의 비밀번호를 다시 한번
          입력해주세요.
        </p>

        <label className="block mb-1 text-gray-700 font-medium">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="flex gap-4 justify-center">
          <StepButton type="next" onClick={handleConfirm} className="w-[48%]">
            확인
          </StepButton>
          <StepButton type="prev" onClick={handleCancel} className="w-[48%]">
            취소
          </StepButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteMember;
