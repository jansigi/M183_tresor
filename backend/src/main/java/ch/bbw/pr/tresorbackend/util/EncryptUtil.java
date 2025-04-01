package ch.bbw.pr.tresorbackend.util;

import ch.bbw.pr.tresorbackend.model.Config;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * EncryptUtil
 * Used to encrypt content using AES-GCM encryption with master key and user-specific salt.
 * Provides authenticated encryption for sensitive data.
 *
 * @author Jan Sigrist
 */
@Component
public class EncryptUtil {
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private final String masterKey;
    private final EncryptionLibrary encryptionLibrary;
    private final Gson gson;

    public EncryptUtil(EncryptionLibrary encryptionLibrary) {
        this.masterKey = Config.load().masterKey();
        this.encryptionLibrary = encryptionLibrary;
        this.gson = new Gson();
    }

    public String generateSalt() {
        return encryptionLibrary.generateSalt(32); // 256 bits
    }

    public String encrypt(String data, String userSalt) {
        try {
            // Create the key using master key and user salt
            String keyMaterial = masterKey + userSalt;
            String key = encryptionLibrary.generateHash(keyMaterial); // Use hash of master key + salt as encryption key
            
            // Generate random IV
            byte[] iv = new byte[12];
            new SecureRandom().nextBytes(iv);
            
            // Initialize cipher
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            SecretKey secretKey = new SecretKeySpec(Base64.getDecoder().decode(key), "AES");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmSpec);
            
            // Encrypt
            byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
            
            // Combine IV and encrypted data
            byte[] combined = new byte[iv.length + encryptedData.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedData, 0, combined, iv.length, encryptedData.length);
            
            // Create JSON object with encrypted data
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("encrypted", Base64.getEncoder().encodeToString(combined));
            jsonObject.addProperty("version", "1.0"); // For future compatibility
            jsonObject.addProperty("algorithm", ALGORITHM);
            
            return gson.toJson(jsonObject);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data", e);
        }
    }

    public String decrypt(String encryptedData, String userSalt) {
        try {
            // Parse the JSON object
            JsonObject jsonObject = gson.fromJson(encryptedData, JsonObject.class);
            String encryptedContent = jsonObject.get("encrypted").getAsString();
            
            // Create the key using master key and user salt
            String keyMaterial = masterKey + userSalt;
            String key = encryptionLibrary.generateHash(keyMaterial); // Use hash of master key + salt as decryption key
            
            // Decode and extract IV
            byte[] combined = Base64.getDecoder().decode(encryptedContent);
            byte[] iv = new byte[12];
            byte[] encrypted = new byte[combined.length - 12];
            System.arraycopy(combined, 0, iv, 0, 12);
            System.arraycopy(combined, 12, encrypted, 0, encrypted.length);
            
            // Initialize cipher
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            SecretKey secretKey = new SecretKeySpec(Base64.getDecoder().decode(key), "AES");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec);
            
            // Decrypt
            byte[] decryptedData = cipher.doFinal(encrypted);
            return new String(decryptedData, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data", e);
        }
    }
}
