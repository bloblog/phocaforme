package com.phofor.phocaforme.board.service.query.filters;

import co.elastic.clients.elasticsearch._types.query_dsl.*;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;


public class TargetFilter {
    public static Query createFilter(BarterSearchCriteria criteria) {
        // criteria의 Target List를 boolQuery should문으로 추가
        BoolQuery.Builder builder = new BoolQuery.Builder();
        for(Long memberId : criteria.getTarget()){
            builder.should(MemberFilter.createFilter(memberId,"target_member"));
        }
        // Target의 should문들이 모인 BoolQuery를 빌드해서 Target과 Own을 감싸는 BoolQuery로 전달
        QueryVariant boolTargetQuery = builder.build();
        return new Query(boolTargetQuery);
    }
}
