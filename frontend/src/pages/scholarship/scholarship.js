// src/pages/scholarship/scholarship.js
// 홈 화면(장학금 목록)과 장학금 상세 화면 스크립트

import { fetchJSON, formatNumber, formatDate } from "../../common/common.js"; // 공통 영역 불러오기 (header, footer)

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

// 제출 서류 목록 HTML 만들기
// documents: 제출 서류 이름 배열 (예: ["신청서", "성적증명서"])
function createDocumentsHTML(documents) {
  if (documents === null || documents === undefined || documents.length === 0) {
    return "<li>-</li>";
  }

  return documents.map((name) => `<li>${name}</li>`).join("");
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
  document.querySelector("#scholarship-documents").innerHTML = createDocumentsHTML(
    item.requiredDocuments
  );

  renderOfficialLink(item.applyUrl);
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
