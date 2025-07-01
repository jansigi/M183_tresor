package ch.bbw.pr.tresorbackend.service;

import ch.bbw.pr.tresorbackend.model.TwoFactorCode;
import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.repository.TwoFactorCodeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class TwoFactorService {
    private final TwoFactorCodeRepository twoFactorCodeRepository;
    private final EmailSendService emailSendService;
    @Value("${twofa.expiry.minutes:5}")
    private int expiryMinutes;
    @Value("${twofa.max.attempts:5}")
    private int maxAttempts;

    public TwoFactorService(TwoFactorCodeRepository twoFactorCodeRepository, EmailSendService emailSendService) {
        this.twoFactorCodeRepository = twoFactorCodeRepository;
        this.emailSendService = emailSendService;
    }

    public TwoFactorCode generateAndSendCode(User user) throws IOException {
        String code = String.format("%06d", new Random().nextInt(1000000));
        TwoFactorCode twoFactorCode = new TwoFactorCode();
        twoFactorCode.setUser(user);
        twoFactorCode.setCode(code);
        twoFactorCode.setExpiresAt(LocalDateTime.now().plusMinutes(expiryMinutes));
        twoFactorCode.setUsed(false);
        twoFactorCode.setAttempts(0);
        twoFactorCodeRepository.save(twoFactorCode);
        System.out.println("Generated 2FA code: " + code); // For debugging purposes
        sendCodeEmail(user.getEmail(), code);
        return twoFactorCode;
    }

    public boolean validateCode(User user, String code) {
        Optional<TwoFactorCode> codeOpt = twoFactorCodeRepository.findFirstByUserAndUsedFalseOrderByExpiresAtDesc(user);
        if (codeOpt.isEmpty()) return false;
        TwoFactorCode twoFactorCode = codeOpt.get();
        if (twoFactorCode.isUsed() || twoFactorCode.getExpiresAt().isBefore(LocalDateTime.now()) || twoFactorCode.getAttempts() >= maxAttempts) {
            return false;
        }
        if (twoFactorCode.getCode().equals(code)) {
            twoFactorCode.setUsed(true);
            twoFactorCodeRepository.save(twoFactorCode);
            return true;
        } else {
            twoFactorCode.setAttempts(twoFactorCode.getAttempts() + 1);
            twoFactorCodeRepository.save(twoFactorCode);
            return false;
        }
    }

    private void sendCodeEmail(String toEmail, String code) throws IOException {
        String subject = "Your 2FA Code";
        String contentText = "Your 2FA code is: " + code + "\nThis code is valid for " + expiryMinutes + " minutes.";
        emailSendService.sendEmail(toEmail, subject, contentText, false);
    }
} 