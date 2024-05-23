package com.phofor.phocaforme.board.service;


import com.phofor.phocaforme.auth.service.redis.RedisService;
import com.phofor.phocaforme.board.dto.IdolMemberDto;
import com.phofor.phocaforme.board.dto.searchDto.BarterDocument;
import com.phofor.phocaforme.board.dto.searchDto.SearchCountMessage;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;
import com.phofor.phocaforme.board.dto.searchDto.request.SearchRequest;
import com.phofor.phocaforme.board.dto.searchDto.response.SearchResponse;
import com.phofor.phocaforme.board.repository.BarterSearchRepository;
import com.phofor.phocaforme.board.service.criteria.BarterCriteriaBuilder;
import com.phofor.phocaforme.board.service.criteria.BarterCriteriaDirector;
import com.phofor.phocaforme.board.service.query.queryBuilder.QueryBuilder;
import com.phofor.phocaforme.wishcard.dto.WishDocument1;
import com.phofor.phocaforme.wishcard.dto.WishDocument2;
import com.phofor.phocaforme.wishcard.dto.WishDocument3;
import com.phofor.phocaforme.wishcard.service.WishQueryBuilder;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitSupport;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.SearchPage;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.phofor.phocaforme.board.config.ElasticsearchClientConfig.toInstantFormat;

@Service
@AllArgsConstructor
@Slf4j
public class BarterSearchService {
    private static final int EARTH_RADIUS_KM = 6371;
    private final QueryBuilder queryBuilder;
    private final WishQueryBuilder wishQueryBuilder;
    private final BarterSearchRepository barterSearchRepository;
    private final RedisService redisService;
    private final RabbitTemplate rabbitTemplate;
    public List<String> wishPhoca1(String title, List<IdolMemberDto> idols, int keywordNumber){
        wishQueryBuilder.createQuery(title,idols,keywordNumber);
        NativeQuery query = wishQueryBuilder.getSearch();
        System.out.println(query.getQuery());
        SearchHits<WishDocument1> searchHits = barterSearchRepository.findByTitleAndIdols1(query);
        SearchPage<WishDocument1> searchPage = SearchHitSupport.searchPageFor(
                searchHits,
                null
        );
        Iterator<SearchHit<WishDocument1>> iterator = searchPage.iterator();
        List<String> ids = new ArrayList<>();
        while(iterator.hasNext()) {
            WishDocument1 document = iterator.next().getContent();
            ids.add(document.getUserId());
        }
        return ids;
    }

    public List<String> wishPhoca2(String title, List<IdolMemberDto> idols, int keywordNumber){
        wishQueryBuilder.createQuery(title,idols,keywordNumber);
        NativeQuery query = wishQueryBuilder.getSearch();
        System.out.println(query.getQuery());
        SearchHits<WishDocument2> searchHits = barterSearchRepository.findByTitleAndIdols2(query);
        SearchPage<WishDocument2> searchPage = SearchHitSupport.searchPageFor(
                searchHits,
                null
        );
        Iterator<SearchHit<WishDocument2>> iterator = searchPage.iterator();
        List<String> ids = new ArrayList<>();
        while(iterator.hasNext()) {
            WishDocument2 document = iterator.next().getContent();
            ids.add(document.getUserId());
        }
        return ids;
    }

    public List<String> wishPhoca3(String title, List<IdolMemberDto> idols, int keywordNumber){
        wishQueryBuilder.createQuery(title,idols,keywordNumber);
        NativeQuery query = wishQueryBuilder.getSearch();
        System.out.println(query.getQuery());
        SearchHits<WishDocument3> searchHits = barterSearchRepository.findByTitleAndIdols3(query);
        SearchPage<WishDocument3> searchPage = SearchHitSupport.searchPageFor(
                searchHits,
                null
        );
        Iterator<SearchHit<WishDocument3>> iterator = searchPage.iterator();
        List<String> ids = new ArrayList<>();
        while(iterator.hasNext()) {
            WishDocument3 document = iterator.next().getContent();
            ids.add(document.getUserId());
        }
        return ids;
    }
    public List<SearchResponse> searchAll(){
        Sort sort = Sort.by(Sort.Direction.DESC, "created_at");
        Iterable<BarterDocument> iterable = barterSearchRepository.findAll(sort);
//        for (BarterDocument barterDocument : iterable) {
//            System.out.println(barterDocument);
//        }
        return StreamSupport.stream(iterable.spliterator(), false)
                .map(this::convertToSearchResponse)
                .collect(Collectors.toList());
    }

