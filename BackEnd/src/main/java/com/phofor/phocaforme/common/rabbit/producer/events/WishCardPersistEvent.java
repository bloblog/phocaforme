package com.phofor.phocaforme.common.rabbit.producer.events;

import org.springframework.context.ApplicationEvent;

public class WishCardPersistEvent extends ApplicationEvent {

    public WishCardPersistEvent(Object source) {
        super(source);
    }
}
