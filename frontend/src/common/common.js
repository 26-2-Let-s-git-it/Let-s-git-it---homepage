// src/common/common.js

// 공통 영역 불러오기 (header, footer)
// selector: 불러온 HTML을 넣을 요소 선택자
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

// fileName: 불러올 JSON 파일 이름 (예: "scholarships.json")
export async function fetchJSON(fileName) {
  const response = await fetch(`${DATA_PATH}${fileName}`);

  if (!response.ok) {
    throw new Error(`데이터를 불러오지 못했습니다. (${fileName}, 상태 코드: ${response.status})`);
  }

  return await response.json();
}

// 화면 표시용 변환 (홈, 장학금 목록, 장학금 상세 등에서 공통으로 쓰는 함수)

// 숫자를 3자리마다 콤마(,)를 넣은 문자열로 변환
// value: 변환할 숫자 (예: 1000000)
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

// 날짜를 YYYY.MM.DD 형식으로 변환
// dateText: 변환할 날짜 문자열 (예: "2023-05-01")
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

const USER_KEY = "scholarMap:user"; // localStorage에 로그인 상태를 저장할 때 사용할 키

// 로그인 상태 가져오기
export function getUser() {
  try {
    const saved = localStorage.getItem(USER_KEY);

    if (saved === null) {
      return null;
    }

    return JSON.parse(saved);
  } catch (err) {
    return null;
  }
}

// 로그인 상태 저장
export function setUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    alert("로그인 상태를 저장하지 못했습니다.");
    return;
  }

  updateAuthMenu();
}

// 로그아웃 처리
export function logout() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    alert("로그아웃 처리 중 문제가 생겼습니다.");
    return;
  }

  updateAuthMenu();
}

// 로그인 상태에 따라 메뉴 표시
function updateAuthMenu() {
  const loginLink = document.querySelector(".site-header__login");
  const logoutButton = document.querySelector(".site-header__logout");

  if (loginLink === null || logoutButton === null) {
    return;
  }

  if (getUser() === null) {
    loginLink.style.display = "";
    logoutButton.style.display = "none";
  } else {
    loginLink.style.display = "none";
    logoutButton.style.display = "inline-block";
  }
}

// 로그아웃 버튼 클릭 이벤트 연결
function bindLogoutButton() {
  const logoutButton = document.querySelector(".site-header__logout");

  if (logoutButton === null) {
    return;
  }

  logoutButton.addEventListener("click", () => {
    logout();
  });
}

// 장학금 저장 (북마크)

const SAVED_KEY = "scholarMap:saved"; // localStorage에 저장한 장학금 id 목록을 보관할 때 사용할 키
const LOGIN_PAGE = "/src/pages/auth/login.html"; // 로그인 페이지 경로

// 저장한 장학금 id 목록 가져오기 (로그인 전이거나 저장된 값이 없으면 빈 배열)
export function getSavedIds() {
  if (getUser() === null) {
    return [];
  }

  try {
    const saved = localStorage.getItem(SAVED_KEY);

    if (saved === null) {
      return [];
    }

    return JSON.parse(saved);
  } catch (err) {
    return [];
  }
}

// 저장한 장학금인지 확인
// id: 장학금 id (예: 3)
export function isSaved(id) {
  return getSavedIds().includes(`${id}`);
}

// 장학금 저장 상태 바꾸기 (저장됨 → 해제, 해제 → 저장)
// 바뀐 뒤의 저장 여부(true / false)를 돌려주고, 로그인 전이거나 저장에 실패하면 null을 돌려줌
// id: 장학금 id (예: 3)
export function toggleSaved(id) {
  if (getUser() === null) {
    location.href = LOGIN_PAGE; // 비회원은 로그인 페이지로 이동
    return null;
  }

  const savedId = `${id}`;
  const ids = getSavedIds();
  let next = [];

  if (ids.includes(savedId)) {
    next = ids.filter((item) => item !== savedId);
  } else {
    next = ids;
    next[next.length] = savedId;
  }

  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  } catch (err) {
    alert("저장 상태를 바꾸지 못했습니다.");
    return null;
  }

  return next.includes(savedId);
}

// 시작
// 공통 영역 불러오기, 로그인 상태 표시
async function initCommon() {
  await loadPartial("#site-header", "/src/common/header.html");
  updateAuthMenu();
  bindLogoutButton();

  await loadPartial("#site-footer", "/src/common/footer.html");
}

initCommon();
