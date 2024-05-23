package com.phofor.phocaforme.board.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class ApplicationEventPublisherHolder {

    @Getter
    private static ApplicationEventPublisher publisher;

    @Autowired
    public ApplicationEventPublisherHolder(ApplicationEventPublisher publisher) {
        ApplicationEventPublisherHolder.publisher = publisher;
    }

}