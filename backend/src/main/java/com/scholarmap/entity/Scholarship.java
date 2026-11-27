package com.scholarmap.entity;

import com.scholarmap.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Scholarship extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 외부 API의 장학금 고유번호 (명세엔 없지만 동기화 시 중복 판별용, 응답엔 안 내보냄) */
    @Column(unique = true)
    private String externalId;

    /** 이름 */
    @Column(nullable = false)
    private String name;

    /** 기관 이름 */
    @Column(nullable = false)
    private String organizationName;

    /** 모집자수 */
    private Integer headCount;

    /** 지원금액 */
    private Integer amount;

    /** 학년 (여러 학년 가능) 예: [3, 4] */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<Integer> grades;

    /** 카테고리 예: ["교환학생", "차상위", "한부모"] */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> categories;

    /** 이외 신청자격 */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> eligibilities;

    /** 필요서류 */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> requiredDocuments;

    /** 모집 시작 날짜/시간 */
    private LocalDateTime startAt;

    /** 모집 마감 날짜/시간 */
    private LocalDateTime endAt;

    /** 이후 절차 일정들 */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "procedure_steps", columnDefinition = "json")
    private List<ScholarshipProcedure> procedure;

    /** 이외의 추가 정보들 */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> additionalInfo;

    /** 장학금 기관 사이트 링크 */
    @Column(length = 1000)
    private String applyUrl;

    @Builder
    private Scholarship(String externalId, String name, String organizationName, Integer headCount,
                        Integer amount, List<Integer> grades, List<String> categories,
                        List<String> eligibilities, List<String> requiredDocuments,
                        LocalDateTime startAt, LocalDateTime endAt,
                        List<ScholarshipProcedure> procedure, List<String> additionalInfo, String applyUrl) {
        this.externalId = externalId;
        this.name = name;
        this.organizationName = organizationName;
        this.headCount = headCount;
        this.amount = amount;
        this.grades = grades;
        this.categories = categories;
        this.eligibilities = eligibilities;
        this.requiredDocuments = requiredDocuments;
        this.startAt = startAt;
        this.endAt = endAt;
        this.procedure = procedure;
        this.additionalInfo = additionalInfo;
        this.applyUrl = applyUrl;
    }

//    /** 외부 API 동기화 시 내용 갱신 (같은 externalId가 이미 있을 때) */
//    public void update(Scholarship latest) {
//        this.name = latest.name;
//        this.organizationName = latest.organizationName;
//        this.headCount = latest.headCount;
//        this.amount = latest.amount;
//        this.grades = latest.grades;
//        this.categories = latest.categories;
//        this.eligibilities = latest.eligibilities;
//        this.requiredDocuments = latest.requiredDocuments;
//        this.startAt = latest.startAt;
//        this.endAt = latest.endAt;
//        this.procedure = latest.procedure;
//        this.additionalInfo = latest.additionalInfo;
//        this.applyUrl = latest.applyUrl;
//    }
}