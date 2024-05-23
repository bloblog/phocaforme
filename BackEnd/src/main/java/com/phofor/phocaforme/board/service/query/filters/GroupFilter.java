package com.phofor.phocaforme.board.service.query.filters;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryVariant;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;

public class GroupFilter {
    public static Query createFilter(BarterSearchCriteria criteria) {
        QueryVariant termGroupQuery = new TermQuery.Builder()
                .field("group_id")
                .value(criteria.getGroupId())
                .build();
        return new Query(termGroupQuery);
    }
}
