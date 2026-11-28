// src/pages/scholarship/scholarship.js
// 홈 화면(장학금 목록)과 장학금 상세 화면 스크립트

import { fetchJSON, formatNumber, formatDate, isSaved, toggleSaved } from "../../common/common.js"; // 공통 영역 불러오기 (header, footer)

// 상태

let allScholarships = []; // 전체 장학금 목록 (fetchJSON으로 불러온 데이터 저장용)

// 카드
// list: 장학금 목록 (배열)
function joinList(list) {
  if (list === null || list === undefined || list.length === 0) {
    return "-";
  }

  return list.join(", ");
}

// 금액 표시
function createAmountText(amount) {
  if (amount === null || amount === undefined) {
    return "-";
  }

  return `₩${formatNumber(amount)}`;
}

// 마감일 표시
function createDeadlineText(endAt) {
  if (endAt === null || endAt === undefined) {
    return "-";
  }

  return `~ ${formatDate(endAt)}`;
}

// 화면 그리기
// item: 장학금 데이터 객체
function createCardHTML(item) {
  return `
    <article class="scholarship-card">
      <header class="scholarship-card__header">
        <div class="scholarship-card__heading">
          <h3>${item.name}</h3>
          <p>${item.organizationName}</p>
        </div>

        <button
          type="button"
          class="scholarship-card__bookmark"
          aria-label="Save scholarship"
          aria-pressed="false"
        >
          ☆
        </button>
      </header>

      <dl class="scholarship-card__details">
        <div class="scholarship-card__item">
          <dt>Qualification</dt>
          <dd>${joinList(item.eligibilities)}</dd>
        </div>

        <div class="scholarship-card__item">
          <dt>Number of selections</dt>
          <dd>${formatNumber(item.headcount)}</dd>
        </div>

        <div class="scholarship-card__item">
          <dt>Support amount</dt>
          <dd>${createAmountText(item.amount)}</dd>
        </div>

        <div class="scholarship-card__item">
          <dt>Deadline</dt>
          <dd>${createDeadlineText(item.endAt)}</dd>
        </div>
      </dl>

      <a href="/src/pages/scholarship/detail.html?id=${item.id}" class="scholarship-card__detail-link">
        SEE MORE
      </a>
    </article>
  `;
}

// 장학금 목록 화면 그리기
function renderList(list) {
  const listElement = document.querySelector("#scholarship-list");
  const emptyMessage = document.querySelector("#scholarship-empty-message");

  listElement.innerHTML = list.map((item) => createCardHTML(item)).join("");

  if (list.length === 0) {
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;
  }
}

// 검색

// 글자 배열을 검색용 글자로 합치기 (값이 없으면 빈 글자)
// list: 글자 배열 (예: ["차상위", "한부모"])
function listToText(list) {
  if (list === null || list === undefined) {
    return "";
  }

  return list.join(" ");
}

// 검색 대상 글자 만들기 (이름, 기관, 카테고리, 신청자격)
// item: 장학금 데이터 객체
function createSearchText(item) {
  const text = `${item.name} ${item.organizationName} ${listToText(item.categories)} ${listToText(item.eligibilities)}`;

  return text.toLowerCase();
}

// 검색어가 들어 있는 장학금만 골라내기
// list: 장학금 목록 (배열)
// keyword: 검색어 (예: "성적")
function searchScholarships(list, keyword) {
  const word = keyword.trim().toLowerCase();

  if (word === "") {
    return list;
  }

  return list.filter((item) => createSearchText(item).includes(word));
}

// 검색 결과 화면 그리기 (결과가 없으면 안내 문구와 추천 목록 표시)
// result: 검색 결과 (배열)
function renderSearchResult(result) {
  const emptyMessage = document.querySelector("#scholarship-empty-message");

  if (result.length === 0) {
    renderList(allScholarships); // 추천 목록 (추천 기준이 정해지기 전까지는 전체 목록)
    emptyMessage.hidden = false;
    return;
  }

  renderList(result);
}

// 검색 폼 이벤트 연결
function bindSearchForm() {
  const searchForm = document.querySelector("#scholarship-search-form");
  const keywordInput = document.querySelector("#scholarship-keyword");

  if (searchForm === null || keywordInput === null) {
    return;
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // 페이지 새로고침 방지

    const result = searchScholarships(allScholarships, keywordInput.value);
    renderSearchResult(result);
  });
}

