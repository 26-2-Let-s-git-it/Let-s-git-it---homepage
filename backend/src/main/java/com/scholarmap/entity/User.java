package com.scholarmap.entity;

import com.scholarmap.common.BaseTimeEntity;
import com.scholarmap.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")   // user는 DB 예약어와 겹칠 수 있어서 users로
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String loginId;

    @Column(nullable = false)
    private String passwordHash;      // 암호화된 비밀번호가 저장됨 (원문 저장 금지)

    @Column(nullable = false, length = 30)
    private String nickname;

    @Column(length=100)
    private String major;

    @Column(length=100)
    private String university;

    @Enumerated(EnumType.STRING)  // DB에 "USER"/"ADMIN" 글자로 저장 (숫자로 저장하면 위험)
    @Column(nullable = false, length = 20)
    private Role role;

    @Builder
    private User(String loginId, String passwordHash, String nickname, String university, String major, Role role) {
        this.loginId = loginId;
        this.passwordHash = passwordHash;
        this.nickname = nickname;
        this.university=university;
        this.major=major;
        this.role = (role != null) ? role : Role.USER;
    }
}