    public List<SearchResponse> search(SearchRequest searchRequest){
        /* Send message:{Target_idol's searchCount++;}  in RabbitMQ */
        if (searchRequest.getTarget() != null) {
            System.out.println(searchRequest.getTarget());
            for(Long id : searchRequest.getTarget()){
                SearchCountMessage msg = new SearchCountMessage(id, toInstantFormat(LocalDateTime.now()));
                rabbitTemplate.convertAndSend("rank.exchange","rank.key",msg);
            }
        }

        /* A's target is B's own. So exchange them for search. */
        List<Long> temp = searchRequest.getOwn();
        searchRequest.setOwn(searchRequest.getTarget());
        searchRequest.setTarget(temp);
//        System.out.println("target:"+searchRequest.getTarget());
//        System.out.println("own:"+searchRequest.getOwn());

        /* Build Criteria for Query. */
        BarterCriteriaBuilder builder = new BarterCriteriaBuilder(searchRequest);
        BarterCriteriaDirector director = new BarterCriteriaDirector(builder);
        director.buildCriteria();
        BarterSearchCriteria criteria = director.getCriteria();

        /* Build Query by Criteria */
        queryBuilder.createQuery(criteria);
        NativeQuery searchQuery = queryBuilder.getSearch();

        /* Call repository method and Pagination */
        SearchHits<BarterDocument> searchHits = barterSearchRepository.findByOptions(searchQuery);
        SearchPage<BarterDocument> searchPage = SearchHitSupport.searchPageFor(
                searchHits,
                queryBuilder.getPageRequest()
        );
        log.info(">>> hits : "+searchPage.getSearchHits().getTotalHits());
        log.info(searchPage.getContent().toString());

        /* SearchPage<Barter> -> List<SearchResponse> and Return */
        Iterator<SearchHit<BarterDocument>> iterator = searchPage.iterator();
        List<SearchResponse> results = new ArrayList<>();
        while(iterator.hasNext()){
            BarterDocument barter = iterator.next().getContent();
            /* Select article near 2km from user */
            // 검색자가 gps를 보내왔으면,
            Double distance = -1.0;
            Double longitude = searchRequest.getLongitude();
            Double latitude = searchRequest.getLatitude();
            if(longitude!=null && latitude!=null) {
//                System.out.print("검색자 gps 잘 받음 >>");
                Map<String,Double> gpsData = redisService.getGpsData(barter.getWriterId());
//                System.out.print(gpsData+" >>>");
                // 해당 게시글 작성자가 gps ON 상태라면
                if(gpsData.get("latitude")!=null){
                    distance = checkDistance(barter,latitude, longitude);
//                    System.out.print(distance+"만큼의 거리가 있음 >>");
                    if(distance>2){
//                        System.out.println("2km 밖에 있으므로 패스 >>");
                        continue;
                    }
                }else{
                    continue;
                }
            }
//            System.out.println("added.");
            results.add(new SearchResponse(
                    barter.getArticleId(),
                    barter.getImageUrl(),
                    barter.getTitle(),
                    barter.getOwnMember(),
                    barter.getTargetMember(),
                    barter.getWriterId(),
                    barter.isBartered(),
                    distance
            ));
        }
        return results;
    }


    private SearchResponse convertToSearchResponse(BarterDocument document) {
        // BarterDocument를 SearchResponse 객체로 변환하는 로직
        // 필요한 필드를 매핑하여 새로운 SearchResponse 객체 생성
        return new SearchResponse(
                document.getArticleId(),
                document.getImageUrl(),
                document.getTitle(),
                document.getOwnMember(), // 이 필드는 BarterDocument에 적절히 정의되어 있어야 함
                document.getTargetMember(), // 마찬가지로 BarterDocument에 정의되어 있어야 함
                document.getWriterId(),
                document.isBartered(),
                null
        );
    }


    public static double calculateDistanceInKilometer(double lat1, double lon1, double lat2, double lon2) {
        // 위도, 경도를 라디안으로 변환
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        // 허버사인 공식 사용
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return  Math.round(EARTH_RADIUS_KM * c *100.0)/100.0;
    }

    public Double checkDistance(BarterDocument barter, Double latitude, Double longitude){
        Map<String,Double> writerGPS = redisService.getGpsData(barter.getWriterId());

        Double writerLatitude = writerGPS.get("latitude");
        Double writerLongitude = writerGPS.get("longitude");
        Double searcherLatitude = latitude;
        Double searcherLongitude = longitude;

        return calculateDistanceInKilometer(
                writerLatitude,writerLongitude,
                searcherLatitude,searcherLongitude);
    }

//    public ResponseEntity<List<SearchResponse>> findByOptions(SearchRequest searchRequest) {
//        SearchResponse searchResponse = barterRepository.findByOptions(searchRequest);
//    }
}
