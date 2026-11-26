package com.scholarmap.common;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/** 생성 시각 + 수정 시각이 필요한 엔티티용 (User, Scholarship, Review, Comment) */
@Getter
@MappedSuperclass
public abstract class BaseTimeEntity extends BaseCreatedTimeEntity {

    @LastModifiedDate
    private LocalDateTime updatedAt;
}