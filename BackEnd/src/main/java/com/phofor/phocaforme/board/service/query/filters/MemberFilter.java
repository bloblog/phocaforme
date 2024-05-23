package com.phofor.phocaforme.board.service.query.filters;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryVariant;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;

public class MemberFilter {
    public static Query createFilter(Long memberId, String ownOrTarget) {
        QueryVariant termMemberQuery = new TermQuery.Builder()
                .field(ownOrTarget+".member_id")
                .value(memberId)
                .build();
        return new Query(termMemberQuery);
    }
}
