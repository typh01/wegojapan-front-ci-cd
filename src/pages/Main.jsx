import React from "react";
import ImageSlider from "../components/Main/ImageSlider";

const Main = () => {
  return (
    <div>
      <ImageSlider />
      {/* 여기에 다른 콘텐츠들도 추가 가능 */}
      <section className="mt-10 px-4">
        <h2 className="text-xl font-bold mb-4">추천 여행지</h2>
        {/* 여행지 카드 리스트 등 */}
      </section>
    </div>
  );
};

export default Main;
