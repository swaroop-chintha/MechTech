package com.mechtech.service;

import com.mechtech.dto.*;
import com.mechtech.exception.ResourceNotFoundException;
import com.mechtech.model.Mechanic;
import com.mechtech.model.ProviderService;
import com.mechtech.repository.MechanicRepository;
import com.mechtech.repository.ProviderServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProviderDiscoveryService {

    private final MechanicRepository mechanicRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final AvailabilityService availabilityService;

    public ProviderDiscoveryService(MechanicRepository mechanicRepository,
                           ProviderServiceRepository providerServiceRepository,
                           AvailabilityService availabilityService) {
        this.mechanicRepository = mechanicRepository;
        this.providerServiceRepository = providerServiceRepository;
        this.availabilityService = availabilityService;
    }

    @Transactional(readOnly = true)
    public ProvidersPageDTO getProviders(ProviderFilterRequest filter) {
        int pageSize = Math.min(filter.getSize(), 20);
        Pageable pageable = PageRequest.of(filter.getPage(), pageSize);

        Page<Object[]> page = mechanicRepository.findProvidersWithFilters(
                filter.getCategoryId(),
                filter.getCityId(),
                filter.getAreaId(),
                filter.getMinPrice(),
                filter.getMaxPrice(),
                filter.getLat(),
                filter.getLng(),
                filter.getSort(),
                pageable
        );

        List<Object[]> content = page.getContent();
        if (content.isEmpty()) {
            return ProvidersPageDTO.builder()
                    .providers(Collections.emptyList())
                    .total(page.getTotalElements())
                    .page(page.getNumber())
                    .size(page.getSize())
                    .totalPages(page.getTotalPages())
                    .build();
        }

        List<Long> ids = content.stream()
                .map(row -> ((Number) row[0]).longValue())
                .collect(Collectors.toList());

        List<Double> distances = content.stream()
                .map(row -> row[1] != null ? ((Number) row[1]).doubleValue() : null)
                .collect(Collectors.toList());

        // Fetch mechanics by ID (preserves bulk query efficiency)
        Map<Long, Mechanic> mechanicMap = mechanicRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Mechanic::getId, m -> m));

        // Fetch services in a single query
        List<ProviderService> allServices = providerServiceRepository.findByProviderIdInAndIsActiveTrue(ids);
        Map<Long, List<ProviderService>> servicesByProviderId = allServices.stream()
                .collect(Collectors.groupingBy(service -> service.getProvider().getId()));

        List<ProviderSummaryDTO> providerSummaryDTOs = new ArrayList<>();
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            Double distance = distances.get(i);
            Mechanic m = mechanicMap.get(id);
            if (m != null) {
                List<ProviderService> services = servicesByProviderId.getOrDefault(id, new ArrayList<>());
                providerSummaryDTOs.add(mapToSummaryDTO(m, distance, services));
            }
        }

        return ProvidersPageDTO.builder()
                .providers(providerSummaryDTOs)
                .total(page.getTotalElements())
                .page(page.getNumber())
                .size(page.getSize())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public ProviderDetailDTO getProviderById(Long id) {
        Mechanic m = mechanicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));

        List<ProviderService> services = providerServiceRepository.findByProviderIdAndIsActiveTrue(id);
        
        boolean resolvedAvailability = availabilityService.resolveAvailability(id, m.isAvailable());

        List<ProviderServiceDTO> serviceDTOs = services.stream()
                .map(this::mapToServiceDTO)
                .collect(Collectors.toList());

        return ProviderDetailDTO.builder()
                .id(m.getId())
                .shopName(m.getShopName())
                .bio(m.getBio())
                .rating(m.getRating())
                .reviewCount(m.getReviewCount())
                .isVerified(m.isVerified())
                .isAvailable(resolvedAvailability)
                .city(m.getCity().getName())
                .area(m.getArea() != null ? m.getArea().getName() : null)
                .profilePhotoUrl(m.getProfilePhotoUrl())
                .distanceKm(null) // No lat/lng context for single details fetch
                .address(m.getAddress())
                .services(serviceDTOs)
                .allServices(serviceDTOs)
                .recentReviews(Collections.emptyList()) // Phase 5
                .build();
    }

    private ProviderSummaryDTO mapToSummaryDTO(Mechanic m, Double distanceKm, List<ProviderService> services) {
        boolean resolvedAvailability = availabilityService.resolveAvailability(m.getId(), m.isAvailable());

        List<ProviderServiceDTO> serviceDTOs = services.stream()
                .map(this::mapToServiceDTO)
                .collect(Collectors.toList());

        return ProviderSummaryDTO.builder()
                .id(m.getId())
                .shopName(m.getShopName())
                .bio(m.getBio())
                .rating(m.getRating())
                .reviewCount(m.getReviewCount())
                .isVerified(m.isVerified())
                .isAvailable(resolvedAvailability)
                .city(m.getCity().getName())
                .area(m.getArea() != null ? m.getArea().getName() : null)
                .profilePhotoUrl(m.getProfilePhotoUrl())
                .services(serviceDTOs)
                .distanceKm(distanceKm)
                .build();
    }

    private ProviderServiceDTO mapToServiceDTO(ProviderService s) {
        return ProviderServiceDTO.builder()
                .id(s.getId())
                .name(s.getName())
                .description(s.getDescription())
                .basePrice(s.getBasePrice())
                .durationMins(s.getDurationMins())
                .categoryId(s.getCategory().getId())
                .categoryName(s.getCategory().getName())
                .build();
    }
}
