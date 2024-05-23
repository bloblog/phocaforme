package com.phofor.phocaforme.common.rabbit.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.phofor.phocaforme.board.dto.searchDto.SearchCountMessage;
import com.phofor.phocaforme.idol.entity.IdolMember;
import com.phofor.phocaforme.idol.entity.IdolRank;
import com.phofor.phocaforme.idol.repository.IdolMemberRepository;
import com.phofor.phocaforme.idol.repository.IdolRankRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchCountQueueWorker {
    private final String QUEUE_NAME = "rank.queue";
    private final int BATCH_SIZE = 500;
    private final IdolMemberRepository idolMemberRepository;
    private final RabbitTemplate rabbitTemplate;
    private final IdolRankRepository idolRankRepository;

    @Scheduled(cron = "50 59 23 * * *")
    public void dailyTask(){
        List<IdolMember> members = idolMemberRepository.findAll();
        for (IdolMember member : members) {
            member.updateTotalCount(0L);
            member.updateTempCount(0L);
        }
        idolMemberRepository.saveAll(members);
    }

    @Transactional
    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 5000))
    @Scheduled(cron = "0 0 * * * *")
//    @Scheduled(fixedDelay = 10000)
    public void hourlyTask() {
        List<IdolMember> members = idolMemberRepository.findAll();
        for (IdolMember member : members) {
            member.updateTotalCount(member.getSearchCountTemp());
            member.updateTempCount(0L);
        }
        idolMemberRepository.saveAll(members);
        Pageable topThree = PageRequest.of(0, 3);
        List<Long> femaleTop3 = idolMemberRepository.findFemaleTop3(topThree);
        List<Long> maleTop3 = idolMemberRepository.findMaleTop3(topThree);


        IdolRank idolRank = IdolRank.builder()
                .firstFemaleIdolId(femaleTop3.get(0))
                .secondFemaleIdolId(femaleTop3.get(1))
                .thirdFemaleIdolId(femaleTop3.get(2))
                .firstMaleIdolId(maleTop3.get(0))
                .secondMaleIdolId(maleTop3.get(1))
                .thirdMaleIdolId(maleTop3.get(2))
                .build();
        idolRankRepository.save(idolRank);
    }


    @Scheduled(cron = "0 */6 * * * *")
    public void work() throws JsonProcessingException {
//        System.out.println(">>>>work()");
        Map<Long, Integer> searchCount = new HashMap<>();
        Message msg;
        int batchCount = 0;
        ObjectMapper mapper = new ObjectMapper();
        while(batchCount < BATCH_SIZE){
            msg = rabbitTemplate.receive(QUEUE_NAME);
            if(msg==null){break;}
            String messageContent = new String(msg.getBody(), StandardCharsets.UTF_8);
            SearchCountMessage message = mapper.readValue(messageContent, SearchCountMessage.class);
            if (message != null) {
                searchCount.merge(message.getId(), 1, Integer::sum);
            }
            batchCount++;
        }
        Set<Long> countTableIds = searchCount.keySet();
        for(Long id : countTableIds){
            IdolMember member = idolMemberRepository.findById(id)
                    .orElseThrow(IllegalArgumentException::new);
            Long newCountTemp = member.getSearchCountTemp() + searchCount.get(id);
            member.updateTempCount(newCountTemp);
            idolMemberRepository.save(member);
        }
    }



    private SearchCountMessage convertMessageToObject(Message message) {
        try {
            return new ObjectMapper().readValue(message.getBody(), SearchCountMessage.class);
        } catch (IOException e) {
            // Handle the exception appropriately - log it, etc.
            return null;
        }
    }

    private SearchCountMessage convertMessageToObject(String messageContent) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(messageContent, SearchCountMessage.class);
        } catch (IOException e) {
            e.printStackTrace(); // Or use a logger to log the exception
            // Consider throwing an exception or handling this case appropriately
            return null;
        }
    }
}
