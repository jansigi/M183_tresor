package ch.bbw.pr.tresorbackend.service;

import ch.bbw.pr.tresorbackend.model.Config;
import ch.bbw.pr.tresorbackend.model.ReCaptchaResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class RecaptchaService {
    private static final Logger logger = LoggerFactory.getLogger(RecaptchaService.class);
    private final String recaptchaSecretKey = Config.load().recaptchaSecretKey();
    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verifyReCaptcha(String token) {
        RestTemplate rest = new RestTemplate();
        MultiValueMap<String,String> form = new LinkedMultiValueMap<>();
        form.add("secret", recaptchaSecretKey);
        form.add("response", token);

        try {
            ReCaptchaResponse resp = rest.postForObject(RECAPTCHA_VERIFY_URL, form, ReCaptchaResponse.class);
            return resp != null && resp.isSuccess();
        } catch (Exception e) {
            logger.error("Error verifying reCAPTCHA", e);
            return false;
        }
    }
} 