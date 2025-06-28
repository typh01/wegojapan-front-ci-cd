// src/components/Member/SignUp/SendVerifyCode.jsx
import axios from "axios";
import { emailRegex } from "./Regex";

const SendVerifyCode = ({ email, setCodeSent, setMsg }) => {
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const sendCode = () => {
    if (!emailRegex.test(email)) {
      setMsg("유효한 이메일을 입력해주세요.");
      return;
    }

    axios
      .post(`${apiUrl}/api/emails/send-email`, { email })
      .then(() => {
        setCodeSent(true);
        setMsg("인증번호를 발송했습니다.");
      })
      .catch((error) => {
        console.log(error);
        setMsg("인증번호 발송 실패");
      });
  };

  return (
    <button
      type="button"
      onClick={sendCode}
      className="px-4 py-2 bg-white text-black border border-gray-400 rounded hover:bg-gray-100"
    >
      인증번호 발송
    </button>
  );
};

export default SendVerifyCode;
