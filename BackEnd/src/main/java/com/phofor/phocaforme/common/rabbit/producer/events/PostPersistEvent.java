package com.phofor.phocaforme.common.rabbit.producer.events;

import org.springframework.context.ApplicationEvent;

public class PostPersistEvent extends ApplicationEvent {
    public PostPersistEvent(Object source){
        super(source);
    }
}
