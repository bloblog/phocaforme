package com.phofor.phocaforme.common.rabbit.producer.events;

import org.springframework.context.ApplicationEvent;

public class PostDeleteEvent extends ApplicationEvent {

    public PostDeleteEvent(Object source) {
        super(source);
    }
}