package ch.bbw.pr.tresorbackend.service;

import ch.bbw.pr.tresorbackend.model.PasswordResetToken;
import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.repository.PasswordResetTokenRepository;
import ch.bbw.pr.tresorbackend.repository.UserRepository;
import ch.bbw.pr.tresorbackend.util.EncryptUtil;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncryptionService passwordService;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${sendgrid.api.key}")
    private String sendgridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${CROSS_ORIGIN}")
    private String frontendUrl;

    @Transactional
    public void requestPasswordReset(String email) throws IOException {
        try {
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                entityManager.createNativeQuery("DELETE FROM password_reset_token WHERE user_id = :userId")
                        .setParameter("userId", user.get().getId())
                        .executeUpdate();

                String token = UUID.randomUUID().toString();
                LocalDateTime expiresAt = LocalDateTime.now().plusHours(1);

                PasswordResetToken resetToken = new PasswordResetToken();
                resetToken.setUser(user.get());
                resetToken.setToken(token);
                resetToken.setExpiresAt(expiresAt);
                
                try {
                    tokenRepository.save(resetToken);
                    sendResetEmail(user.get().getEmail(), token);
                } catch (DataIntegrityViolationException e) {
                    logger.error("Failed to save password reset token for user {}: {}", user.get().getId(), e.getMessage());
                    throw new IOException("Failed to process password reset request. Please try again.");
                }
            }
        } catch (Exception e) {
            logger.error("Error processing password reset request for email {}: {}", email, e.getMessage());
            throw new IOException("Failed to process password reset request. Please try again.");
        }
    }

    private void sendResetEmail(String toEmail, String token) throws IOException {
        try {
            Mail mail = getMail(toEmail, token);

            SendGrid sg = new SendGrid(sendgridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 400) {
                logger.error("Failed to send reset email to {}: {}", toEmail, response.getBody());
                throw new IOException("Failed to send reset email. Please try again.");
            }
        } catch (Exception e) {
            logger.error("Error sending reset email to {}: {}", toEmail, e.getMessage());
            throw new IOException("Failed to send reset email. Please try again.");
        }
    }

    private Mail getMail(String toEmail, String token) {
        Email from = new Email(fromEmail);
        Email to = new Email(toEmail);
        String subject = "Password Reset Request";
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 5px;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #666666;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Password Reset Request</h2>
                    </div>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Click the button below to reset your password:</p>
                    <p style="text-align: center;">
                        <a href="%s" class="button">Reset Password</a>
                    </p>
                    <p>If you didn't request this password reset, you can safely ignore this email.</p>
                    <div class="footer">
                        <p>This link will expire in 1 hour and can only be used once.</p>
                        <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
                        <p>%s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink);

        Content emailContent = new Content("text/html", htmlContent);
        return new Mail(from, subject, to, emailContent);
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        try {
            PasswordResetToken resetToken = tokenRepository.findByToken(token);
            
            if (resetToken == null || 
                resetToken.isUsed() || 
                resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                logger.warn("Invalid or expired reset token attempt: {}", token);
                return false;
            }

            User user = resetToken.getUser();
            user.setPassword(passwordService.hashPassword(newPassword, user.getSalt()));
            
            try {
                userRepository.save(user);
                resetToken.setUsed(true);
                tokenRepository.save(resetToken);
                return true;
            } catch (DataIntegrityViolationException e) {
                logger.error("Failed to update password for user {}: {}", user.getId(), e.getMessage());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error resetting password with token {}: {}", token, e.getMessage());
            return false;
        }
    }
} 