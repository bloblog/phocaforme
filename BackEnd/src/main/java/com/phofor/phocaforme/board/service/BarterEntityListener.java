//package com.phofor.phocaforme.board.service;
//
//import com.phofor.phocaforme.board.config.ApplicationEventPublisherHolder;
//import com.phofor.phocaforme.board.dto.queueDTO.BarterMessage;
//import com.phofor.phocaforme.board.entity.Barter;
//import com.phofor.phocaforme.board.entity.BarterFindIdol;
//import com.phofor.phocaforme.board.entity.BarterImage;
//import com.phofor.phocaforme.board.entity.BarterOwnIdol;
//import com.phofor.phocaforme.common.rabbit.producer.events.PostDeleteEvent;
//import com.phofor.phocaforme.common.rabbit.producer.events.PostPersistEvent;
//import com.phofor.phocaforme.common.rabbit.producer.events.PostUpdateEvent;
//import jakarta.persistence.PostPersist;
//import jakarta.persistence.PostRemove;
//import jakarta.persistence.PostUpdate;
//import org.springframework.context.ApplicationEventPublisher;
//import org.springframework.stereotype.Component;
//import java.time.Instant;
//
//import java.time.LocalDateTime;
//import java.time.ZoneId;
//import java.time.ZonedDateTime;
//
//@Component
//public class BarterEntityListener {
//
////    @PostPersist
////    public void afterSave(Barter barter) {
////        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
////        if (publisher != null) {
////            System.out.println(barter.getId());
////            LocalDateTime localDateTime = barter.getRegistrationDate();
////            ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
////            Instant instant = zonedDateTime.toInstant();
////            PostPersistEvent event = new PostPersistEvent(new BarterMessage(
////                    barter.getId(),
////                    barter.isBartered(),
////                    0,
////                    instant)
////            );
////            publisher.publishEvent(event);
////        }
////    }
//
//
////    @PostUpdate
////    public void afterUpdate(Barter barter){
////        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
////        if (publisher != null) {
////            LocalDateTime localDateTime = barter.getRegistrationDate();
////            ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
////            Instant instant = zonedDateTime.toInstant();
////            PostPersistEvent event = new PostPersistEvent(new BarterMessage(
////                    barter.getId(),
////                    barter.isBartered(),
////                    1,
////                    instant)
////            );
////            publisher.publishEvent(event);
////        }
////    }
//
//
////    @PostRemove
////    public void afterDelete(Barter barter) {
////        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
////        if (publisher != null) {
////            LocalDateTime localDateTime = barter.getRegistrationDate();
////            ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
////            Instant instant = zonedDateTime.toInstant();
////            PostPersistEvent event = new PostPersistEvent(new BarterMessage(
////                    barter.getId(),
////                    barter.isBartered(),
////                    2,
////                    instant)
////            );
////            publisher.publishEvent(event);
////        }
////    }
//
//
//}