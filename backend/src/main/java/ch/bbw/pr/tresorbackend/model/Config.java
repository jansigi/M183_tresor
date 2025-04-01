package ch.bbw.pr.tresorbackend.model;

import com.typesafe.config.ConfigFactory;

public record Config(String pepper, String masterKey) {
    public static Config load() {
        var config = ConfigFactory.load();
        return new Config(
                config.getString("security.pepper"),
                config.getString("security.masterKey")
        );
    }
}