package com.mechtech.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final String REDIS_OTP_PREFIX = "mechtech:otp:";

    private final StringRedisTemplate redisTemplate;
    
    // In-memory fallback if Redis is unavailable
    private final Map<String, String> localOtpCache = new ConcurrentHashMap<>();

    @Value("${app.msg91.authkey}")
    private String msg91AuthKey;

    @Value("${app.msg91.template-id}")
    private String msg91TemplateId;

    public OtpService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateAndSendOtp(String phone) {
        // Generate a 6-digit code
        String otp = String.format("%06d", new Random().nextInt(1000000));
        
        // Save to Redis (or fallback to Local Cache)
        try {
            redisTemplate.opsForValue().set(REDIS_OTP_PREFIX + phone, otp, 5, TimeUnit.MINUTES);
            logger.info("Saved OTP for {} to Redis", phone);
        } catch (Exception e) {
            logger.warn("Redis unavailable, saving OTP to local concurrent cache: {}", e.getMessage());
            localOtpCache.put(phone, otp);
            // Schedule eviction in 5 minutes
            new Thread(() -> {
                try {
                    Thread.sleep(300000);
                    localOtpCache.remove(phone);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }

        // Mock/Real SMS dispatch
        sendSms(phone, otp);

        return otp;
    }

    public boolean verifyOtp(String phone, String code) {
        String savedCode = null;
        
        try {
            savedCode = redisTemplate.opsForValue().get(REDIS_OTP_PREFIX + phone);
        } catch (Exception e) {
            logger.warn("Redis read failed, reading from local cache: {}", e.getMessage());
            savedCode = localOtpCache.get(phone);
        }

        if (savedCode != null && savedCode.equals(code)) {
            // Delete key on success
            try {
                redisTemplate.delete(REDIS_OTP_PREFIX + phone);
            } catch (Exception e) {
                localOtpCache.remove(phone);
            }
            return true;
        }
        return false;
    }

    private void sendSms(String phone, String otp) {
        logger.info("--------------------------------------------------");
        logger.info("💬 [MSG91] SENDING OTP TO PHONE: {}", phone);
        logger.info("🔑 VERIFICATION CODE IS: {}", otp);
        logger.info("--------------------------------------------------");
        
        if ("mock_auth_key".equals(msg91AuthKey)) {
            logger.info("Running in local mock mode. Actual SMS not sent to MSG91.");
            return;
        }

        // In production, we'd trigger an HTTP POST call here to MSG91
        // URL: https://api.msg91.com/api/v5/otp?template_id=...&mobile=...&authkey=...
        logger.info("MSG91 credentials configured. Mock trigger complete.");
    }
}
