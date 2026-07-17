package com.mechtech.repository;

import com.mechtech.model.ProviderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderServiceRepository extends JpaRepository<ProviderService, Long> {
    List<ProviderService> findByProviderIdAndIsActiveTrue(Long providerId);
    List<ProviderService> findByCategoryIdAndIsActiveTrue(Long categoryId);
    List<ProviderService> findByProviderIdInAndIsActiveTrue(List<Long> providerIds);
}
