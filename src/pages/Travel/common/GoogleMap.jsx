import { useEffect, useRef } from "react";

const GoogleMap = ({ lat, lng, title }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const apiKey = window.ENV?.GOOGLE_MAPS_API_KEY;
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (!apiKey) {
      console.error("Google Maps API Key가 설정되지 않았습니다.");
      return;
    }

    if (isNaN(latNum) || isNaN(lngNum)) {
      console.error("Google Maps 좌표가 유효하지 않습니다:", lat, lng);
      return;
    }

    const initMap = () => {
      if (window.google && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: latNum, lng: lngNum },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        const marker = new window.google.maps.Marker({
          position: { lat: latNum, lng: lngNum },
          map,
          title,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        markerRef.current = marker;
      }
    };

    // 이미 로드되었는지 체크
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.setAttribute("loading", "async"); // ✅ 경고 방지
      script.onload = initMap;
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }

    // 💡 Clean-up
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, title]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg border border-gray-300 shadow-sm"
    />
  );
};

export default GoogleMap;
