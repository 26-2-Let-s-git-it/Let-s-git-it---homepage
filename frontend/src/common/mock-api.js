// src/common/mock-api.js
// 가짜 서버 (백엔드가 준비되기 전까지 api.js가 사용하고, 준비되면 이 파일은 삭제)
// 서버 명세와 같은 모양으로 응답하고, 데이터는 localStorage에 보관

import { getUser, getAccessToken } from "./common.js";

// 설정

const MOCK_KEY = "scholarMap:mock"; // 가짜 서버 데이터를 보관할 때 사용할 키
const PAGE_SIZE = 10; // 후기 목록 한 페이지 개수
const INVALID_INPUT_MESSAGE = "입력값이 올바르지 않습니다."; // 입력 오류 메시지

// 장학금 이름 목록 (장학금 이름만 조회 API용)
const SCHOLARSHIPS = [
  { id: 21, name: "OO재단 성적우수 장학금" },
  { id: 12, name: "OO구 향토장학금" },
  { id: 15, name: "이화복지장학금" },
];

// 응답 만들기

// status: 상태 코드, data: 서버가 보내는 내용 (없으면 null)
function respond(status, data) {
  return { status: status, data: data };
}

// 오류 응답 만들기
// code: 오류 코드 (예: "REVIEW_NOT_FOUND"), message: 오류 메시지
function fail(status, code, message) {
  return respond(status, { code: code, message: message });
}

// 데이터 보관

// 숫자를 두 자리 글자로 바꾸기 (예: 5 → "05")
function pad2(number) {
  if (number < 10) {
    return `0${number}`;
  }

  return `${number}`;
}

// 처음 한 번만 만드는 기본 데이터
function createSeedData() {
  const reviews = [];
  const nicknames = ["우은성", "김지빈", "다음엔붙자", "변현민", "석동우"];

  // 1~30번 후기 (5의 배수는 테스트 사용자(id 1)가 쓴 글)
  for (let id = 1; id <= 30; id++) {
    const scholarship = SCHOLARSHIPS[id % 3];
    let authorId = 100 + (id % 5);
    let authorNickname = nicknames[id % 5];

    if (id % 5 === 0) {
      authorId = 1;
      authorNickname = "장학생";
    }

    reviews[reviews.length] = {
      id: id,
      title: `${scholarship.name} 후기 ${id}`,
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      authorId: authorId,
      authorNickname: authorNickname,
      appliedDate: "2026-08",
      applicantQualification: "3학년, 직전 학기 평점 3.8",
      receivedAmount: 1000000 + id * 10000,
      content: `후기 ${id}번의 내용입니다. 면접과 서류 준비 과정을 공유합니다.`,
      createdAt: `2026-10-${pad2(id)}T09:00:00+09:00`,
      updatedAt: `2026-10-${pad2(id)}T09:00:00+09:00`,
    };
  }

  // 31~33번 후기 (명세의 예시 데이터, 장학금이 목록에 없으면 scholarshipId는 null)
  reviews[reviews.length] = {
    id: 31,
    title: "서류에서 떨어졌지만 공유합니다",
    scholarshipId: null,
    scholarshipName: "OO재단 장학금",
    authorId: 103,
    authorNickname: "다음엔붙자",
    appliedDate: "2026-09",
    applicantQualification: "2학년, 직전 학기 평점 3.2",
    receivedAmount: 0,
    content:
      "자기소개서 분량을 잘못 확인해서 감점을 받았습니다. 같은 실수를 하지 않도록 공유합니다.",
    createdAt: "2026-11-17T09:30:11+09:00",
    updatedAt: "2026-11-17T09:30:11+09:00",
  };

  reviews[reviews.length] = {
    id: 32,
    title: "이화복지장학금 면접 후기",
    scholarshipId: 15,
    scholarshipName: "이화복지장학금",
    authorId: 102,
    authorNickname: "우은성",
    appliedDate: "2026-08",
    applicantQualification: "3학년, 소득분위 4구간, 직전 학기 평점 3.8",
    receivedAmount: 2000000,
    content:
      "면접방에 들어가자마자 저에게 지원 동기를 물어보셨어요. 준비한 답변을 했더니 가정 형편과 학업 계획을 구체적으로 질문하셨습니다.",
    createdAt: "2026-11-18T21:10:02+09:00",
    updatedAt: "2026-11-18T21:10:02+09:00",
  };

  reviews[reviews.length] = {
    id: 33,
    title: "미래에셋 교환학생 장학금 합격 후기",
    scholarshipId: null,
    scholarshipName: "미래에셋 교환학생 장학금",
    authorId: 101,
    authorNickname: "김지빈",
    appliedDate: "2026-07",
    applicantQualification: "3학년, 직전 학기 평점 4.2",
    receivedAmount: 3000000,
    content:
      "성적 기준이 생각보다 높아서 걱정했는데, 준비한 서류를 꼼꼼히 챙겼더니 최종 합격했습니다.",
    createdAt: "2026-11-19T15:42:35+09:00",
    updatedAt: "2026-11-19T15:42:35+09:00",
  };

  // 32번 후기의 댓글 (59번은 테스트 사용자(id 1)가 쓴 댓글)
  const comments = [
    {
      id: 11,
      reviewId: 32,
      authorId: 201,
      authorNickname: "변현민",
      content: "부러워요. 저도 내년에 지원해 볼게요!",
      createdAt: "2026-11-18T22:52:51+09:00",
      updatedAt: "2026-11-18T23:05:10+09:00",
    },
    {
      id: 59,
      reviewId: 32,
      authorId: 1,
      authorNickname: "장학생",
      content: "축하드려요. 면접 질문 정리 감사합니다.",
      createdAt: "2026-11-19T10:31:10+09:00",
      updatedAt: "2026-11-19T10:31:10+09:00",
    },
  ];

  return { reviews: reviews, comments: comments, nextReviewId: 34, nextCommentId: 60, clock: 0 };
}

