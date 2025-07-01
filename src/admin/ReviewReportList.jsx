import { useEffect, useState } from "react";

const ReviewReportList = () => {
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    // 여긴 나중에 fetch로 대체 가능
    const dummyData = [
      {
        reportNo: 1,
        reviewTitle: "너무 별로예요",
        reviewAuthor: "김한슬",
        reason: "욕설/혐오 발언 포함한 내용입니다.",
        createdAt: "2025-06-30",
        status: "미처리",
      },
      {
        reportNo: 2,
        reviewTitle: "좋아요!",
        reviewAuthor: "이성민",
        reason: "기타",
        createdAt: "2025-06-29",
        status: "처리 완료",
      },
    ];
    setReportList(dummyData);
  }, []);

  return (
    <div className="px-10 py-6">
      <h2 className="text-2xl font-semibold mb-5">리뷰 신고 조회</h2>

      <table className="w-full text-sm text-center border-t border-b">
        <thead className="bg-[#f8f8f8] text-sm font-medium text-gray-700 border-y">
          <tr>
            <th className="py-3">No</th>
            <th className="py-3">리뷰 제목</th>
            <th className="py-3">작성자</th>
            <th className="py-3">신고 사유</th>
            <th className="py-3">신고일자</th>
            <th className="py-3">처리 상태</th>
          </tr>
        </thead>
        <tbody>
          {reportList.map((item, index) => (
            <tr
              key={item.reportNo}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="py-3">{index + 1}</td>
              <td className="py-3">{item.reviewTitle}</td>
              <td className="py-3">{item.reviewAuthor}</td>
              <td className="py-3">{item.reason}</td>
              <td className="py-3">{item.createdAt}</td>
              <td
                className={`py-3 font-semibold ${
                  item.status === "미처리"
                    ? "text-red-500"
                    : item.status === "반려"
                    ? "text-orange-500"
                    : "text-gray-400"
                }`}
              >
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewReportList;
