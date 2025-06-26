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
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const checkId = () => {
    if (!idRegex.test(formData.memberId)) {
      setMsg("아이디 형식이 올바르지 않습니다.");
      return;
    }
    axios
      .post(`${apiUrl}/auth/check-id`, { memberId: formData.memberId })
      .then(() => {
        setIsIdChecked(true);
        setMsg("아이디 사용이 가능합니다.");
      })
      .catch(() => {
        setMsg("아이디 중복 확인 중 오류가 발생했습니다.");
        setIsIdChecked(false);
      });
  };

  const checkEmailDuplicate = () => {
    if (!emailRegex.test(formData.email)) {
      setMsg("유효한 이메일을 입력해주세요.");
      return;
    }
    axios
      .post(`${apiUrl}/auth/check-email`, { email: formData.email })
      .then(() => {
        setIsEmailChecked(true);
        setMsg("이메일 사용이 가능합니다.");
      })
      .catch(() => {
        setMsg("이메일 중복 확인 중 오류가 발생했습니다.");
        setIsEmailChecked(false);
      });
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
    if (!isIdChecked) return setMsg("아이디 중복 확인을 해주세요.");
    if (!isEmailChecked) return setMsg("이메일 중복 확인을 해주세요.");
    if (!codeVerified) return setMsg("이메일 인증 후 회원가입 해주세요.");

    axios
      .post(`${apiUrl}/members`, {
        memberId,
        memberPw,
        memberName,
        email,
      })
      .then(() => {
        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      })
      .catch((err) =>
        setMsg(err.response?.data?.message || "회원가입에 실패했습니다.")
      );
  };

  return (
    <div className="flex justify-center items-center py-10">
      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-md p-10 rounded-2xl w-[500px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">회원 가입</h2>

        <label className="block mb-2">닉네임</label>
        <input
          type="text"
          value={formData.memberName}
          onChange={(e) =>
            setFormData({ ...formData, memberName: e.target.value })
          }
          className="border px-3 py-2 w-full rounded mb-4"
        />

        <label className="block mb-2">아이디</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={formData.memberId}
            onChange={(e) => {
              setFormData({ ...formData, memberId: e.target.value });
              setIsIdChecked(false);
            }}
            className="border px-3 py-2 w-full rounded"
          />
          <button
            type="button"
            onClick={checkId}
            className="border px-4 py-2 rounded whitespace-nowrap"
          >
            중복 확인
          </button>
        </div>

        <label className="block mb-2">비밀번호</label>
        <input
          type="password"
          value={formData.memberPw}
          onChange={(e) =>
            setFormData({ ...formData, memberPw: e.target.value })
          }
          className="border px-3 py-2 w-full rounded mb-4"
        />

        <label className="block mb-2">비밀번호 확인</label>
        <input
          type="password"
          value={formData.memberPwConfirm}
          onChange={(e) =>
            setFormData({ ...formData, memberPwConfirm: e.target.value })
          }
          className="border px-3 py-2 w-full rounded mb-4"
        />

        <label className="block mb-2">이메일</label>
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setIsEmailChecked(false);
            }}
            className="border px-3 py-2 w-full rounded"
          />
          <button
            type="button"
            onClick={checkEmailDuplicate}
            className="border px-4 py-2 rounded whitespace-nowrap"
          >
            중복 확인
          </button>
        </div>

        {isEmailChecked && (
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={formData.verifyCodeInput}
                onChange={(e) =>
                  setFormData({ ...formData, verifyCodeInput: e.target.value })
                }
                className="border px-3 py-2 w-full rounded"
              />
              <VerifyCode
                email={formData.email}
                verifyCode={formData.verifyCodeInput}
                setCodeVerified={setCodeVerified}
                setMsg={setMsg}
              />
            </div>
            <SendVerifyCode
              email={formData.email}
              setMsg={setMsg}
              setCodeSent={() => {}}
            />
          </div>
        )}

        {msg && <p className="text-red-500 text-sm mb-4">{msg}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 w-full rounded"
          >
            확인
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-400 text-white px-4 py-2 w-full rounded"
          >
            취소
          </button>
          <StepButton type="prev">취소</StepButton>
          <StepButton>확인</StepButton>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
