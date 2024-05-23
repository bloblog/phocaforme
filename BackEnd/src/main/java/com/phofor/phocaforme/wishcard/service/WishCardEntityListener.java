package com.phofor.phocaforme.wishcard.service;

import com.phofor.phocaforme.board.config.ApplicationEventPublisherHolder;
import com.phofor.phocaforme.common.rabbit.producer.events.WishCardDeleteEvent;
import com.phofor.phocaforme.common.rabbit.producer.events.WishCardPersistEvent;
import com.phofor.phocaforme.wishcard.dto.WishMessage;
import com.phofor.phocaforme.wishcard.entity.WishCard;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import static com.phofor.phocaforme.board.config.ElasticsearchClientConfig.toInstantFormat;
@Component
public class WishCardEntityListener {


    @PostUpdate
    @PostPersist
    public void afterUpdate(WishCard wishCard){
        System.out.println(">>>>>>");
        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
        if(publisher != null){
            WishCardPersistEvent event = new WishCardPersistEvent(new WishMessage(
                    wishCard.getUserEntity().getUserId(),
                    toInstantFormat(wishCard.getCreatedAt()),
                    3,
                    wishCard.numberOfKeyword()
            ));
            publisher.publishEvent(event);
        }
    }

    @PostRemove
    public void afterDelete(WishCard wishCard){
        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
        if(publisher != null){
            WishCardDeleteEvent event = new WishCardDeleteEvent(new WishMessage(
                    wishCard.getUserEntity().getUserId(),
                    toInstantFormat(wishCard.getCreatedAt()),
                    4,
                    wishCard.numberOfKeyword()
            ));
            publisher.publishEvent(event);
        }
    }

}
