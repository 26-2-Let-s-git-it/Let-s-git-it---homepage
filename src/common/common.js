// src/common/common.js

// 공통 영역 불러오기 (header, footer)
// selector: 불러온 HTML을 삽입할 대상 요소 선택자
async function loadPartial(selector, path) {
  const target = document.querySelector(selector);

  if (target === null) {
    return;
  }

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`공통 영역을 불러오지 못했습니다. (${path}, 상태 코드: ${response.status})`);
    }

    target.innerHTML = await response.text();
  } catch (err) {
    target.textContent = err.message;
  }
}

// 데이터 불러오기

const DATA_PATH = "/src/assets/data/"; // 데이터 파일 경로

// fileName: 불러올 JSON 파일 이름 (예: "data.json")
export async function fetchJSON(fileName) {
  const response = await fetch(`${DATA_PATH}${fileName}`);

  if (!response.ok) {
    throw new Error(`데이터를 불러오지 못했습니다. (${fileName}, 상태 코드: ${response.status})`);
  }

  return await response.json();
}

// 화면 표시용 변환 (홈, 상세, 캘린더 등에서 공통 사용)
// value: 변환할 값 (숫자, 날짜 등)
export function formatNumber(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  const text = `${value}`;
  let result = "";

  for (let i = 0; i < text.length; i++) {
    result = result + text[i];

    const remaining = text.length - 1 - i;
    if (remaining > 0 && remaining % 3 === 0) {
      result = result + ",";
    }
  }

  return result;
}

// 날짜 형식 변환 (YYYY-MM-DD → YYYY.MM.DD)
export function formatDate(dateText) {
  if (dateText === null || dateText === undefined) {
    return "-";
  }

  let result = "";

  for (let i = 0; i < 10 && i < dateText.length; i++) {
    if (dateText[i] === "-") {
      result = result + ".";
    } else {
      result = result + dateText[i];
    }
  }

  return result;
}

// 로그인 전/후 메뉴 전환

let currentUser = null; // 로그인 상태를 나타내는 전역 변수 (null: 로그아웃 상태, 객체: 로그인 상태)

// 로그인 상태에 따라 메뉴를 전환하는 함수
function updateAuthMenu() {
  const loginLink = document.querySelector(".site-header__login");
  const logoutButton = document.querySelector(".site-header__logout");

  if (loginLink === null || logoutButton === null) {
    return;
  }

  if (currentUser === null) {
    loginLink.style.display = "";
    logoutButton.style.display = "none";
  } else {
    loginLink.style.display = "none";
    logoutButton.style.display = "inline-block";
  }
}

// 로그아웃 버튼 클릭 시 이벤트 처리
function bindLogoutButton() {
  const logoutButton = document.querySelector(".site-header__logout");

  if (logoutButton === null) {
    return;
  }

  logoutButton.addEventListener("click", () => {
    currentUser = null;
    updateAuthMenu();
  });
}

// 시작
// 공통 영역(header, footer) 불러오기, 로그인 전/후 메뉴 전환, 로그아웃 버튼 이벤트 바인딩
async function initCommon() {
  await loadPartial("#site-header", "/src/common/header.html");
  updateAuthMenu();
  bindLogoutButton();

  await loadPartial("#site-footer", "/src/common/footer.html");
}

initCommon();
