// 학원 공통 정보. 연락처와 신청 주소는 기존 대치베스트 사이트 값을 사용한다.
window.SITE = {
  name: "대치베스트어학원",
  phone: "02-556-3510",
  phoneTel: "025563510",
  address: "서울 강남구 선릉로 64길 11-2, 6층",
  hours: "평일 14:00 ~ 22:00 · 토요일 10:00 ~ 18:00 · 일요일 휴무",
  // 짧은 주소 대신 항목을 채울 수 있는 원본 주소. 선택지는 실제 폼에 있는 값만 쓴다.
  formBase: "https://docs.google.com/forms/d/e/1FAIpQLScRi-qijS5RmWd2eidLXIg_AZbYN_hfl9oQIidDl8FfPIVfqA/viewform",
  formFields: {
    intent: "entry.877086558",
    grade: "entry.1447751006"
  },
  formIntentChoices: {
    test: "테스트 예약",
    consult: "상담 전화"
  },
  formGradeChoices: ["초등 5학년", "초등 6학년", "중 1학년", "중 2학년", "중 3학년"],
  mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent("서울 강남구 선릉로 64길 11-2")}&z=16&output=embed`,
  naverMap: `https://map.naver.com/p/search/${encodeURIComponent("서울 강남구 선릉로 64길 11-2")}`,
  owner: "강형경",
  bizNo: "306-95-41453",
  registrationNo: "제14193호",
  logo: "img/logo-custom.png",
  menu: [
    {
      key: "about",
      label: "학원소개",
      href: "about.html",
      items: [
        ["인사말", "about.html#greeting"],
        ["학원시스템", "about.html#system"],
        ["입시로드맵", "about.html#roadmap"],
        ["입학테스트", "admission.html"]
      ]
    },
    {
      key: "elementary",
      label: "초등부",
      href: "elementary.html",
      items: [
        ["정규프로그램", "elementary.html#regular"],
        ["클리닉 프로그램", "elementary.html#clinic"],
        ["시간표", "elementary.html#timetable"],
        ["관리시스템", "elementary.html#care"]
      ]
    },
    {
      key: "middle",
      label: "중등부",
      href: "middle.html",
      items: [
        ["정규프로그램", "middle.html#regular"],
        ["내신프로그램", "middle.html#exam"],
        ["시간표", "middle.html#timetable"],
        ["관리시스템", "middle.html#care"]
      ]
    },
    {
      key: "high",
      label: "고등부",
      href: "high.html",
      items: [
        ["정규프로그램", "high.html#regular"],
        ["내신프로그램", "high.html#exam"],
        ["시간표", "high.html#timetable"],
        ["관리시스템", "high.html#care"]
      ]
    },
    {
      key: "information",
      label: "입시정보",
      href: "information.html",
      items: [
        ["교육정보", "information.html#edu"],
        ["설명회 소식", "information.html#events"],
        ["공지사항", "information.html#notices"],
        ["FAQ", "information.html#faq"]
      ]
    }
  ]
};

// 버튼 종류에 맞춰 폼의 신청 유형을 채운 주소를 만든다. 폼에 없는 학년은 넣지 않는다.
window.SITE.formLink = (intent, grade) => {
  const url = new URL(window.SITE.formBase);
  url.searchParams.set("usp", "pp_url");
  const intentValue = window.SITE.formIntentChoices[intent];
  if (intentValue) url.searchParams.set(window.SITE.formFields.intent, intentValue);
  if (grade && window.SITE.formGradeChoices.includes(grade)) {
    url.searchParams.set(window.SITE.formFields.grade, grade);
  }
  return url.toString();
};
