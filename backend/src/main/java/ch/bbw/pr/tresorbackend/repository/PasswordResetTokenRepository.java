package ch.bbw.pr.tresorbackend.repository;

import ch.bbw.pr.tresorbackend.model.PasswordResetToken;
import ch.bbw.pr.tresorbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    void deleteByUser(User user);
} 