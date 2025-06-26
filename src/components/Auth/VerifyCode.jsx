// src/components/Member/SignUp/VerifyCode.jsx
import axios from "axios";

const VerifyCode = ({ email, verifyCode, setCodeVerified, setMsg }) => {
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const handleVerifyCode = () => {
    if (!email || !verifyCode) {
      setMsg("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }

    axios
      .post(`${apiUrl}/auth/verify-code`, {
        email,
        verifyCode,
      })
      .then(() => {
        setCodeVerified(true);
        setMsg("이메일 인증이 완료되었습니다!");
      })
      .catch((error) => {
        console.log(error);
        setMsg("인증번호가 일치하지 않습니다.");
      });
  };

  return (
    <button
      type="button"
      onClick={handleVerifyCode}
      className="px-4 py-2 bg-lime-400 text-white rounded hover:bg-lime-500"
    >
      확인
    </button>
  );
};

export default VerifyCode;
