package com.scholarmap.entity;

import com.scholarmap.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 글 제목 */
    @Column(nullable = false, length = 100)
    private String title;

    /** 작성자 → user_id */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 장학금 → scholarship_id (DB에 없는 장학금 후기면 null) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id")
    private Scholarship scholarship;

    /** 장학금 이름 (scholarship이 null이어도 항상 저장) */
    @Column(nullable = false)
    private String scholarshipName;

    /** 지원자 지원일 */
    @Column(nullable = false)
    private LocalDate appliedDate;

    /** 지원자 자격요건 */
    @Column(length = 500)
    private String applicantQualification;

    /** 받은 금액 */
    private Integer receivedAmount;

    /** 글 내용 */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Builder
    private Review(String title, User user, Scholarship scholarship, String scholarshipName,
                   LocalDate appliedDate, String applicantQualification,
                   Integer receivedAmount, String content) {
        this.title = title;
        this.user = user;
        this.scholarship = scholarship;
        // 장학금이 연결되어 있으면 그 이름을 사용, 아니면 직접 입력한 이름
        this.scholarshipName = (scholarship != null) ? scholarship.getName() : scholarshipName;
        this.appliedDate = appliedDate;
        this.applicantQualification = applicantQualification;
        this.receivedAmount = receivedAmount;
        this.content = content;
    }

    /** 후기 수정 */
    public void update(String title, Scholarship scholarship, String scholarshipName,
                       LocalDate appliedDate, String applicantQualification,
                       Integer receivedAmount, String content) {
        this.title = title;
        this.scholarship = scholarship;
        this.scholarshipName = (scholarship != null) ? scholarship.getName() : scholarshipName;
        this.appliedDate = appliedDate;
        this.applicantQualification = applicantQualification;
        this.receivedAmount = receivedAmount;
        this.content = content;
    }

    /** 작성자 본인인지 확인 (수정/삭제 권한 체크용) */
    public boolean isWrittenBy(Long userId) {
        return this.user.getId().equals(userId);
    }
}