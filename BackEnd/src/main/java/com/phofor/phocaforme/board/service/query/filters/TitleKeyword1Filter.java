package com.phofor.phocaforme.board.service.query.filters;

import co.elastic.clients.elasticsearch._types.query_dsl.*;

import java.util.ArrayList;
import java.util.List;

public class TitleKeyword1Filter {

    public static Query createFilter(String title, int keywordNumber){
//        System.out.println(keywordNumber);
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
        String[] keywords = title.split("\\s+");
        List<Query> queryList = new ArrayList<>();
        for(String keyword : keywords) {
            QueryVariant matchTitleQuery = new MultiMatchQuery.Builder()
                    .query(keyword)
//                    .fuzziness("1")
                    .type(TextQueryType.CrossFields)
                    .fields("keyword1")
                    .build();
            queryList.add(new Query(matchTitleQuery));
        }
        boolQueryBuilder.should(queryList);
        boolQueryBuilder.minimumShouldMatch(String.valueOf(keywordNumber));
        return new Query(boolQueryBuilder.build());
    }
}
