package ch.bbw.pr.tresorbackend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * PasswordEncryptionService
 *
 * @author Peter Rutschmann
 */
@Service
public class PasswordEncryptionService {
    BCryptPasswordEncoder passwordEncoder;

    public PasswordEncryptionService() {
        passwordEncoder = new BCryptPasswordEncoder();
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean matchPassword(String password, String hashedPassword) {
        boolean isMatch = passwordEncoder.matches(password, hashedPassword);

        if (isMatch) {
            System.out.println("Password matches!");
        } else {
            System.out.println("Password does not match.");
        }
        return isMatch;
    }
}
