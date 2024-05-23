package com.phofor.phocaforme.board.service.query.filters;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryVariant;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import com.phofor.phocaforme.board.dto.IdolMemberDto;
import com.phofor.phocaforme.idol.entity.IdolMember;

import java.util.ArrayList;
import java.util.List;

public class MemberIdFilter {
    public static Query createFilter(List<IdolMemberDto> idols) {
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
        List<Query> queryList = new ArrayList<>();
        for(IdolMemberDto idol : idols){
            QueryVariant termMemberIdQuery = new TermQuery.Builder()
                    .field("idol_member_id")
                    .value(idol.getId())
                    .build();
            queryList.add(new Query(termMemberIdQuery));
        }
        boolQueryBuilder.should(queryList);
        boolQueryBuilder.minimumShouldMatch("1");
        return new Query(boolQueryBuilder.build());
    }
}
