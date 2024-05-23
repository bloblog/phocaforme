package com.phofor.phocaforme.board.service.query.filters;

import co.elastic.clients.elasticsearch._types.query_dsl.MatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryVariant;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;

public class QueryFilter {
//    public static Query createFilter(BarterSearchCriteria criteria) {
//        return null;
//    }

    public static Query createFilter(BarterSearchCriteria criteria) {
        QueryVariant matchQueryQuery = new MatchQuery.Builder()
                .field("title")
                .fuzziness("1")
                .query(criteria.getQuery())
                .build();
        return new Query(matchQueryQuery);
    }
}
