// src/common/api.js
// 서버(API) 요청 공통 함수

import { getAccessToken, logout } from "./common.js";
import { mockApi } from "./mock-api.js";

// 설정

const USE_MOCK = true; // true: 가짜 서버 사용, false: 진짜 서버 사용 (백엔드가 준비되면 false로 변경)
const API_BASE = "/api/v1"; // 서버 API 주소 앞부분

// API 경로 모음 (서버 명세와 다르면 이 부분만 수정)
export const API_PATHS = {
  reviews: "/reviews", // 후기 목록 조회, 후기 등록
  review: (id) => `/reviews/${id}`, // 후기 조회, 수정, 삭제
  comments: (reviewId) => `/reviews/${reviewId}/comments`, // 댓글 조회, 등록
  comment: (reviewId, commentId) => `/reviews/${reviewId}/comments/${commentId}`, // 댓글 수정, 삭제
  scholarshipNames: "/scholarships/names", // 장학금 이름만 조회
};

// 주소 뒤에 붙일 값 만들기
// query: 보낼 값 객체 (예: { page: 1, keyword: "이화" }), 없으면 null
function createQueryString(query) {
  if (query === null) {
    return "";
  }

  const text = new URLSearchParams(query).toString();

  if (text === "") {
    return "";
  }

  return `?${text}`;
}

// 진짜 서버에 요청 보내기
// 돌려주는 값: { status: 상태 코드, data: 서버가 준 내용 (없으면 null) }
// method: 요청 방식, path: API 경로, query: 주소 뒤에 붙일 값 (없으면 null)
// body: 서버로 보낼 내용 (없으면 null), token: 로그인 토큰 (없으면 null)
async function sendToServer(method, path, query, body, token) {
  const headers = {};
  const init = { method: method, headers: headers };

  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== null) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}${createQueryString(query)}`, init);
  } catch (err) {
    const error = new Error("서버에 연결하지 못했습니다.");
    error.status = 0;
    error.code = "NETWORK_ERROR";
    throw error;
  }

  let data = null;

  // 삭제 성공(204)은 내용이 없음
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch (err) {
      data = null;
    }
  }

  return { status: response.status, data: data };
}

// 토큰 문제(만료, 위조)로 실패한 응답인지 확인
// data: 서버가 보낸 오류 내용 ({ code, message })
function isTokenError(data) {
  if (data === null || data === undefined) {
    return false;
  }

  return data.code === "TOKEN_EXPIRED" || data.code === "INVALID_TOKEN";
}

// 실패 응답을 오류 객체로 만들기 (error.status, error.code로 구분)
// result: { status, data }
function createApiError(result) {
  let message = "요청을 처리하지 못했습니다.";
  let code = "UNKNOWN_ERROR";

  if (result.data !== null && result.data !== undefined) {
    if (result.data.message !== undefined) {
      message = result.data.message;
    }

    if (result.data.code !== undefined) {
      code = result.data.code;
    }
  }

  const error = new Error(message);
  error.status = result.status;
  error.code = code;

  return error;
}

// 서버에 요청 보내기
// method: 요청 방식 ("GET", "POST", "PATCH", "DELETE")
// path: API_PATHS로 만든 경로 (예: API_PATHS.review(3))
// options: { query: 주소 뒤에 붙일 값 객체, body: 서버로 보낼 내용 객체 } (필요 없으면 생략)
// 성공하면 서버가 준 내용을 돌려주고(내용이 없으면 null), 실패하면 오류를 던짐
// query에는 보낼 값만 넣어야 함 (값이 없는 항목은 아예 빼기)
export async function apiRequest(method, path, options) {
  let query = null;
  let body = null;

  if (options !== undefined) {
    if (options.query !== undefined) {
      query = options.query;
    }

    if (options.body !== undefined) {
      body = options.body;
    }
  }

  const token = getAccessToken();
  let result;

  if (USE_MOCK) {
    result = await mockApi(method, path, query, body);
  } else {
    result = await sendToServer(method, path, query, body, token);
  }

  // 토큰이 만료되었거나 잘못된 경우 로그아웃 처리
  if (result.status === 401 && token !== null && isTokenError(result.data)) {
    logout();

    // 조회는 로그인 없이도 가능하므로 토큰 없이 다시 요청
    if (method === "GET") {
      return await apiRequest(method, path, options);
    }
  }

  if (result.status < 200 || result.status >= 300) {
    throw createApiError(result);
  }

  return result.data;
}
