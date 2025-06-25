package ch.bbw.pr.tresorbackend.security;

import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.service.JwtService;
import ch.bbw.pr.tresorbackend.service.RoleService;
import ch.bbw.pr.tresorbackend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private JwtService jwtService;

    @Value("${CROSS_ORIGIN}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email;
        String firstName;
        String lastName;

        if (oAuth2User.getAttribute("login") != null) {
            String githubLogin = oAuth2User.getAttribute("login");
            String githubName = oAuth2User.getAttribute("name");
            email = oAuth2User.getAttribute("email");
            if (email == null) {
                email = githubLogin + "@github.com";
            }
            if (githubName != null && githubName.contains(" ")) {
                String[] parts = githubName.split(" ", 2);
                firstName = parts[0];
                lastName = parts[1];
            } else if (githubName != null) {
                firstName = githubName;
                lastName = "";
            } else {
                firstName = githubLogin;
                lastName = "";
            }
        } else {
            email = oAuth2User.getAttribute("email");
            firstName = oAuth2User.getAttribute("given_name");
            lastName = oAuth2User.getAttribute("family_name");
        }

        User user = userService.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPassword(""); // No password for OAuth2 users
            user.setSalt("");
            user.setRoles(Set.of(roleService.getUserRole()));
            user = userService.createUser(user);
        }

        String token = jwtService.generateToken(user.getId());
        String frontendRedirectUrl = frontendBaseUrl + "/oauth2/redirect?token=" + token;
        response.sendRedirect(frontendRedirectUrl);
    }
} 