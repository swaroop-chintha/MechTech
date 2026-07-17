package com.mechtech.controller;

import com.mechtech.dto.ProviderDetailDTO;
import com.mechtech.dto.ProviderFilterRequest;
import com.mechtech.dto.ProvidersPageDTO;
import com.mechtech.service.ProviderDiscoveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderDiscoveryService providerService;

    public ProviderController(ProviderDiscoveryService providerService) {
        this.providerService = providerService;
    }

    @GetMapping
    public ResponseEntity<ProvidersPageDTO> getProviders(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) Long areaId,
            @RequestParam(defaultValue = "rating") String sort,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        ProviderFilterRequest filter = ProviderFilterRequest.builder()
                .categoryId(categoryId)
                .cityId(cityId)
                .areaId(areaId)
                .sort(sort)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .lat(lat)
                .lng(lng)
                .page(page)
                .size(size)
                .build();
        return ResponseEntity.ok(providerService.getProviders(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderDetailDTO> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }
}
