import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { idRegex, pwRegex, nameRegex, emailRegex } from "./Regex";
import SendVerifyCode from "./SendVerifyCode";
import VerifyCode from "./VerifyCode";
import StepButton from "../common/MyPlan/StepButton";

const SignUp = () => {
  const [formData, setFormData] = useState({
    memberId: "",
    memberPw: "",
    memberPwConfirm: "",
    memberName: "",
    email: "",
    verifyCodeInput: "",
  });

  const [codeVerified, setCodeVerified] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    const { memberId, memberPw, memberPwConfirm, memberName, email } = formData;

    if (!idRegex.test(memberId))
      return setMsg("아이디 형식이 올바르지 않습니다.");
    if (!pwRegex.test(memberPw))
      return setMsg("비밀번호 형식이 올바르지 않습니다.");
    if (memberPw !== memberPwConfirm)
      return setMsg("비밀번호가 일치하지 않습니다.");
    if (!nameRegex.test(memberName))
      return setMsg("닉네임은 2~20자, 한글/영문만 가능합니다.");
    if (!emailRegex.test(email))
      return setMsg("유효한 이메일 형식이 아닙니다.");
    if (!codeVerified) return setMsg("이메일 인증 후 회원가입 해주세요.");

    axios
      .post(`${apiUrl}/api/members`, {
        memberId,
        memberPw,
        memberName,
        email,
      })
      .then(() => {
        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        navigate("/Login");
      })
      .catch((err) => {
        setMsg(err.response?.data?.message || "회원가입에 실패했습니다.");
      });
  };

  return (
    <div className="flex justify-center items-center py-10 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-md p-10 rounded-2xl w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">회원 가입</h2>

        {/* 닉네임 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">닉네임</label>
          <input
            name="memberName"
            value={formData.memberName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="닉네임을 입력하세요"
          />
        </div>

        {/* 아이디 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">아이디</label>
          <input
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="아이디를 입력하세요"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">비밀번호</label>
          <input
            type="password"
            name="memberPw"
            value={formData.memberPw}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">비밀번호 확인</label>
          <input
            type="password"
            name="memberPwConfirm"
            value={formData.memberPwConfirm}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
        {formData.memberPwConfirm.length > 0 && (
          <div
            className={`text-sm mt-1 ${
              formData.memberPw === formData.memberPwConfirm
                ? "text-blue-500"
                : "text-red-500"
            }`}
          >
            {formData.memberPw === formData.memberPwConfirm
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."}
          </div>
        )}

        {/* 이메일 + 인증받기 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">이메일</label>
          <div className="flex gap-2">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-grow border px-3 py-2 rounded"
              placeholder="example@domain.com"
              disabled={codeVerified}
            />
            <button
              type="button"
              onClick={() => {
                if (!emailRegex.test(formData.email))
                  return setMsg("유효한 이메일 형식이 아닙니다.");
                setMsg("");
              }}
              className="hidden"
            />
            <SendVerifyCode
              email={formData.email}
              setMsg={setMsg}
              setCodeSent={() => {}}
            />
          </div>
        </div>

        {/* 인증번호 입력 + 확인 */}
        {!codeVerified && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                name="verifyCodeInput"
                value={formData.verifyCodeInput}
                onChange={handleChange}
                placeholder="인증번호 입력"
                className="flex-grow border px-3 py-2 rounded"
              />
              <VerifyCode
                email={formData.email}
                verifyCode={formData.verifyCodeInput}
                setCodeVerified={setCodeVerified}
                setMsg={setMsg}
              />
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {msg && <p className="text-red-500 text-sm text-center mb-4">{msg}</p>}

        {/* 버튼 */}
        <div className="flex gap-4 justify-center">
          <StepButton onClick={handleSignUp}>확인</StepButton>
          <StepButton type="prev" onClick={() => navigate(-1)}>
            취소
          </StepButton>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
