package com.phofor.phocaforme.common.rabbit.producer;

import com.phofor.phocaforme.board.dto.queueDTO.BarterMessage;
import com.phofor.phocaforme.common.rabbit.producer.events.*;
import com.phofor.phocaforme.wishcard.dto.WishMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class RabbitMQMessageSender {

    private final RabbitTemplate rabbitTemplate;


//    @Async // event 전달받은 순간 비동기적으로 별도 스레드에서 실행
    @EventListener
    public void handlePostPersistedEvent(PostPersistEvent event){
        BarterMessage postMessage = (BarterMessage) event.getSource();
//        System.out.println(postMessage);
        rabbitTemplate.convertAndSend("insert.exchange","insert.key",postMessage);
        // rabbit에 직접 보내줌 -> 소비는 QueueWorker 클래스에서.
    }

    @EventListener
    public void handlePostUpdatedEvent(PostUpdateEvent event){
        BarterMessage postMessage = (BarterMessage) event.getSource();
//        System.out.println(postMessage);
        rabbitTemplate.convertAndSend("barter.exchange","barter.key",postMessage);
        // rabbit에 직접 보내줌 -> 소비는 QueueWorker 클래스에서.
    }

    @EventListener
    public void handlePostDeletedEvent(PostDeleteEvent event){
        BarterMessage postMessage = (BarterMessage) event.getSource();
//        System.out.println(postMessage);
        rabbitTemplate.convertAndSend("barter.exchange","barter.key",postMessage);
        // rabbit에 직접 보내줌 -> 소비는 QueueWorker 클래스에서.
    }

    @EventListener
    public void handleWishPersistedEvent(WishCardPersistEvent event){
        WishMessage wishMessage = (WishMessage) event.getSource();
//        System.out.println(wishMessage);
        rabbitTemplate.convertAndSend("barter.exchange","barter.key",wishMessage);
    }

    @EventListener
    public void handleWishRemovedEvent(WishCardDeleteEvent event){
        WishMessage wishMessage = (WishMessage) event.getSource();
//        System.out.println(wishMessage);
        rabbitTemplate.convertAndSend("barter.exchange","barter.key",wishMessage);
    }
}
