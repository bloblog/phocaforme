package com.phofor.phocaforme.board.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Configuration
//@EnableElasticsearchRepositories(basePackages = "com.popo.search2.model.repository")
//ElasticsearchRepository를 상속하면 자동으로 빈 등록이 됨
public class ElasticsearchClientConfig extends ElasticsearchConfiguration {

    @Value("${elasticsearch.username}")
    private String username;

    @Value("${elasticsearch.password}")
    private String password;

    @Value("${elasticsearch.hostname}")
    private String hostname;

    @Value("${elasticsearch.port}")
    private String port;


    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(hostname+":"+port)
                .withBasicAuth(username,password)
                .build();
    }

    public static Instant toInstantFormat(LocalDateTime date){
        ZonedDateTime zonedDateTime = date.atZone(ZoneId.systemDefault());
        return zonedDateTime.toInstant();
    }
}
