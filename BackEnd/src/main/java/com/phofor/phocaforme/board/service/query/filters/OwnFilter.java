package com.phofor.phocaforme.board.service.query.filters;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryVariant;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;

public class OwnFilter {
    public static Query createFilter(BarterSearchCriteria criteria) {
        // criteria의 Own List를 boolQuery should문으로 추가 (OR)
        BoolQuery.Builder builder = new BoolQuery.Builder();
        for(Long memberId : criteria.getOwn()){
            builder.should(MemberFilter.createFilter(memberId,"own_member"));
        }
        // Own의 should문들이 모인 BoolQuery를 빌드해서 Target과 Own을 감싸는 BoolQuery로 전달 (AND)
        QueryVariant boolOwnQuery = builder.build();
        return new Query(boolOwnQuery);
    }
}
