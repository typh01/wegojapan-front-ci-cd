import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Upload,
  X,
  Plus,
} from "lucide-react";
import StepButton from "../../../components/common/MyPlan/StepButton";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function TravelRegister() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const API_URL = window.ENV.API_URL;
  const token = JSON.parse(localStorage.getItem("tokens"))?.accessToken;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchDistricts();
    fetchCategories();
    fetchOptions();
    if (isEdit) fetchExisting();
  }, [id]);

  // 카테고리 데이터 (TB_TRAVEL_CATEGORY)
  const [categories, setCategories] = useState([]);
  // 구 데이터 (TB_GU)
  const [districts, setDistricts] = useState([]);
  // 여행지 옵션 데이터 (TB_TRAVEL_OPTION)
  const [travelOptions, setTravelOptions] = useState([]);

  const [facilities, setFacilities] = useState({});

  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    categoryNo: "",
    districtNo: "",
    address: "",
    latitude: "",
    longitude: "",
    phone: "",
    email: "",
    website: "",
    explain: "",
    description: "",
  });

  const [operatingHours, setOperatingHours] = useState({
    월: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    화: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    수: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    목: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    금: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    토: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    일: { isOpen: false, startTime: "09:00", endTime: "18:00" },
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef(null);

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const dayNames = {
    월: "월요일",
    화: "화요일",
    수: "수요일",
    목: "목요일",
    금: "금요일",
    토: "토요일",
    일: "일요일",
  };

  const dayColors = {
    월: "#FF6B6B", // Red
    화: "#4ECDC4", // Teal
    수: "#45B7D1", // Blue
    목: "#96CEB4", // Green
    금: "#FFEAA7", // Yellow
    토: "#DDA0DD", // Plum
    일: "#FFB347", // Orange
  };

  const fetchCategories = () => {
    axios
      .get(`${API_URL}/api/admin/travels/category`, { headers })
      .then((res) => {
        const categoryList = res.data.data.map((cat) => ({
          id: cat.categoryNo,
          name: cat.categoryName,
          status: cat.categoryStatus === "Y" ? "ACTIVE" : "INACTIVE",
          createdDate: cat.categoryCreatedDate,
          modifiedDate: cat.categoryModifiedDate,
        }));
        setCategories(categoryList);
      })
      .catch((err) => {
        console.error("카테고리 목록 조회 실패:", err);
      });
  };

  const fetchDistricts = () => {
    axios
      .get(`${API_URL}/api/admin/travels/gu`, { headers })
      .then((res) => {
        const guList = res.data.data.map((gu) => ({
          id: gu.guNo,
          name: gu.guName,
          cityNo: gu.cityNo,
          status: gu.guStatus === "Y" ? "ACTIVE" : "INACTIVE",
          mapX: gu.guMapX || "",
          mapY: gu.guMapY || "",
          createdDate: gu.guCreatedDate,
          modifiedDate: gu.guModifiedDate,
        }));
        setDistricts(guList);
      })
      .catch((err) => {
        console.error("구/군 목록 조회 실패:", err);
      });
  };

  const fetchOptions = () => {
    axios
      .get(`${API_URL}/api/admin/travels/option`, { headers })
      .then((res) => {
        const optionList = res.data.data.map((opt) => ({
          id: opt.optionNo,
          name: opt.optionName,
          status: opt.optionStatus === "Y" ? "ACTIVE" : "INACTIVE",
          createdDate: opt.optionCreatedDate,
          modifiedDate: opt.optionModifiedDate,
        }));
        setTravelOptions(optionList);
      })
      .catch((err) => {
        console.error("옵션 목록 조회 실패:", err);
      });
  };

  const fetchExisting = () => {
    axios
      .get(`${API_URL}/api/admin/travels/${id}`, { headers })
      .then((res) => {
        const d = res.data.data;
        setFormData({
          name: d.title,
          categoryNo: d.categoryNo,
          districtNo: d.guNo,
          address: d.address,
          latitude: d.mapY,
          longitude: d.mapX,
          phone: d.tel,
          email: d.email,
          website: d.website,
          explain: d.explain,
          description: d.description,
          imageList: d.imageList || [],
        });
        // 2) 운영 시간 세팅 (기본 false로 초기화 후 서버 데이터 덮어쓰기)
        const hours = {};
        days.forEach((day) => {
          hours[day] = { isOpen: false, startTime: "09:00", endTime: "18:00" };
        });
        d.timeList.forEach((t) => {
          hours[t.dayOfWeek] = {
            isOpen: true,
            startTime: t.startTime,
            endTime: t.endTime,
          };
        });
        setOperatingHours(hours);

        // 3) 옵션 토글 스위치 세팅
        const opts = {};
        d.optionListForView.forEach((o) => {
          opts[o.optionNo] = true;
        });
        setFacilities(opts);

        // 4) 사용자 태그 세팅
        setUserTags(d.tagListForView.map((t) => t.tagName));

        // 5) 이미지 (기존 URL 로딩)
        // 기존 File 객체와 구분하기 위해 url 프로퍼티로 래핑
        const wrapped = d.imageList.map((img) => ({ url: img.imageUrl }));
        setUploadedImages(wrapped);
      })
      .catch(() => alert("데이터 로드 실패"));
  };

  const toggleDay = (day) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
      },
    }));
  };

  const toggleAllDays = () => {
    const allOpen = days.every((day) => operatingHours[day].isOpen);
    const newState = !allOpen;

    setOperatingHours((prev) => {
      const updated = { ...prev };
      days.forEach((day) => {
        updated[day] = { ...updated[day], isOpen: newState };
      });
      return updated;
    });
  };

  const updateTime = (day, timeType, value) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeType]: value,
      },
    }));
  };

  const handleImageUpload = (e) => {
    const MAX_IMAGES = 5;
    const newFiles = Array.from(e.target.files || []).map((f) => ({ file: f }));

    setUploadedImages((prev) => {
      const total = prev.length + newFiles.length;
      if (total > MAX_IMAGES) {
        alert(`이미지는 최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다.`);
        return [...prev, ...newFiles.slice(0, MAX_IMAGES - prev.length)];
      }
      return [...prev, ...newFiles];
    });
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToS3 = (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return axios
      .post(`${API_URL}/api/upload/s3`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => {
        console.error("S3 업로드 실패", err);
        alert("이미지 업로드 실패");
        throw err; // 이후 처리 중단 위해 throw
      });
  };

  const toggleFacility = (optionId) => {
    setFacilities((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;

    // 앞에 #이 없으면 붙이기
    const formatted = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

    if (!userTags.includes(formatted)) {
      setUserTags((prev) => [...prev, formatted]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove) => {
    setUserTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ① 기존에 있던 URL
    const existingUrls = uploadedImages
      .filter((item) => item.url)
      .map((item) => item.url);

    // ② 새로 선택된 File[] 추출
    const newFiles = uploadedImages
      .filter((item) => item.file)
      .map((item) => item.file);

    // ③ 새 파일만 S3에 업로드 (없으면 빈 배열)
    const uploadPromise = newFiles.length
      ? uploadImagesToS3(newFiles) // 새로운 파일(newFiles)만 서버에 보냅니다.
      : Promise.resolve([]);

    uploadPromise
      .then((newUrls) => {
        // ④ 전체 URL 리스트
        const allUrls = [...existingUrls, ...newUrls];

        // ⑤ 페이로드용 imageList
        const imageList = allUrls.map((url) => ({ imageUrl: url }));

        // 기존에 쓰던 로직 그대로…
        const timeList = Object.entries(operatingHours)
          .filter(([_, v]) => v.isOpen)
          .map(([day, v]) => ({
            dayOfWeek: day,
            startTime: v.startTime,
            endTime: v.endTime,
          }));

        const optionList = Object.entries(facilities)
          .filter(([_, sel]) => sel)
          .map(([id]) => ({ travelOptionNo: Number(id) }));

        const tagList = userTags.map((tagName) => ({
          tagNo: null,
          tagName,
        }));

        const finalPayload = {
          title: formData.name,
          categoryNo: formData.categoryNo,
          guNo: formData.districtNo,
          address: formData.address,
          mapY: formData.latitude,
          mapX: formData.longitude,
          tel: formData.phone,
          email: formData.email,
          website: formData.website,
          explain: formData.explain,
          description: formData.description,
          timeList,
          optionList,
          tagList,
          imageList, // ← 업데이트된 전체 리스트
        };

        // ⑥ 등록/수정 요청
        const request = isEdit
          ? axios.put(`${API_URL}/api/admin/travels/${id}`, finalPayload, {
              headers,
            })
          : axios.post(`${API_URL}/api/admin/travels`, finalPayload, {
              headers,
            });

        return request;
      })
      .then(() => {
        alert(isEdit ? "수정 성공!" : "등록 성공!");
        navigate(-1);
      })
      .catch((err) => {
        console.error("오류 발생:", err);
        alert("이미지 업로드 또는 요청 처리 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div
            className="text-white p-6 rounded-t-lg"
            style={{
              background:
                "linear-gradient(135deg, #61A0D4 0%, #73B3DF 50%, #76D9E4 100%)",
            }}
          >
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              {isEdit ? "여행지 수정" : "여행지 등록"}
            </h1>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-400">
                    기본 정보
                  </h3>
                  <span className="text-sm text-red-500">
                    * 는 필수 입니다.
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      여행지명 *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="여행지 이름을 입력하세요"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      카테고리 *
                    </label>
                    <select
                      id="category"
                      value={formData.categoryNo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryNo: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- 카테고리를 선택하세요 --</option>{" "}
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    지역구 *
                  </label>
                  <select
                    id="district"
                    value={formData.districtNo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        districtNo: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- 지역을 선택하세요 --</option>{" "}
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    주소 *
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="상세 주소를 입력하세요"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="latitude"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      위도 *
                    </label>
                    <input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      placeholder="37.5665"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="longitude"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      경도 *
                    </label>
                    <input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      placeholder="126.9780"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                    >
                      <Phone className="h-4 w-4" />
                      연락처
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="010-0000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                    >
                      <Mail className="h-4 w-4" />
                      이메일
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="example@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                    >
                      <Globe className="h-4 w-4" />
                      웹사이트
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="explain"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    대표 설명
                  </label>
                  <textarea
                    id="explain"
                    placeholder="여행지 대표 설명을 입력하세요"
                    rows={2}
                    value={formData.explain}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        explain: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    상세 설명
                  </label>
                  <textarea
                    id="description"
                    placeholder="여행지에 대한 상세한 설명을 입력하세요"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  이미지 업로드
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    이미지를 드래그하거나 클릭하여 업로드하세요
                    <br />
                    (첫 번 이미지가 대표 이미지입니다. 최대 5개 이미지 업로드
                    가능).
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-blue-300 text-blue-400 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    파일 선택
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((item, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={
                              item.url
                                ? item.url
                                : URL.createObjectURL(item.file)
                            }
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 운영 정보 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  운영 정보
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    운영 요일
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={toggleAllDays}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        backgroundColor: days.every(
                          (day) => operatingHours[day].isOpen
                        )
                          ? "#73B3DF"
                          : "white",
                        color: days.every((day) => operatingHours[day].isOpen)
                          ? "white"
                          : "#61A0D4",
                        borderColor: "#73B3DF",
                      }}
                    >
                      전체 운영 (
                      {days.every((day) => operatingHours[day].isOpen)
                        ? "해제"
                        : "설정"}
                      )
                    </button>

                    <div className="flex flex-wrap gap-2">
                      {days.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className="min-w-[60px] px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{
                            backgroundColor: operatingHours[day].isOpen
                              ? dayColors[day]
                              : "white",
                            color: operatingHours[day].isOpen
                              ? "white"
                              : "#374151",
                            border: operatingHours[day].isOpen
                              ? `1px solid ${dayColors[day]}`
                              : "1px solid #d1d5db",
                          }}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-medium text-gray-700">
                    운영 시간
                  </label>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-medium"
                        style={{
                          backgroundColor: operatingHours[day].isOpen
                            ? dayColors[day]
                            : "#D1D5DB",
                        }}
                      >
                        {day}
                      </div>

                      <div className="w-16 text-sm font-medium text-gray-700">
                        {dayNames[day]}
                      </div>

                      {operatingHours[day].isOpen ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={operatingHours[day].startTime}
                            onChange={(e) =>
                              updateTime(day, "startTime", e.target.value)
                            }
                            className="w-34px px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-500">~</span>
                          <input
                            type="time"
                            value={operatingHours[day].endTime}
                            onChange={(e) =>
                              updateTime(day, "endTime", e.target.value)
                            }
                            className="w-34 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-blue-500 ml-2">
                            운영시간({operatingHours[day].startTime} ~{" "}
                            {operatingHours[day].endTime})
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 text-gray-400 text-sm">
                          휴무일({day}요일은 운영하지 않습니다)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 사용자 태그 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400">
                  사용자 태그
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="태그를 입력하세요"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {userTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {userTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-gray-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-cyan-200 rounded-full p-0.5 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 축제 편의시설 및 정보 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  축제 편의시설 및 정보
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {travelOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <span className="text-sm font-medium text-gray-700 flex-1">
                        {option.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFacility(option.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          facilities[option.id]
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                            facilities[option.id]
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-center gap-4 pt-6">
              <StepButton type="prev">취소</StepButton>
              <StepButton onClick={() => formRef.current?.requestSubmit()}>
                {isEdit ? "수정" : "등록"}
              </StepButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TravelRegister;
