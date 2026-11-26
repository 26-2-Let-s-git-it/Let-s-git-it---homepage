package com.scholarmap.entity;

import com.scholarmap.common.BaseCreatedTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 북마크 (userId + scholarshipId 유니크) */
@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(name = "uk_bookmark_user_scholarship", columnNames = {"user_id", "scholarship_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bookmark extends BaseCreatedTimeEntity {   // ← createdAt만

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 사용자 → DB 컬럼 user_id */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 장학금 → DB 컬럼 scholarship_id */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", nullable = false)
    private Scholarship scholarship;

    @Builder
    private Bookmark(User user, Scholarship scholarship) {
        this.user = user;
        this.scholarship = scholarship;
    }
}