// 가짜 서버 데이터 불러오기 (없으면 기본 데이터를 만들어 저장)
function loadData() {
  try {
    const saved = localStorage.getItem(MOCK_KEY);

    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (err) {
    // 저장된 값이 깨졌으면 기본 데이터로 다시 시작
  }

  const data = createSeedData();
  saveData(data);

  return data;
}

// 가짜 서버 데이터 저장
// data: 가짜 서버 데이터 객체
function saveData(data) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
}

// 현재 시각 글자 만들기 (진짜 시계 대신 호출할 때마다 1초씩 늘어나는 가짜 시계)
// data: 가짜 서버 데이터 객체
function now(data) {
  data.clock = data.clock + 1;

  const second = data.clock % 60;
  const minute = (data.clock - second) / 60;

  return `2026-11-30T12:${pad2(minute)}:${pad2(second)}+09:00`;
}

// 도우미

// 경로를 "/" 기준으로 나누기 (예: "/reviews/3" → ["reviews", "3"])
function splitPath(path) {
  const parts = [];
  let current = "";

  for (let i = 0; i < path.length; i++) {
    if (path[i] === "/") {
      if (current !== "") {
        parts[parts.length] = current;
        current = "";
      }
    } else {
      current = current + path[i];
    }
  }

  if (current !== "") {
    parts[parts.length] = current;
  }

  return parts;
}

// 로그인한 사용자 가져오기 (로그인 전이면 null)
function getCurrentUser() {
  if (getAccessToken() === null) {
    return null;
  }

  const saved = getUser();

  if (saved === null || saved.user === undefined) {
    return null;
  }

  return saved.user;
}

// 비어 있는 값인지 확인 (없음, null, 공백만 있는 글자)
function isBlank(value) {
  if (value === undefined || value === null) {
    return true;
  }

  return `${value}`.trim() === "";
}

// id가 같은 후기 찾기 (없으면 null)
// id: 후기 id (숫자)
function findReview(data, id) {
  for (let i = 0; i < data.reviews.length; i++) {
    if (data.reviews[i].id === id) {
      return data.reviews[i];
    }
  }

  return null;
}

// id가 같은 댓글 찾기 (없으면 null)
// reviewId: 후기 id (숫자), commentId: 댓글 id (숫자)
function findComment(data, reviewId, commentId) {
  for (let i = 0; i < data.comments.length; i++) {
    if (data.comments[i].reviewId === reviewId && data.comments[i].id === commentId) {
      return data.comments[i];
    }
  }

  return null;
}

// 내용 앞 20글자 (후기 목록의 한 줄 미리보기)
function createPreview(content) {
  let preview = "";

  for (let i = 0; i < content.length && i < 20; i++) {
    preview = preview + content[i];
  }

  return preview;
}

// 응답 모양으로 바꾸기

