// src/pages/scholarship/scholarship.js
// 홈 화면(장학금 목록) 전용 스크립트

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
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
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
    emptyMessage.style.display = "block";
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

initScholarshipPage();
