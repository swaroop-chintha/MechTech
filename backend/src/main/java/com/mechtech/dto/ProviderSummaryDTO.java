package com.mechtech.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderSummaryDTO {
    private Long id;
    private String shopName;
    private String bio;
    private BigDecimal rating;
    private Integer reviewCount;
    private Boolean isVerified;
    private Boolean isAvailable;
    private String city;
    private String area;
    private String profilePhotoUrl;
    private List<ProviderServiceDTO> services;
    private Double distanceKm;
}
