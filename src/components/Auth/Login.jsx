import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { idRegex, pwRegex } from "./Regex";
import { AuthContext } from "../Context/AuthContext";
import StepButton from "../common/MyPlan/StepButton";

const Login = () => {
  const [formData, setFormData] = useState({
    memberId: "",
    memberPw: "",
  });
  const { login } = useContext(AuthContext);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { memberId, memberPw } = formData;

    if (!idRegex.test(memberId)) {
      setMsg("아이디 형식이 올바르지 않습니다.");
      return;
    }
    if (!pwRegex.test(memberPw)) {
      setMsg("비밀번호 형식이 올바르지 않습니다.");
      return;
    }

    axios
      .post(`${apiUrl}/api/auth/login`, { memberId, memberPw })
      .then((response) => {
        if (response.status === 200) {
          const { loginInfo, tokens } = response.data.data;
          if (loginInfo.isActive === "S" || loginInfo.isActive === "N") {
            alert("정지된 계정입니다.");
            return;
          }
          login(loginInfo, tokens);
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
        setMsg("아이디 혹은 비밀번호가 잘못 입력되었습니다.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md p-10 rounded-xl w-[400px]"
      >
        <h2 className="text-2xl font-bold text-center mb-8">로그인</h2>

        {/* 아이디 입력 */}
        <label className="block mb-1">아이디</label>
        <input
          type="text"
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          className="border px-3 py-2 w-full rounded mb-4"
        />

        {/* 비밀번호 입력 */}
        <label className="block mb-1">비밀번호</label>
        <input
          type="password"
          name="memberPw"
          value={formData.memberPw}
          onChange={handleChange}
          className="border px-3 py-2 w-full rounded mb-4"
        />

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => navigate("/FindId")}
            className="text-sm text-gray-700 hover:underline mr-4"
          >
            아이디 찾기
          </button>
          <button
            type="button"
            onClick={() => navigate("/findPassword")}
            className="text-sm text-gray-700 hover:underline"
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 에러 메시지 */}
        {msg && <p className="text-red-500 text-sm mb-4 text-center">{msg}</p>}

        {/* 버튼 영역 */}
        <div className="flex gap-4 justify-center">
          <StepButton onClick={handleLogin}>확인</StepButton>
          <StepButton type="prev" onClick={() => navigate(-1)}>
            취소
          </StepButton>
        </div>
      </form>
    </div>
  );
};

export default Login;
