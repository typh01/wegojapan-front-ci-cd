import { useLocation, useNavigate } from "react-router-dom";

const FindIdResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const memberId = location.state?.memberId;

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen py-10">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-xl text-center">
        {/* 아이디 결과 텍스트 */}
        <div className="border border-gray-300 rounded-lg py-12 mb-6 text-xl">
          {memberId ? (
            <p>
              <span className="font-semibold">아이디 :</span> {memberId}
            </p>
          ) : (
            <p className="text-gray-400">아이디 정보를 불러올 수 없습니다.</p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-6 rounded"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/findPassword")}
            className="bg-sky-300 hover:bg-sky-400 text-white py-2 px-6 rounded"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindIdResult;
