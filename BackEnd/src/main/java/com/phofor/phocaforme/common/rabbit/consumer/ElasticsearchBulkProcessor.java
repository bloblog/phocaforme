package com.phofor.phocaforme.common.rabbit.consumer;

import com.phofor.phocaforme.board.dto.BarterDetailDto;
import com.phofor.phocaforme.board.dto.IdolMemberDto;

import com.phofor.phocaforme.wishcard.dto.WishCardDto;
import com.phofor.phocaforme.wishcard.dto.WishDocument1;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;
@RequiredArgsConstructor
@Service
@Slf4j
public class ElasticsearchBulkProcessor {

    private final RestTemplate restTemplate;
    @Value("${elasticsearch.username}")
    private String username;
    @Value("${elasticsearch.password}")
    private String password;
    @Value("${elasticsearch.post-url}")
    private String postUrl;
    public void processToElasticsearch(List<BarterDetailDto> messages, List<Integer> barterTypes,
                                       List<WishCardDto> wishes, List<Integer> wishTypes, List<Integer> wishKeywordNumbers){
        String plainCreds = username+":"+password;
        String base64Creds = Base64.getEncoder().encodeToString(plainCreds.getBytes());
        System.out.println(messages.get(0).getContent());
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Basic " + base64Creds);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String bulkRequestBody = buildBulkRequestBody(messages,barterTypes,wishes,wishTypes,wishKeywordNumbers);
//                bulkRequestBody = bulkRequestBody.replace("\\", "\\\\")
//                        .replace("\n", "\\n")
//                        .replace("\r", "\\r")
//                        .replace("\t", "\\t");
        log.info("\n"+bulkRequestBody);
        HttpEntity<String> entity = new HttpEntity<>(bulkRequestBody, headers);

        restTemplate.postForObject(postUrl,entity,String.class);
    }

