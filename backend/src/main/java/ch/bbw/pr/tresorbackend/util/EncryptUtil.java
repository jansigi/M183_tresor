package ch.bbw.pr.tresorbackend.util;

import ch.bbw.pr.tresorbackend.model.Config;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.jasypt.util.text.AES256TextEncryptor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * EncryptUtil
 * Used to encrypt content.
 *
 * @author Jan Sigrist
 */
@Component
public class EncryptUtil {
    private final String masterKey;

    public EncryptUtil() {
        masterKey = Config.load().masterKey();
    }

    public String encrypt(String data, String userSalt) {
        AES256TextEncryptor localEncryptor = new AES256TextEncryptor();
        localEncryptor.setPassword(masterKey + userSalt);

        Gson gson = new Gson();
        JsonObject jsonObject = new JsonObject();
        String encrypt = localEncryptor.encrypt(data);
        jsonObject.addProperty("encrypted", encrypt);
        return gson.toJson(jsonObject);
    }

    public String decrypt(String data, String userSalt) {
        AES256TextEncryptor localEncryptor = new AES256TextEncryptor();
        localEncryptor.setPassword(masterKey + userSalt);

        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(data, JsonObject.class);
        String encrypted = jsonObject.get("encrypted").getAsString();
        return localEncryptor.decrypt(encrypted);
    }

    public static String generateSalt() {
        byte[] salt = new byte[32];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
}
