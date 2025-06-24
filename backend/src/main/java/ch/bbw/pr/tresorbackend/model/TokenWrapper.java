package ch.bbw.pr.tresorbackend.model;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

/**
 * EncryptCredentials
 *
 * @author Peter Rutschmann
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TokenWrapper {
    @NotEmpty(message = "token is required.")
    private String token;
}