// 상세

// 선발 절차 단계 이름 규칙 (단계 이름 규칙이 정해지면 이 키워드만 수정)
const INTERVIEW_KEYWORDS = ["면접", "interview"]; // 면접 일정으로 보여 줄 단계
const RESULT_KEYWORDS = ["발표", "결과", "result", "announce"]; // 결과 발표 일정으로 보여 줄 단계

// 주소(?id=3)에서 장학금 id 읽기 (없으면 null)
function getScholarshipIdFromUrl() {
  const params = new URLSearchParams(location.search);

  return params.get("id");
}

// id가 같은 장학금 찾기 (없으면 null)
// list: 장학금 목록 (배열)
// id: 찾을 장학금 id (주소에서 읽은 글자)
function findScholarshipById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id == id) {
      return list[i];
    }
  }

  return null;
}

// 모집 기간 표시
// startAt: 모집 시작 날짜, endAt: 모집 마감 날짜
function createPeriodText(startAt, endAt) {
  const hasStart = startAt !== null && startAt !== undefined;
  const hasEnd = endAt !== null && endAt !== undefined;

  if (hasStart && hasEnd) {
    return `${formatDate(startAt)} ~ ${formatDate(endAt)}`;
  }

  if (hasStart) {
    return `${formatDate(startAt)} ~`;
  }

  if (hasEnd) {
    return `~ ${formatDate(endAt)}`;
  }

  return "-";
}

// 항목 목록 HTML 만들기 (제출 서류, 기타 장학금 정보 등)
// list: 글자 배열 (예: ["신청서", "성적증명서"])
function createListHTML(list) {
  if (list === null || list === undefined || list.length === 0) {
    return "<li>-</li>";
  }

  return list.map((text) => `<li>${text}</li>`).join("");
}

// 공식 공고 링크 연결 (링크가 없으면 숨김)
// applyUrl: 장학금 기관 사이트 주소
function renderOfficialLink(applyUrl) {
  const officialLink = document.querySelector("#scholarship-official-link");

  if (applyUrl === null || applyUrl === undefined) {
    officialLink.hidden = true;
  } else {
    officialLink.href = applyUrl;
    officialLink.hidden = false;
  }
}

// 선발 절차 단계 날짜 표시 (마감일만 있으면 그 날짜 하나만 표시)
// startAt: 단계 시작 날짜, endAt: 단계 마감 날짜
function createStepDateText(startAt, endAt) {
  const hasStart = startAt !== null && startAt !== undefined;
  const hasEnd = endAt !== null && endAt !== undefined;

  if (hasStart && hasEnd) {
    if (formatDate(startAt) === formatDate(endAt)) {
      return formatDate(endAt);
    }

    return `${formatDate(startAt)} ~ ${formatDate(endAt)}`;
  }

  if (hasEnd) {
    return formatDate(endAt);
  }

  if (hasStart) {
    return formatDate(startAt);
  }

  return "-";
}

// 선발 절차 이름 표시 (예: "서류 심사 → 면접 → 최종 발표")
// procedure: 선발 절차 배열 (예: [{ step: "면접", startAt: null, endAt: "2026-12-01" }])
function createProcedureText(procedure) {
  if (procedure === null || procedure === undefined || procedure.length === 0) {
    return "-";
  }

  return procedure.map((item) => item.step).join(" → ");
}

// 단계 이름에 키워드가 들어 있는 선발 절차만 골라내기
// procedure: 선발 절차 배열
// keywords: 찾을 키워드 배열 (예: ["면접", "interview"])
function findStepsByKeywords(procedure, keywords) {
  if (procedure === null || procedure === undefined) {
    return [];
  }

  return procedure.filter((item) => {
    const name = item.step.toLowerCase();

    for (let i = 0; i < keywords.length; i++) {
      if (name.includes(keywords[i])) {
        return true;
      }
    }

    return false;
  });
}

// 단계별 일정 HTML 만들기 (예: "1차 면접: 2026.12.01")
// steps: 선발 절차 배열
function createScheduleHTML(steps) {
  if (steps.length === 0) {
    return "-";
  }

  return steps
    .map((item) => `${item.step}: ${createStepDateText(item.startAt, item.endAt)}`)
    .join("<br>");
}

