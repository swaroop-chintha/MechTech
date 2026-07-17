package com.mechtech.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MechanicRepositoryCustomImpl implements MechanicRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Object[]> findProvidersWithFilters(
            Long categoryId, Long cityId, Long areaId,
            BigDecimal minPrice, BigDecimal maxPrice,
            Double lat, Double lng, String sort, Pageable pageable) {

        StringBuilder selectClause = new StringBuilder("SELECT DISTINCT m.id");
        StringBuilder countSelectClause = new StringBuilder("SELECT COUNT(DISTINCT m.id)");
        
        StringBuilder fromClause = new StringBuilder(" FROM mechanics m");
        StringBuilder whereClause = new StringBuilder(" WHERE m.is_available = true");
        
        List<Object> params = new ArrayList<>();
        
        // Geolocation setup
        if (lat != null && lng != null) {
            String pointStr = "POINT(" + lat + " " + lng + ")";
            selectClause.append(", (ST_Distance_Sphere(m.location, ST_GeomFromText('").append(pointStr).append("')) / 1000.0) AS distance_km");
        } else {
            selectClause.append(", NULL AS distance_km");
        }
        
        if (categoryId != null) {
            fromClause.append(" JOIN provider_services ps ON ps.provider_id = m.id");
            whereClause.append(" AND ps.category_id = ? AND ps.is_active = true");
            params.add(categoryId);
        }
        
        if (cityId != null) {
            whereClause.append(" AND m.city_id = ?");
            params.add(cityId);
        }
        
        if (areaId != null) {
            whereClause.append(" AND m.area_id = ?");
            params.add(areaId);
        }
        
        if (minPrice != null && maxPrice != null) {
            whereClause.append(" AND EXISTS (SELECT 1 FROM provider_services ps2 WHERE ps2.provider_id = m.id AND ps2.base_price BETWEEN ? AND ? AND ps2.is_active = true)");
            params.add(minPrice);
            params.add(maxPrice);
        } else if (minPrice != null) {
            whereClause.append(" AND EXISTS (SELECT 1 FROM provider_services ps2 WHERE ps2.provider_id = m.id AND ps2.base_price >= ? AND ps2.is_active = true)");
            params.add(minPrice);
        } else if (maxPrice != null) {
            whereClause.append(" AND EXISTS (SELECT 1 FROM provider_services ps2 WHERE ps2.provider_id = m.id AND ps2.base_price <= ? AND ps2.is_active = true)");
            params.add(maxPrice);
        }
        
        // Sorting logic
        String orderBy = "";
        if ("distance".equalsIgnoreCase(sort) && lat != null && lng != null) {
            orderBy = " ORDER BY distance_km ASC";
        } else if ("price".equalsIgnoreCase(sort)) {
            orderBy = " ORDER BY (SELECT MIN(ps3.base_price) FROM provider_services ps3 WHERE ps3.provider_id = m.id AND ps3.is_active = true) ASC";
        } else {
            // Default: rating
            orderBy = " ORDER BY m.rating DESC, m.review_count DESC";
        }
        
        String dataSql = selectClause.toString() + fromClause.toString() + whereClause.toString() + orderBy;
        String countSql = countSelectClause.toString() + fromClause.toString() + whereClause.toString();
        
        Query dataQuery = entityManager.createNativeQuery(dataSql);
        Query countQuery = entityManager.createNativeQuery(countSql);
        
        // Set query params
        for (int i = 0; i < params.size(); i++) {
            dataQuery.setParameter(i + 1, params.get(i));
            countQuery.setParameter(i + 1, params.get(i));
        }
        
        // Fetch count
        long total = ((Number) countQuery.getSingleResult()).longValue();
        
        // Paginate
        dataQuery.setFirstResult((int) pageable.getOffset());
        dataQuery.setMaxResults(pageable.getPageSize());
        
        List<Object[]> results = new ArrayList<>();
        List<?> rawResults = dataQuery.getResultList();
        for (Object obj : rawResults) {
            if (obj instanceof Object[]) {
                results.add((Object[]) obj);
            } else {
                results.add(new Object[]{obj, null});
            }
        }
        
        return new PageImpl<>(results, pageable, total);
    }
}
