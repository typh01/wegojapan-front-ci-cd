import { useEffect, useState } from "react";

const TravelReportList = () => {
  const [reportList, setReportList] = useState([]);

  const getStatusColor = (status) => {
    return status === "미처리" ? "text-red-500" : "text-gray-400";
  };

  useEffect(() => {
    const dummyData = [
      {
        reportNo: 1,
        postTitle: "오사카 혼자 여행 팁", // ← 여행지 게시글 제목
        postAuthor: "김한슬",
        reason: "욕설/혐오 발언 포함한 내용입니다.",
        createdAt: "2025-06-30",
        status: "미처리",
      },
      {
        reportNo: 2,
        postTitle: "홋카이도 맛집 리스트",
        postAuthor: "이성민",
        reason: "기타",
        createdAt: "2025-06-29",
        status: "처리 완료",
      },
    ];
    setReportList(dummyData);
  }, []);

  return (
    <div className="px-10 py-6">
      <h2 className="text-2xl font-semibold mb-5">여행지 글 신고 조회</h2>

      <table className="w-full text-sm text-center border-separate border-spacing-y-1">
        <thead className="bg-gray-100 text-gray-700 font-semibold border-y">
          <tr>
            <th className="py-3">No</th>
            <th className="py-3">신고된 글 제목</th>
            <th className="py-3">작성자</th>
            <th className="py-3">신고 사유</th>
            <th className="py-3">신고일자</th>
            <th className="py-3">처리 상태</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {reportList.map((item, index) => (
            <tr
              key={item.reportNo}
              className="border-t text-sm hover:bg-gray-50 transition-colors"
            >
              <td className="py-3">{index + 1}</td>
              <td className="py-3">{item.postTitle}</td>
              <td className="py-3">{item.postAuthor}</td>
              <td className="py-3">{item.reason}</td>
              <td className="py-3">{item.createdAt}</td>
              <td
                className={`py-3 font-semibold ${getStatusColor(item.status)}`}
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

export default TravelReportList;
