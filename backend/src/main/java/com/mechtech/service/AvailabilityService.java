package com.mechtech.service;

import com.mechtech.model.Mechanic;
import com.mechtech.repository.MechanicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class AvailabilityService {

    private static final Logger logger = LoggerFactory.getLogger(AvailabilityService.class);
    private static final String KEY_PREFIX = "mechtech:provider:availability:";
    private static final long TTL_SECONDS = 300;

    private final StringRedisTemplate redisTemplate;
    private final MechanicRepository mechanicRepository;

    public AvailabilityService(StringRedisTemplate redisTemplate, MechanicRepository mechanicRepository) {
        this.redisTemplate = redisTemplate;
        this.mechanicRepository = mechanicRepository;
    }

    @PostConstruct
    public void syncAvailabilityToRedis() {
        try {
            List<Mechanic> mechanics = mechanicRepository.findAll();
            int count = 0;
            for (Mechanic m : mechanics) {
                if (m.getId() != null) {
                    redisTemplate.opsForValue().set(
                            KEY_PREFIX + m.getId(),
                            String.valueOf(m.isAvailable()),
                            TTL_SECONDS,
                            TimeUnit.SECONDS
                    );
                    count++;
                }
            }
            logger.info("Synced {} provider availability statuses to Redis", count);
        } catch (Exception e) {
            logger.warn("Failed to sync provider availability to Redis on startup: {}", e.getMessage());
        }
    }

    public Boolean getAvailability(Long mechanicId) {
        try {
            String value = redisTemplate.opsForValue().get(KEY_PREFIX + mechanicId);
            if (value != null) {
                logger.info("Redis hit: availability for mechanic {} is {}", mechanicId, value);
                return Boolean.parseBoolean(value);
            }
            logger.info("Redis miss: availability key missing for mechanic {}", mechanicId);
            return null;
        } catch (Exception e) {
            logger.warn("Redis read failed for mechanic {}: {}", mechanicId, e.getMessage());
            return null;
        }
    }

    @Transactional
    public void setAvailability(Long mechanicId, boolean available) {
        // Update Redis
        try {
            redisTemplate.opsForValue().set(
                    KEY_PREFIX + mechanicId,
                    String.valueOf(available),
                    TTL_SECONDS,
                    TimeUnit.SECONDS
            );
            logger.info("Successfully set Redis availability for mechanic {} to {}", mechanicId, available);
        } catch (Exception e) {
            logger.warn("Redis write failed for mechanic {}: {}", mechanicId, e.getMessage());
        }

        // Update MySQL
        Optional<Mechanic> mechanicOpt = mechanicRepository.findById(mechanicId);
        if (mechanicOpt.isPresent()) {
            Mechanic m = mechanicOpt.get();
            m.setAvailable(available);
            mechanicRepository.save(m);
            logger.info("Successfully updated MySQL availability for mechanic {} to {}", mechanicId, available);
        } else {
            logger.warn("Mechanic {} not found in database to update availability", mechanicId);
        }
    }

    @Transactional
    public void markUnavailable(Long mechanicId) {
        setAvailability(mechanicId, false);
    }

    public boolean resolveAvailability(Long mechanicId, boolean dbValue) {
        Boolean redisVal = getAvailability(mechanicId);
        if (redisVal == null) {
            logger.info("Redis miss/error, falling back to DB availability value ({}) for mechanic {}", dbValue, mechanicId);
            return dbValue;
        }
        return redisVal;
    }
}
