package ch.bbw.pr.tresorbackend.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Value;

/**
 * RegisterUser
 *
 * @author Jan Sigrist
 */
@Value
public class LoginUser {
    @NotEmpty(message = "E-Mail is required.")
    private String email;

    @NotEmpty(message = "Password is required.")
    private String password;

    private String recaptchaToken;
}