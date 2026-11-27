package com.scholarmap.common;

import org.springframework.data.domain.Page;

import java.util.List;

public record PageResponse<T>(
        List<T> items,
        int page,
        int size,
        int totalPages,
        long totalCount
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),          // ⚠️ 0부터 시작
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}