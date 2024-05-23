package com.phofor.phocaforme.board.service.query.filters;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryVariant;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;

public class CardTypeFilter {
    public static Query createFilter(BarterSearchCriteria criteria) {
        QueryVariant termCardTypeQuery = new TermQuery.Builder()
                .field("card_type")
                .value(criteria.getCardType())
                .build();
        return new Query(termCardTypeQuery);
    }
}
