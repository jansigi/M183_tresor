package ch.bbw.pr.tresorbackend.util;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Comprehensive encryption library providing various encryption utilities.
 * Supports AES, RSA, and secure key generation.
 *
 * @author Jan Sigrist
 */
@Component
public class EncryptionLibrary {
    /**
     * Generates a cryptographically secure random salt.
     *
     * @param length The length of the salt in bytes
     * @return Base64 encoded salt
     */
    public String generateSalt(int length) {
        try {
            byte[] salt = new byte[length];
            new SecureRandom().nextBytes(salt);
            return Base64.getEncoder().encodeToString(salt);
        } catch (Exception e) {
            throw new RuntimeException("Error generating salt", e);
        }
    }

    /**
     * Generates a secure hash of the input using SHA-256.
     *
     * @param input The string to hash
     * @return Base64 encoded hash
     */
    public String generateHash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating hash", e);
        }
    }

    /**
     * Verifies if a hash matches the input string.
     *
     * @param input The original string
     * @param hash The hash to verify against
     * @return true if the hash matches, false otherwise
     */
    public boolean verifyHash(String input, String hash) {
        String computedHash = generateHash(input);
        return computedHash.equals(hash);
    }
} 