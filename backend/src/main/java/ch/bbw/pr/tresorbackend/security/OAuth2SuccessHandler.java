package ch.bbw.pr.tresorbackend.security;

import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.service.JwtService;
import ch.bbw.pr.tresorbackend.service.RoleService;
import ch.bbw.pr.tresorbackend.service.UserService;
import ch.bbw.pr.tresorbackend.util.EncryptUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Value("${CROSS_ORIGIN}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email;
        String firstName;
        String lastName;

        String accessToken = null;
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            String clientRegistrationId = oauthToken.getAuthorizedClientRegistrationId();
            String principalName = oauthToken.getName();
            OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(clientRegistrationId, principalName);
            if (authorizedClient != null && authorizedClient.getAccessToken() != null) {
                accessToken = authorizedClient.getAccessToken().getTokenValue();
            }
        }

        if (oAuth2User.getAttribute("login") != null) {
            String githubLogin = oAuth2User.getAttribute("login");
            String githubName = oAuth2User.getAttribute("name");
            email = oAuth2User.getAttribute("email");
            if (email == null && accessToken != null) {
                try {
                    RestTemplate restTemplate = new RestTemplate();
                    HttpHeaders headers = new HttpHeaders();
                    headers.setBearerAuth(accessToken);
                    headers.setAccept(List.of(MediaType.APPLICATION_JSON));
                    HttpEntity<String> entity = new HttpEntity<>(headers);
                    ResponseEntity<String> emailResponse = restTemplate.exchange(
                        "https://api.github.com/user/emails",
                        HttpMethod.GET,
                        entity,
                        String.class
                    );
                    if (emailResponse.getStatusCode().is2xxSuccessful()) {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(emailResponse.getBody());
                        for (JsonNode node : root) {
                            if (node.get("primary").asBoolean() && node.get("verified").asBoolean()) {
                                email = node.get("email").asText();
                                break;
                            }
                        }
                        // fallback: use first email if no primary/verified found
                        if (email == null && root.isArray() && !root.isEmpty()) {
                            email = root.get(0).get("email").asText();
                        }
                    }
                } catch (Exception ex) {
                    System.out.println("Failed to fetch email from GitHub API: " + ex.getMessage());
                }
            }
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
            user.setPassword("");
            user.setSalt(EncryptUtil.generateSalt());
            user.setRoles(Set.of(roleService.getUserRole()));
            user = userService.createUser(user);
        }

        String token = jwtService.generateToken(user.getId());
        String frontendRedirectUrl = frontendBaseUrl + "/oauth2/redirect?token=" + token;
        response.sendRedirect(frontendRedirectUrl);
    }
} 