    public void processInsertToElasticsearch(List<BarterDetailDto> messages){
        String plainCreds = username+":"+password;
        String base64Creds = Base64.getEncoder().encodeToString(plainCreds.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Basic " + base64Creds);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String bulkRequestBody = buildBulkInsertRequestBody(messages);
        log.info("\n"+bulkRequestBody);
        HttpEntity<String> entity = new HttpEntity<>(bulkRequestBody, headers);

        restTemplate.postForObject(postUrl,entity,String.class);
    }

    private String buildBulkInsertRequestBody(List<BarterDetailDto> messages){
        StringBuilder bulkBody = new StringBuilder();
        for(int i=0; i< messages.size(); i++) {
            BarterDetailDto barter = messages.get(i);
            System.out.println(barter.getId());
            bulkBody.append("{ \"").append("index")
                    .append("\": { \"_id\": \"").append(barter.getId())
                    .append("\", \"_index\": \"").append("barter_post")
                    .append("\"}}\n");
            bulkBody.append("{ ")
                    .append("\"article_id\": ").append(barter.getId()).append(", ")
                    .append("\"writer_id\": \"").append(barter.getUserId()).append("\", ")
                    .append("\"writer_nickname\": \"").append(barter.getNickName()).append("\", ")
                    .append("\"title\": \"").append(barter.getTitle()).append("\", ")
                    .append("\"card_type\": \"").append(barter.getCardType()).append("\", ")
                    .append("\"image_url\": \"").append(barter.getPhotos().get(0)).append("\", ");

            String content = "\"content\": \"" + barter.getContent().replace("\\", "\\\\")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t") + "\", ";
            bulkBody.append(content)
                    .append("\"group_id\": \"").append(barter.getGroupId()).append("\", ")
                    .append("\"own_member\": ").append(convertIdolSearchMembersToJson(barter.getOwnIdolMembers())).append(", ")
                    .append("\"target_member\": ").append(convertIdolSearchMembersToJson(barter.getFindIdolMembers())).append(", ")
                    .append("\"is_bartered\": ").append(barter.isBartered()).append(", ")
                    .append("\"created_at\": \"").append(barter.getRegistrationDate()).append("\",")
                    .append("\"updated_at\": \"").append(barter.getModifiedDate()).append("\" }\n");
        }
        return bulkBody.toString();
    }
    private String buildBulkRequestBody(List<BarterDetailDto> messages, List<Integer> barterTypes,
                                        List<WishCardDto> wishes, List<Integer> wishTypes, List<Integer> wishKeywordNumbers){
        StringBuilder bulkBody = new StringBuilder();

        for(int i=0; i< messages.size() && i< barterTypes.size(); i++){
            BarterDetailDto barter = messages.get(i);
            if(barterTypes.get(i)==1) {
                bulkBody.append("{ \"").append("update")
                        .append("\": { \"_id\": \"").append(barter.getId())
                        .append("\", \"_index\": \"").append("barter_post")
                        .append("\"}}\n");
                bulkBody.append("{ \"doc\": {")
                        .append("\"title\": \"").append(barter.getTitle()).append("\", ")
                        .append("\"card_type\": \"").append(barter.getCardType()).append("\", ")
                        .append("\"image_url\": \"").append(barter.getPhotos().get(0)).append("\", ");
                String content = "\"content\": \"" + barter.getContent().replace("\\", "\\\\")
                        .replace("\n", "\\n")
                        .replace("\r", "\\r")
                        .replace("\t", "\\t") + "\", ";
                bulkBody.append(content)
                        .append("\"group_id\": \"").append(barter.getGroupId()).append("\", ")
                        .append("\"own_member\": ").append(convertIdolSearchMembersToJson(barter.getOwnIdolMembers())).append(", ")
                        .append("\"target_member\": ").append(convertIdolSearchMembersToJson(barter.getFindIdolMembers())).append(", ")
                        .append("\"is_bartered\": ").append(barter.isBartered()).append(", ")
                        .append("\"updated_at\": \"").append(barter.getModifiedDate()).append("\"")
                        .append("} }\n");
            }
            else if (barterTypes.get(i)==2) {
                bulkBody.append("{ \"").append("delete")
                        .append("\": { \"_id\": \"").append(barter.getId())
                        .append("\", \"_index\": \"").append("barter_post")
                        .append("\"}}\n");
            }


        }
        for(int i=0; i< wishes.size() && i< wishTypes.size() && i<wishKeywordNumbers.size(); i++){
            WishCardDto wish = wishes.get(i);
            if(wishTypes.get(i)==3){ // wish_phoca insert & update
                // 기존 인덱스 싹 다 삭제
                int[] twoKeywordNumber = getRestTwoNumber(wishKeywordNumbers.get(i));
                bulkBody.append("{ \"").append("delete")
                        .append("\": { \"_id\": \"").append(wish.getUserId())
                        .append("\", \"_index\": \"").append("wish_phoca_").append(twoKeywordNumber[0])
                        .append("\"}}\n");
                bulkBody.append("{ \"").append("delete")
                        .append("\": { \"_id\": \"").append(wish.getUserId())
                        .append("\", \"_index\": \"").append("wish_phoca_").append(twoKeywordNumber[1])
                        .append("\"}}\n");
                bulkBody.append("{ \"").append("index")
                        .append("\": { \"_id\": \"").append(wish.getUserId())
                        .append("\", \"_index\": \"").append("wish_phoca_").append(wishKeywordNumbers.get(i))
                        .append("\"}}\n")
                        .append("{ ")
                        .append("\"user_id\": \"").append(wish.getUserId()).append("\", ")
                        .append("\"idol_member_id\": ").append(wish.getIdolMemberId()).append(", ");
                // 3개 2개 1개 인덱스에 맞게 필드 조정
                if(wishKeywordNumbers.get(i) == 3){
                    bulkBody.append("\"keyword1\": \"").append(wish.getKeyword1()).append("\", ")
                            .append("\"keyword2\": \"").append(wish.getKeyword2()).append("\", ")
                            .append("\"keyword3\": \"").append(wish.getKeyword3()).append("\"")
                            .append("}\n");
                } else if (wishKeywordNumbers.get(i) == 2) {
                    bulkBody.append("\"keyword1\": \"").append(wish.getKeyword1()).append("\", ")
                            .append("\"keyword2\": \"").append(wish.getKeyword2()).append("\"")
                            .append("}\n");
                } else {
                    bulkBody.append("\"keyword1\": \"").append(wish.getKeyword1()).append("\"")
                            .append("}\n");
                }
            } else if (wishTypes.get(i)==4) { // wish_phoca delete
                bulkBody.append("{ \"").append("delete")
                        .append("\": { \"_id\": \"").append(wish.getUserId())
                        .append("\", \"_index\": \"").append("wish_phoca_").append(wishKeywordNumbers.get(i))
                        .append("\"}}\n");
            }
        }

        return bulkBody.toString();
    }

    private String convertIdolSearchMembersToJson(List<IdolMemberDto> members) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < members.size(); i++) {
            IdolMemberDto member = members.get(i);
            if (i > 0) json.append(", ");
            json.append("{ \"member_id\": ").append(member.getId())
                    .append(", \"member_name\": \"").append(member.getName()).append("\" }");
        }
        json.append("]");
        return json.toString();
    }

    public int[] getRestTwoNumber(int keywordNumber){

        if(keywordNumber==1){
            return new int[]{2,3};
        } else if (keywordNumber==2) {
            return new int[]{1,3};
        }else {
            return new int[]{1,2};
        }
    }
}
