package com.scholarmap.entity;

/**
 * 장학금 이후 절차 한 단계 (Scholarshipprocedure 배열의 항목)
 * 예: { "step": "서류 합격 발표", "startAt": null, "endAt": "2026-12-15T10:00:00" }
 */
public record ScholarshipProcedure(
        String step,      // 절차 이름 (필수)
        String startAt,   // 절차 시작 날짜/시간, 결과 발표처럼 하루짜리 절차면 null
        String endAt      // 마감 날짜/시간
) {
}