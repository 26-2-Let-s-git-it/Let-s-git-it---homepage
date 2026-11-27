package com.scholarmap.entity;

import com.scholarmap.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 어떤 게시글의 댓글인지 → review_id */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    /** 누가 쓴 댓글인지 → user_id */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 댓글 내용 */
    @Column(nullable = false, length = 1000)
    private String content;

    @Builder
    private Comment(Review review, User user, String content) {
        this.review = review;
        this.user = user;
        this.content = content;
    }

    /** 댓글 수정 */
    public void update(String content) {
        this.content = content;
    }

    /** 작성자 본인인지 확인 (수정/삭제 권한 체크용) */
    public boolean isWrittenBy(Long userId) {
        return this.user.getId().equals(userId);
    }
}