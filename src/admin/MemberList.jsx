import React from "react";
import StepButton from "../components/common/MyPlan/StepButton";
import { useNavigate } from "react-router-dom";

const MemberList = () => {
  const navigate = useNavigate();
  const handleSave = (e) => {
    e.preventDefault();
    alert("저장되었습니다.");
    navigate("/adminPage");
  };

  const handleCancel = () => {
    navigate("/adminPage");
  };

  // 더미 데이터
  const dummyMembers = [
    {
      no: 12,
      id: "abcd1234",
      name: "김한슬",
      joinedAt: "2025.04.10",
      role: "관리자",
      isActive: true,
      isBanned: false,
    },
    {
      no: 11,
      id: "asasas111",
      name: "이성민",
      joinedAt: "2025.04.10",
      role: "관리자",
      isActive: false,
      isBanned: false,
    },
    {
      no: 10,
      id: "asasas111",
      name: "이성민",
      joinedAt: "2025.04.10",
      role: "사용자",
      isActive: true,
      isBanned: true,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">회원관리</h2>

      <table className="w-full border-t border-black text-center">
        <thead>
          <tr className="border-b border-black bg-gray-100">
            <th className="py-2">No</th>
            <th>아이디</th>
            <th>이름</th>
            <th>가입일</th>
            <th>역할</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {dummyMembers.map((member) => (
            <tr key={member.no} className="border-b">
              <td className="py-2">{member.no}</td>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.joinedAt}</td>
              <td>
                <select
                  defaultValue={member.role}
                  className="border rounded px-2 py-1"
                  disabled={!member.isActive}
                >
                  <option value="사용자">사용자</option>
                  <option value="관리자">관리자</option>
                </select>
              </td>
              <td>
                {member.isActive ? (
                  member.isBanned ? (
                    <span className="text-yellow-500 font-semibold">정지</span>
                  ) : (
                    <span className="text-green-500 font-semibold">정상</span>
                  )
                ) : (
                  <span className="text-red-500 font-semibold">탈퇴</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 저장 / 취소 버튼 */}
      <div className="flex gap-4 justify-center mt-6">
        <StepButton onClick={handleSave}>저장</StepButton>
        <StepButton type="prev" onClick={handleCancel}>
          취소
        </StepButton>
      </div>
    </div>
  );
};

export default MemberList;
