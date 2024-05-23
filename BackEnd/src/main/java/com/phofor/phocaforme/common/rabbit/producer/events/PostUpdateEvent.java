package com.phofor.phocaforme.common.rabbit.producer.events;

import org.springframework.context.ApplicationEvent;

public class PostUpdateEvent  extends ApplicationEvent {

    public PostUpdateEvent(Object source) {
        super(source);
    }
}
