package com.mechtech.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface MechanicRepositoryCustom {
    Page<Object[]> findProvidersWithFilters(
            Long categoryId, Long cityId, Long areaId,
            BigDecimal minPrice, BigDecimal maxPrice,
            Double lat, Double lng, String sort, Pageable pageable);
}
