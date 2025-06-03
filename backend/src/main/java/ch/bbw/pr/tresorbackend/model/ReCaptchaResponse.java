package ch.bbw.pr.tresorbackend.model;

import lombok.Getter;

import java.util.List;

public class ReCaptchaResponse {
    @Getter
    private boolean success;
    @SuppressWarnings("unused")
    private List<String> errorCodes;
}
