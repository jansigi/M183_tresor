package ch.bbw.pr.tresorbackend.service;

import ch.bbw.pr.tresorbackend.model.Config;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * PasswordEncryptionService
 *
 * @author Peter Rutschmann
 */
@Service
public class PasswordEncryptionService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final String pepper;

    public PasswordEncryptionService() {
        passwordEncoder = new BCryptPasswordEncoder();
        pepper = Config.load().pepper();
    }

    public String hashPassword(String password, String salt) {
        return passwordEncoder.encode(salt + password + pepper);
    }

    public boolean matchPassword(String password, String hashedPassword, String salt) {
        boolean isMatch = passwordEncoder.matches(salt + password + pepper, hashedPassword);

        if (isMatch) {
            System.out.println("Password matches!");
        } else {
            System.out.println("Password does not match.");
        }
        return isMatch;
    }
}
