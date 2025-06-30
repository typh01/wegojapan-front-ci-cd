import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { pwRegex } from "./Regex";
import StepButton from "../common/MyPlan/StepButton";

const NewPassword = () => {
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const location = useLocation();
  const memberId = location.state?.memberId;
  const navigate = useNavigate();

  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const handleNewPw = (e) => {
    e.preventDefault();

    if (!pwRegex.test(newPw)) {
      return setMsg("비밀번호 형식이 맞지 않습니다.");
    }

    if (newPw !== newPwConfirm) {
      return setMsg("비밀번호가 일치하지 않습니다.");
    }

    axios
      .post(`${apiUrl}/api/emails/new-password`, {
        memberId: memberId,
        newPassword: newPw,
      })
      .then((response) => {
        if (response.status === 200) {
          alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(error);
        setMsg("비밀번호 변경 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">비밀번호 찾기</h2>
        <form onSubmit={handleNewPw} className="space-y-4 text-left">
          <div>
            <input
              type="password"
              placeholder="새로 설정할 비밀번호를 입력하세요"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호를 한 번 더 입력하세요"
              value={newPwConfirm}
              onChange={(e) => setNewPwConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {newPwConfirm && newPw !== newPwConfirm && (
            <p className="text-red-500 text-sm">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
          {msg && <p className="text-red-500 text-sm">{msg}</p>}

          <div className="flex gap-4 justify-center">
            <StepButton onClick={handleNewPw}>확인</StepButton>
            <StepButton type="prev">취소</StepButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
