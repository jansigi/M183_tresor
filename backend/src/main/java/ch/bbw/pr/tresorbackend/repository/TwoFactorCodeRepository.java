package ch.bbw.pr.tresorbackend.repository;

import ch.bbw.pr.tresorbackend.model.TwoFactorCode;
import ch.bbw.pr.tresorbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TwoFactorCodeRepository extends JpaRepository<TwoFactorCode, Long> {
    Optional<TwoFactorCode> findFirstByUserAndUsedFalseOrderByExpiresAtDesc(User user);
} 