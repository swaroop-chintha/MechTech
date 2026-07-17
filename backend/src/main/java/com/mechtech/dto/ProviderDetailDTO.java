package com.mechtech.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDetailDTO extends ProviderSummaryDTO {
    private String address;
    private List<ProviderServiceDTO> allServices;
    private List<ReviewSummaryDTO> recentReviews;
}
