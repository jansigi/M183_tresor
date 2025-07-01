package ch.bbw.pr.tresorbackend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * RegisterUser
 *
 * @author Jan Sigrist
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TwoFactorVerify {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Code is required")
    private String code;
}