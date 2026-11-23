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

// 시작
// 장학금 목록 화면 초기화
async function initScholarshipPage() {
  const listElement = document.querySelector("#scholarship-list");

  try {
    allScholarships = await fetchJSON("scholarships.json");
    renderList(allScholarships);
  } catch (err) {
    listElement.textContent = err.message;
  }
}

initScholarshipPage();
