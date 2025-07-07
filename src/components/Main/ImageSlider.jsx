import { useEffect, useState } from "react";

const slides = [
  {
    src: "/오사카성.jpg",
  },
  {
    src: "/벚꽃.jpg",
  },
  {
    src: "/일상.jpg",
  },
  {
    src: "/도톤보리.jpg",
  },
];

const ImageSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[280px] overflow-hidden">
      {" "}
      {/* 높이 줄임 */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.caption || `슬라이드 ${i + 1}`}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;
