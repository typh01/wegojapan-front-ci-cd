import { useState } from "react";

const ReviewReportModal = ({ isOpen, onClose, author, postTitle }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [detail, setDetail] = useState("");

  const reasons = [
    "스팸홍보/도배글입니다.",
    "불법정보를 포함하고 있습니다.",
    "청소년에게 유해한 내용입니다.",
    "욕설/혐오 발언 포함한 내용입니다.",
    "개인정보 노출 게시물입니다.",
    "불쾌한 표현이 있습니다.",
    "기타",
  ];
  4;

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }
    alert("신고가 완료되었습니다.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">리뷰 신고하기</h2>

        <div className="text-sm text-gray-600 mb-2">
          <div className="mb-1">
            <strong>작성자:</strong> {author || "게시글 작성자 이름"}
          </div>
          <div>
            <strong>내용:</strong> {postTitle || "게시글 제목"}
          </div>
        </div>

        <div className="border-t my-3" />

        <div className="mb-4">
          <p className="font-semibold mb-2">사유 선택</p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {reasons.map((reason) => (
              <label key={reason} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="accent-blue-600"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedReason === "기타" && (
          <textarea
            className="w-full h-24 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="상세 내용을 입력해주세요."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        )}

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewReportModal;