// 있는 화면 요소에만 HTML 넣기 (HTML에 아직 없는 구역은 건너뜀)
// selector: 요소 선택자 (예: "#scholarship-result")
// html: 넣을 HTML 글자
function setHTMLIfExists(selector, html) {
  const element = document.querySelector(selector);

  if (element === null) {
    return;
  }

  element.innerHTML = html;
}

// 북마크 별 모양 바꾸기
// saved: 저장 여부 (true 또는 false)
function renderBookmark(saved) {
  const bookmark = document.querySelector("#scholarship-bookmark");

  if (saved) {
    bookmark.textContent = "★";
    bookmark.setAttribute("aria-pressed", "true");
  } else {
    bookmark.textContent = "☆";
    bookmark.setAttribute("aria-pressed", "false");
  }
}

// 북마크 별 연결 (저장 여부 표시 + 클릭하면 저장 / 해제)
// item: 장학금 데이터 객체
function bindBookmark(item) {
  const bookmark = document.querySelector("#scholarship-bookmark");

  renderBookmark(isSaved(item.id));

  bookmark.addEventListener("click", () => {
    const saved = toggleSaved(item.id);

    // 로그인 전이거나 저장에 실패하면 모양을 바꾸지 않음
    if (saved === null) {
      return;
    }

    renderBookmark(saved);
  });
}

// 장학금 상세 화면 그리기
// item: 장학금 데이터 객체
function renderDetail(item) {
  document.querySelector("#scholarship-name").textContent = item.name;
  document.querySelector("#scholarship-organization").textContent = item.organizationName;
  document.querySelector("#scholarship-qualification").textContent = joinList(item.eligibilities);
  document.querySelector("#scholarship-headcount").textContent = formatNumber(item.headcount);
  document.querySelector("#scholarship-amount").textContent = createAmountText(item.amount);
  document.querySelector("#scholarship-period").textContent = createPeriodText(
    item.startAt,
    item.endAt
  );
  document.querySelector("#scholarship-documents").innerHTML = createListHTML(
    item.requiredDocuments
  );
  document.querySelector("#scholarship-procedure").textContent = createProcedureText(
    item.procedure
  );

  // 면접, 결과 발표 일정은 선발 절차에서 단계 이름으로 찾음
  setHTMLIfExists(
    "#scholarship-interview",
    createScheduleHTML(findStepsByKeywords(item.procedure, INTERVIEW_KEYWORDS))
  );
  setHTMLIfExists(
    "#scholarship-result",
    createScheduleHTML(findStepsByKeywords(item.procedure, RESULT_KEYWORDS))
  );
  setHTMLIfExists("#scholarship-additional", createListHTML(item.additionalInfo));

  renderOfficialLink(item.applyUrl);

  // 후기 링크에 장학금 id 붙이기 (이 장학금의 후기만 보기 위함)
  const reviewLink = document.querySelector("#scholarship-review-link");
  reviewLink.href = `${reviewLink.href}?scholarship=${item.id}`;
}

// 상세 화면 오류 표시 (장학금이 없거나 불러오지 못했을 때)
function showDetailError() {
  document.querySelector("#scholarship-detail-error").hidden = false;
  document.querySelector("#scholarship-detail-content").hidden = true;
}

// 시작
// 장학금 상세 화면 초기화
async function initScholarshipDetailPage() {
  const id = getScholarshipIdFromUrl();

  if (id === null || id === "") {
    showDetailError();
    return;
  }

  try {
    const list = await fetchJSON("scholarships.json");
    const item = findScholarshipById(list, id);

    if (item === null) {
      showDetailError();
      return;
    }

    renderDetail(item);
    bindBookmark(item);
  } catch (err) {
    showDetailError();
  }
}

// 시작
// 장학금 목록 화면 초기화
async function initScholarshipPage() {
  const listElement = document.querySelector("#scholarship-list");

  try {
    allScholarships = await fetchJSON("scholarships.json");
    renderList(allScholarships);
    bindSearchForm();
  } catch (err) {
    listElement.textContent = err.message;
  }
}

// 현재 페이지에 맞는 화면만 시작 (홈: 목록 화면, 상세: 상세 화면)
if (document.querySelector("#scholarship-list") !== null) {
  initScholarshipPage();
}

if (document.querySelector("#scholarship-detail-content") !== null) {
  initScholarshipDetailPage();
}