// 후기 목록의 한 항목
function toListItem(review) {
  return {
    id: review.id,
    title: review.title,
    scholarshipName: review.scholarshipName,
    contentPreview: createPreview(review.content),
    authorNickname: review.authorNickname,
    createdAt: review.createdAt,
  };
}

// 후기 상세 (isMine: 로그인한 사용자가 쓴 글인지)
// user: 로그인한 사용자 (없으면 null)
function toReviewResponse(review, user) {
  return {
    id: review.id,
    title: review.title,
    authorNickname: review.authorNickname,
    scholarshipId: review.scholarshipId,
    scholarshipName: review.scholarshipName,
    appliedDate: review.appliedDate,
    applicantQualification: review.applicantQualification,
    receivedAmount: review.receivedAmount,
    content: review.content,
    isMine: user !== null && review.authorId === user.id,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

// 댓글
function toCommentResponse(comment, user) {
  return {
    id: comment.id,
    authorNickname: comment.authorNickname,
    content: comment.content,
    isMine: user !== null && comment.authorId === user.id,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

// 입력값 검사

// 후기 입력값 검사 (문제가 있으면 true)
// input: 보낸 내용 객체
// isCreate: 등록이면 true (모든 항목 필수), 수정이면 false (보낸 항목만 검사)
function hasInvalidReviewInput(input, isCreate) {
  const textRules = [
    { name: "title", max: 100 },
    { name: "appliedDate", max: 7 },
    { name: "applicantQualification", max: 200 },
    { name: "content", max: 5000 },
  ];

  for (let i = 0; i < textRules.length; i++) {
    const value = input[textRules[i].name];

    if (value === undefined) {
      if (isCreate) {
        return true;
      }

      continue;
    }

    if (isBlank(value) || `${value}`.length > textRules[i].max) {
      return true;
    }
  }

  const amount = input.receivedAmount;

  if (amount === undefined) {
    if (isCreate) {
      return true;
    }
  } else if (amount !== amount * 1 || amount % 1 !== 0 || amount < 0) {
    // 숫자(0 이상의 정수)가 아니면 오류
    return true;
  }

  return false;
}

// 장학금 id로 장학금 이름 찾기 (없으면 null)
function findScholarshipName(id) {
  for (let i = 0; i < SCHOLARSHIPS.length; i++) {
    if (SCHOLARSHIPS[i].id === id) {
      return SCHOLARSHIPS[i].name;
    }
  }

  return null;
}

// 요청 처리 (후기)

// 후기 목록 조회 (keyword: 장학금 이름 검색, scholarship: 장학금 id, page: 페이지 번호)
function handleReviewList(data, query) {
  let keyword = "";
  let scholarship = null;
  let page = 1;

  if (query !== null) {
    if (query.keyword !== undefined) {
      keyword = `${query.keyword}`.trim().toLowerCase();
    }

    if (query.scholarship !== undefined) {
      scholarship = query.scholarship * 1;
    }

    if (query.page !== undefined) {
      page = query.page * 1;
    }
  }

  if (!(page >= 1)) {
    page = 1;
  }

  // 조건에 맞는 후기를 최신순(저장 순서의 반대)으로 모으기
  const matched = [];

  for (let i = data.reviews.length - 1; i >= 0; i--) {
    const review = data.reviews[i];

    if (keyword !== "" && !review.scholarshipName.toLowerCase().includes(keyword)) {
      continue;
    }

    if (scholarship !== null && review.scholarshipId !== scholarship) {
      continue;
    }

    matched[matched.length] = review;
  }

  // 전체 페이지 수 계산 (나머지가 있으면 한 페이지 더)
  const totalCount = matched.length;
  const remainder = totalCount % PAGE_SIZE;
  let totalPages = (totalCount - remainder) / PAGE_SIZE;

  if (remainder > 0) {
    totalPages = totalPages + 1;
  }

  // 요청한 페이지의 후기만 꺼내기
  const items = [];
  const start = (page - 1) * PAGE_SIZE;

  for (let i = start; i < start + PAGE_SIZE && i < totalCount; i++) {
    items[items.length] = toListItem(matched[i]);
  }

  return respond(200, { items: items, page: page, totalPages: totalPages, totalCount: totalCount });
}

// 후기 등록
function handleReviewCreate(data, user, body) {
  if (user === null) {
    return fail(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  if (body === null || hasInvalidReviewInput(body, true)) {
    return fail(400, "INVALID_INPUT", INVALID_INPUT_MESSAGE);
  }

  // 장학금: 목록에 있는 장학금(id)이거나, id 없이 직접 입력한 이름
  let scholarshipId = null;
  let scholarshipName = null;

  if (body.scholarshipId === null || body.scholarshipId === undefined) {
    if (isBlank(body.scholarshipName)) {
      return fail(400, "INVALID_INPUT", INVALID_INPUT_MESSAGE);
    }

    scholarshipName = `${body.scholarshipName}`.trim();
  } else {
    scholarshipId = body.scholarshipId;
    scholarshipName = findScholarshipName(scholarshipId);

    if (scholarshipName === null) {
      return fail(404, "SCHOLARSHIP_NOT_FOUND", "장학금을 찾을 수 없습니다.");
    }
  }

  const time = now(data);
  const review = {
    id: data.nextReviewId,
    title: body.title,
    scholarshipId: scholarshipId,
    scholarshipName: scholarshipName,
    authorId: user.id,
    authorNickname: user.nickname,
    appliedDate: body.appliedDate,
    applicantQualification: body.applicantQualification,
    receivedAmount: body.receivedAmount,
    content: body.content,
    createdAt: time,
    updatedAt: time,
  };

  data.nextReviewId = data.nextReviewId + 1;
  data.reviews[data.reviews.length] = review;
  saveData(data);

  return respond(201, toReviewResponse(review, user));
}

// 후기 조회
function handleReviewGet(data, user, reviewId) {
  const review = findReview(data, reviewId);

  if (review === null) {
    return fail(404, "REVIEW_NOT_FOUND", "후기를 찾을 수 없습니다.");
  }

  return respond(200, toReviewResponse(review, user));
}

// 후기 수정 (보낸 항목만 바꿈)
function handleReviewUpdate(data, user, reviewId, body) {
  if (user === null) {
    return fail(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  const review = findReview(data, reviewId);

  if (review === null) {
    return fail(404, "REVIEW_NOT_FOUND", "후기를 찾을 수 없습니다.");
  }

  if (review.authorId !== user.id) {
    return fail(403, "FORBIDDEN", "권한이 없습니다.");
  }

  if (body === null || hasInvalidReviewInput(body, false)) {
    return fail(400, "INVALID_INPUT", INVALID_INPUT_MESSAGE);
  }

  const names = ["title", "appliedDate", "applicantQualification", "content", "receivedAmount"];

  for (let i = 0; i < names.length; i++) {
    if (body[names[i]] !== undefined) {
      review[names[i]] = body[names[i]];
    }
  }

  review.updatedAt = now(data);
  saveData(data);

  return respond(200, toReviewResponse(review, user));
}

// 후기 삭제 (그 후기의 댓글도 함께 삭제)
function handleReviewDelete(data, user, reviewId) {
  if (user === null) {
    return fail(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  const review = findReview(data, reviewId);

  if (review === null) {
    return fail(404, "REVIEW_NOT_FOUND", "후기를 찾을 수 없습니다.");
  }

  if (review.authorId !== user.id) {
    return fail(403, "FORBIDDEN", "권한이 없습니다.");
  }

  data.reviews = data.reviews.filter((item) => item.id !== reviewId);
  data.comments = data.comments.filter((item) => item.reviewId !== reviewId);
  saveData(data);

  return respond(204, null);
}

// 요청 처리 (댓글)

// 댓글 조회 (오래된 순, 페이지 나누기 없음)
function handleCommentList(data, user, reviewId) {
  if (findReview(data, reviewId) === null) {
    return fail(404, "REVIEW_NOT_FOUND", "후기를 찾을 수 없습니다.");
  }

  const items = [];

  for (let i = 0; i < data.comments.length; i++) {
    if (data.comments[i].reviewId === reviewId) {
      items[items.length] = toCommentResponse(data.comments[i], user);
    }
  }

  return respond(200, { items: items });
}

// 댓글이 올바른 내용인지 확인 (비어 있거나 500자를 넘으면 문제)
function hasInvalidCommentBody(body) {
  return body === null || isBlank(body.content) || `${body.content}`.length > 500;
}

// 댓글 등록
function handleCommentCreate(data, user, reviewId, body) {
  if (user === null) {
    return fail(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  if (findReview(data, reviewId) === null) {
    return fail(404, "REVIEW_NOT_FOUND", "후기를 찾을 수 없습니다.");
  }

  if (hasInvalidCommentBody(body)) {
    return fail(400, "INVALID_INPUT", INVALID_INPUT_MESSAGE);
  }

  const time = now(data);
  const comment = {
    id: data.nextCommentId,
    reviewId: reviewId,
    authorId: user.id,
    authorNickname: user.nickname,
    content: body.content,
    createdAt: time,
    updatedAt: time,
  };

  data.nextCommentId = data.nextCommentId + 1;
  data.comments[data.comments.length] = comment;
  saveData(data);

  return respond(201, toCommentResponse(comment, user));
}

// 댓글 수정
function handleCommentUpdate(data, user, reviewId, commentId, body) {
  if (user === null) {
    return fail(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  const comment = findComment(data, reviewId, commentId);

  if (comment === null) {
    return fail(404, "COMMENT_NOT_FOUND", "댓글을 찾을 수 없습니다.");
  }

  if (comment.authorId !== user.id) {
    return fail(403, "FORBIDDEN", "권한이 없습니다.");
  }

  if (hasInvalidCommentBody(body)) {
    return fail(400, "INVALID_INPUT", INVALID_INPUT_MESSAGE);
  }

  comment.content = body.content;
  comment.updatedAt = now(data);
  saveData(data);

  return respond(200, toCommentResponse(comment, user));
}

// 댓글 삭제
function handleCommentDelete(data, user, reviewId, commentId) {
  if (user === null) {
    return fail(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  const comment = findComment(data, reviewId, commentId);

  if (comment === null) {
    return fail(404, "COMMENT_NOT_FOUND", "댓글을 찾을 수 없습니다.");
  }

  if (comment.authorId !== user.id) {
    return fail(403, "FORBIDDEN", "권한이 없습니다.");
  }

  data.comments = data.comments.filter(
    (item) => !(item.reviewId === reviewId && item.id === commentId)
  );
  saveData(data);

  return respond(204, null);
}

// 요청 받기

// 가짜 서버에 요청 보내기 (api.js의 sendToServer와 같은 모양의 { status, data }를 돌려줌)
// method: 요청 방식, path: API 경로, query: 주소 뒤에 붙일 값 (없으면 null), body: 보낼 내용 (없으면 null)
// 테스트용: 토큰을 "expired-token"으로 저장해 두면 토큰 만료(401) 응답을 받음
export async function mockApi(method, path, query, body) {
  if (getAccessToken() === "expired-token") {
    return fail(401, "TOKEN_EXPIRED", "액세스 토큰이 만료되었습니다.");
  }

  const data = loadData();
  const user = getCurrentUser();
  const parts = splitPath(path);

  // 장학금 이름만 조회
  if (
    method === "GET" &&
    parts.length === 2 &&
    parts[0] === "scholarships" &&
    parts[1] === "names"
  ) {
    return respond(200, { items: SCHOLARSHIPS });
  }

  if (parts[0] === "reviews") {
    // /reviews
    if (parts.length === 1) {
      if (method === "GET") {
        return handleReviewList(data, query);
      }

      if (method === "POST") {
        return handleReviewCreate(data, user, body);
      }
    }

    // /reviews/{id}
    if (parts.length === 2) {
      const reviewId = parts[1] * 1;

      if (method === "GET") {
        return handleReviewGet(data, user, reviewId);
      }

      if (method === "PATCH") {
        return handleReviewUpdate(data, user, reviewId, body);
      }

      if (method === "DELETE") {
        return handleReviewDelete(data, user, reviewId);
      }
    }

    // /reviews/{id}/comments
    if (parts.length === 3 && parts[2] === "comments") {
      const reviewId = parts[1] * 1;

      if (method === "GET") {
        return handleCommentList(data, user, reviewId);
      }

      if (method === "POST") {
        return handleCommentCreate(data, user, reviewId, body);
      }
    }

    // /reviews/{id}/comments/{commentId}
    if (parts.length === 4 && parts[2] === "comments") {
      const reviewId = parts[1] * 1;
      const commentId = parts[3] * 1;

      if (method === "PATCH") {
        return handleCommentUpdate(data, user, reviewId, commentId, body);
      }

      if (method === "DELETE") {
        return handleCommentDelete(data, user, reviewId, commentId);
      }
    }
  }

  return fail(404, "NOT_FOUND", "존재하지 않는 요청입니다.");
}
