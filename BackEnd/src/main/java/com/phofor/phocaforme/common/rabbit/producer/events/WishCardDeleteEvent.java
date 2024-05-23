package com.phofor.phocaforme.common.rabbit.producer.events;

import com.phofor.phocaforme.wishcard.dto.WishMessage;
import org.springframework.context.ApplicationEvent;

public class WishCardDeleteEvent extends ApplicationEvent {

    public WishCardDeleteEvent(Object source) {
        super(source);
    }
}
