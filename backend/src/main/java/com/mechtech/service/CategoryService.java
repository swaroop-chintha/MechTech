package com.mechtech.service;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import com.mechtech.dto.CategoryDTO;
import com.mechtech.model.Category;
import com.mechtech.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);
    private static final String REDIS_KEY = "mechtech:categories";
    private static final long TTL_SECONDS = 3600;

    private final CategoryRepository categoryRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public CategoryService(CategoryRepository categoryRepository,
                           StringRedisTemplate redisTemplate,
                           ObjectMapper objectMapper) {
        this.categoryRepository = categoryRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public List<CategoryDTO> getAllCategories() {
        // 1. Check Redis Cache
        try {
            String cachedJson = redisTemplate.opsForValue().get(REDIS_KEY);
            if (cachedJson != null) {
                logger.info("Redis cache hit for categories");
                return objectMapper.readValue(cachedJson, new TypeReference<List<CategoryDTO>>() {});
            }
            logger.info("Redis cache miss for categories");
        } catch (Exception e) {
            logger.warn("Redis operations failed during category fetch: {}", e.getMessage());
        }

        // 2. Query Database
        List<Category> categories = categoryRepository.findByIsActiveTrue();
        List<CategoryDTO> dtos = categories.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        // 3. Cache in Redis
        try {
            String json = objectMapper.writeValueAsString(dtos);
            redisTemplate.opsForValue().set(REDIS_KEY, json, TTL_SECONDS, TimeUnit.SECONDS);
            logger.info("Successfully cached categories in Redis");
        } catch (Exception e) {
            logger.warn("Failed to cache categories in Redis: {}", e.getMessage());
        }

        return dtos;
    }

    private CategoryDTO mapToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .icon(category.getIcon())
                .description(category.getDescription())
                .build();
    }
}
