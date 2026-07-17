package com.mechtech.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderFilterRequest {
    private Long categoryId;
    private Long cityId;
    private Long areaId;
    @Builder.Default
    private String sort = "rating";
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double lat;
    private Double lng;
    @Builder.Default
    private int page = 0;
    @Builder.Default
    private int size = 10;
}
