import { useEffect } from "react";

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=6b4edd04eb802c3827619d6e15a7dda5&autoload=false";
    script.async = true;

    script.onload = () => {
      const mapX = 126.8328079386;
      const mapY = 37.3174194555;
      const title = "호텔";
      window.kakao.maps.load(() => {
        // 1. 지도 생성
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(mapY, mapX),
          level: 4,
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 2. 마커 이미지 설정
        const imageSrc = "숙박.png"; // 사용자 지정 마커 이미지
        const imageSize = new window.kakao.maps.Size(70, 70);
        const imageOption = { offset: new window.kakao.maps.Point(35, 70) };
        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        // 3. 마커 생성 및 지도에 표시
        const markerPosition = new window.kakao.maps.LatLng(mapY, mapX);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });
        marker.setMap(map);

        // 4. 커스텀 오버레이 HTML 생성
        const content = `
          <div class="customoverlay">
            <a href="https://map.kakao.com/link/to/${title},${mapY},${mapX}" target="_blank">
              <span class="title">${title}</span>
            </a>
          </div>
        `;

        // 5. 커스텀 오버레이 생성
        const customOverlay = new window.kakao.maps.CustomOverlay({
          map,
          position: markerPosition,
          content,
          yAnchor: 1,
        });
      });
    };

    document.head.appendChild(script);

    // 6. 커스텀 오버레이 스타일 삽입
    const style = document.createElement("style");
    style.innerHTML = `
      .customoverlay {
        position:relative; bottom:85px; border-radius:6px;
        border: 1px solid #ccc; border-bottom:2px solid #ddd; float:left;
      }
      .customoverlay:nth-of-type(n) {
        border:0; box-shadow:0px 1px 2px #888;
      }
      .customoverlay a {
        display:block; text-decoration:none; color:#000; text-align:center;
        border-radius:6px; font-size:14px; font-weight:bold; overflow:hidden;
        background: #d95050 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png)
          no-repeat right 14px center;
      }
      .customoverlay .title {
        display:block; text-align:center; background:#fff;
        margin-right:35px; padding:10px 15px; font-size:14px; font-weight:bold;
      }
      .customoverlay:after {
        content:''; position:absolute; margin-left:-12px; left:50%;
        bottom:-12px; width:22px; height:12px;
        background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png');
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "1200px", height: "700px" }}></div>
    </div>
  );
}

export default App;
