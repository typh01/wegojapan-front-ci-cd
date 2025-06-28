// src/components/Member/SignUp/VerifyCode.jsx
import axios from "axios";

const VerifyCode = ({ email, verifyCode, setCodeVerified, setMsg }) => {
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const handleVerifyCode = () => {
    axios
      .post(`${apiUrl}/api/emails/verify-code`, {
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
      className="px-4 py-2 bg-white text-black border border-gray-400 rounded hover:bg-gray-100"
    >
      확인
    </button>
  );
};

export default VerifyCode;
