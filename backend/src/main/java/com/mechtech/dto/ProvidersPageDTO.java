package com.mechtech.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProvidersPageDTO {
    private List<ProviderSummaryDTO> providers;
    private long total;
    private int page;
    private int size;
    private int totalPages;
}
