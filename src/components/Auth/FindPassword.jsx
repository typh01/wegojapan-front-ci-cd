import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import SendVerifyCode from "./SendVerifyCode";
import VerifyCode from "./VerifyCode";
import StepButton from "../common/MyPlan/StepButton";
import { emailRegex } from "./Regex";

const FindPassword = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [msg, setMsg] = useState("");

  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const handleFindPw = (e) => {
    e.preventDefault();

    if (!memberId) return setMsg("아이디를 입력해주세요.");
    if (!email) return setMsg("이메일을 입력해주세요.");
    if (!codeVerified) return setMsg("이메일 인증을 완료해주세요.");
    if (!emailRegex.test(email))
      return setMsg("유효한 이메일 형식이 아닙니다.");

    axios
      .post(`${apiUrl}/api/emails/findPassword-code`, {
        memberId: memberId,
        email: email,
        verifyCode: verifyCode,
      })
      .then((response) => {
        if (response.status === 200) {
          navigate("/newPassword", { state: { memberId } });
        }
      })
      .catch((error) => {
        console.error(error);
        setMsg("회원 정보를 찾을 수 없습니다.");
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">비밀번호 찾기</h2>

      <form onSubmit={handleFindPw}>
        <div className="mb-4">
          <label className="block mb-1">아이디</label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">이메일</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow border px-3 py-2 rounded"
            />
            <SendVerifyCode
              email={email}
              memberId={memberId}
              setMsg={setMsg}
              setCodeSent={() => {}}
              endpoint="/api/emails/find-password"
            />
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            className="flex-grow border px-3 py-2 rounded"
          />
          <VerifyCode
            email={email}
            verifyCode={verifyCode}
            setCodeVerified={setCodeVerified}
            setMsg={setMsg}
            endpoint="/api/emails/findPassword-code"
          />
        </div>

        {msg && <p className="text-red-500 text-sm text-center mb-4">{msg}</p>}

        {/* 버튼 */}
        <div className="flex gap-4 justify-center">
          <StepButton onClick={handleFindPw}>확인</StepButton>
          <StepButton type="button">취소</StepButton>
        </div>
      </form>
    </div>
  );
};

export default FindPassword;
