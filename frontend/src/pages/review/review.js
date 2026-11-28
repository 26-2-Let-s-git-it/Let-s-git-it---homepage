// src/pages/review/review.js
// 후기 게시판 화면 스크립트 (후기 목록)

import { getUser, formatDate } from "../../common/common.js";
import { apiRequest, API_PATHS } from "../../common/api.js";

// 상태

let currentPage = 1; // 현재 페이지 번호
let currentKeyword = ""; // 현재 검색어 (장학금 이름)
let currentScholarship = null; // 주소(?scholarship=12)로 받은 장학금 id (없으면 null)

// 공통

// 화면에 넣어도 안전한 글자로 바꾸기 (사용자가 쓴 글에 들어 있는 특수문자 처리)
// text: 바꿀 글자
function escapeHTML(text) {
  const value = `${text}`;
  let result = "";

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "&") {
      result = result + "&amp;";
    } else if (char === "<") {
      result = result + "&lt;";
    } else if (char === ">") {
      result = result + "&gt;";
    } else if (char === '"') {
      result = result + "&quot;";
    } else if (char === "'") {
      result = result + "&#39;";
    } else {
      result = result + char;
    }
  }

  return result;
}

// 후기 목록

// 후기 1개를 목록 항목 HTML 문자열로 만들기
// item: 후기 목록의 항목 ({ id, title, scholarshipName, contentPreview, authorNickname, createdAt })
function createReviewItemHTML(item) {
  return `
    <article class="review-item">
      <h2 class="review-item__title">
        <a href="/src/pages/review/detail.html?id=${item.id}" class="review-item__link">
          ${escapeHTML(item.title)}
        </a>
      </h2>

      <p class="review-item__scholarship">${escapeHTML(item.scholarshipName)}</p>
      <p class="review-item__preview">${escapeHTML(item.contentPreview)}</p>

      <div class="review-item__meta">
        <span class="review-item__nickname">${escapeHTML(item.authorNickname)}</span>

        <time class="review-item__date" datetime="${escapeHTML(item.createdAt)}">${formatDate(item.createdAt)}</time>
      </div>
    </article>
  `;
}

// 페이지 번호 버튼과 이전/다음 버튼 그리기 (현재 페이지 주변 최대 5개 번호만 표시)
// page: 현재 페이지 번호, totalPages: 전체 페이지 수
function renderPagination(page, totalPages) {
  const numbers = document.querySelector("#review-page-numbers");
  const prevButton = document.querySelector("#review-prev-page");
  const nextButton = document.querySelector("#review-next-page");

  // 결과가 없어도 1페이지는 보여 줌
  let lastPage = totalPages * 1;

  if (!(lastPage >= 1)) {
    lastPage = 1;
  }

  let first = page - 2;

  if (first < 1) {
    first = 1;
  }

  let last = first + 4;

  if (last > lastPage) {
    last = lastPage;
    first = last - 4;

    if (first < 1) {
      first = 1;
    }
  }

  let html = "";

  for (let number = first; number <= last; number++) {
    if (number === page) {
      html =
        html +
        `<button type="button" id="review-page-${number}" class="review-pagination__number" aria-current="page">${number}</button>`;
    } else {
      html =
        html +
        `<button type="button" id="review-page-${number}" class="review-pagination__number">${number}</button>`;
    }
  }

  numbers.innerHTML = html;

  // 새로 그린 번호 버튼마다 클릭 연결
  for (let number = first; number <= last; number++) {
    document.querySelector(`#review-page-${number}`).addEventListener("click", () => {
      loadReviewList(number);
    });
  }

  prevButton.disabled = page <= 1;
  nextButton.disabled = page >= lastPage;
}

// 후기 목록을 서버에서 불러와 화면에 그리기
// page: 보여 줄 페이지 번호
async function loadReviewList(page) {
  const listElement = document.querySelector("#review-list");
  const emptyMessage = document.querySelector("#review-empty-message");

  // 서버에 보낼 값 (값이 있는 항목만 넣음)
  const query = { page: page };

  if (currentKeyword !== "") {
    query.keyword = currentKeyword;
  }

  if (currentScholarship !== null) {
    query.scholarship = currentScholarship;
  }

  try {
    const result = await apiRequest("GET", API_PATHS.reviews, { query: query });

    // 지워진 글 때문에 없는 페이지가 되었다면 1페이지부터 다시 보여 줌
    if (result.items.length === 0 && page > 1) {
      await loadReviewList(1);
      return;
    }

    currentPage = page;
    listElement.innerHTML = result.items.map((item) => createReviewItemHTML(item)).join("");
    emptyMessage.hidden = result.items.length > 0;
    renderPagination(currentPage, result.totalPages);
  } catch (err) {
    listElement.textContent = err.message;
    emptyMessage.hidden = true;
  }
}

// 글쓰기 링크 표시 (로그인한 사용자에게만 보임)
function renderWriteLink() {
  const writeLink = document.querySelector("#review-write-link");

  writeLink.hidden = getUser() === null;
}

// 주소(?scholarship=12)에서 장학금 id 읽기 (장학금 상세의 "후기 보러가기"로 들어온 경우)
function readScholarshipFromUrl() {
  const params = new URLSearchParams(location.search);
  const scholarship = params.get("scholarship");

  if (scholarship !== null && scholarship !== "") {
    currentScholarship = scholarship;
  }
}

// 검색 폼 이벤트 연결 (검색하면 1페이지부터 다시 보여 줌)
function bindSearchForm() {
  const searchForm = document.querySelector("#review-search-form");
  const keywordInput = document.querySelector("#review-keyword");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // 페이지 새로고침 방지

    currentKeyword = keywordInput.value.trim();
    loadReviewList(1);
  });
}

// 이전/다음 버튼 클릭 이벤트 연결
function bindPageButtons() {
  document.querySelector("#review-prev-page").addEventListener("click", () => {
    loadReviewList(currentPage - 1);
  });

  document.querySelector("#review-next-page").addEventListener("click", () => {
    loadReviewList(currentPage + 1);
  });
}

// 시작
// 후기 목록 화면 초기화
async function initReviewListPage() {
  readScholarshipFromUrl();
  renderWriteLink();
  bindSearchForm();
  bindPageButtons();

  await loadReviewList(1);
}

// 현재 페이지에 맞는 화면만 시작
if (document.querySelector("#review-list") !== null) {
  initReviewListPage();
}
