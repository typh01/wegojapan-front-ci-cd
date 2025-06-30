import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SendVerifyCode from "./SendVerifyCode";
import VerifyCode from "./VerifyCode";
import StepButton from "../common/MyPlan/StepButton";
import { emailRegex } from "./Regex";

const FindId = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const handleFindId = (e) => {
    e.preventDefault();

    if (!name) return setMsg("닉네임을 입력해주세요.");
    if (!email) return setMsg("이메일을 입력해주세요.");
    if (!emailRegex.test(email))
      return setMsg("유효한 이메일 형식이 아닙니다.");
    if (!codeVerified) return setMsg("이메일 인증을 완료해주세요.");

    axios
      .post(`${apiUrl}/api/emails/findVerify-code`, {
        verifyCode: verifyCode,
        email: email,
      })
      .then((response) => {
        console.log("response:", response);
        if (response.status === 200) {
          const memberId = response.data.data.memberId;
          navigate("/findIdResult", { state: { memberId } }); // 여기서 state: {memberId}를 쓰는 이유는 findIdResult에 memberId 값을 넘겨주기 위해서
        }
      })
      .catch((error) => {
        console.error(error);
        setMsg("회원 정보를 찾을 수 없습니다.");
      });
  };

  return (
    <div className="flex justify-center items-center py-10 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleFindId}
        className="bg-white shadow-md p-10 rounded-2xl w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">아이디 찾기</h2>

        {/* 닉네임 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">닉네임</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="닉네임을 입력하세요"
          />
        </div>

        {/* 이메일 + 인증받기 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">이메일</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow border px-3 py-2 rounded"
              placeholder="example@domain.com"
              disabled={codeVerified}
            />
            <SendVerifyCode
              email={email}
              memberName={name}
              setMsg={setMsg}
              setCodeSent={() => {}}
              endpoint="/api/emails/find-id"
            />
          </div>
        </div>

        {/* 인증번호 입력 + 확인 */}
        {!codeVerified && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                name="verifyCode"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="인증번호 4자리 숫자 입력"
                className="flex-grow border px-3 py-2 rounded"
              />
              <VerifyCode
                email={email}
                verifyCode={verifyCode}
                setCodeVerified={setCodeVerified}
                setMsg={setMsg}
                endpoint="/api/emails/findVerify-code"
              />
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {msg && <p className="text-red-500 text-sm text-center mb-4">{msg}</p>}

        {/* 버튼 */}
        <div className="flex gap-4 justify-center">
          <StepButton onClick={handleFindId}>확인</StepButton>
          <StepButton type="button">취소</StepButton>
        </div>
      </form>
    </div>
  );
};

export default FindId;
