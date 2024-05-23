package com.phofor.phocaforme.wishcard.service;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import com.phofor.phocaforme.board.dto.IdolMemberDto;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;
import com.phofor.phocaforme.board.service.query.filters.MemberIdFilter;
import com.phofor.phocaforme.board.service.query.filters.TitleKeyword1Filter;
import com.phofor.phocaforme.board.service.query.filters.TitleKeyword2Filter;
import com.phofor.phocaforme.board.service.query.filters.TitleKeyword3Filter;
import com.phofor.phocaforme.board.service.query.queryBuilder.QueryBuilderInterface;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WishQueryBuilder implements QueryBuilderInterface {

    private final NativeQueryBuilder queryBuilder;

    public WishQueryBuilder(){
        this.queryBuilder = new NativeQueryBuilder();
    }

    @Override
    public NativeQuery getSearch() {
        return this.queryBuilder.build();
    }


    @Override
    public void createQuery(String title, List<IdolMemberDto> idols, int keywordNumber) {
        this.setFilters(title,idols,keywordNumber);
    }

    private void setFilters(String title, List<IdolMemberDto> idols,int keywordNumber) {
        BoolQuery.Builder boolQueryBuilder = QueryBuilders.bool();
        boolQueryBuilder.must(MemberIdFilter.createFilter(idols));
        System.out.println("키워드넘버"+keywordNumber);
        switch (keywordNumber){
            case 3:{
                boolQueryBuilder.must(TitleKeyword3Filter.createFilter(title,keywordNumber));
                break;
            }
            case 2:{
                boolQueryBuilder.must(TitleKeyword2Filter.createFilter(title,keywordNumber));
                break;
            }
            case 1:{
                boolQueryBuilder.must(TitleKeyword1Filter.createFilter(title,keywordNumber));
                break;
            }
        }

        this.queryBuilder.withFields("user_id").withQuery(q -> q
                .bool(boolQueryBuilder.build())
        );
    }

    @Override
    public void createQuery(BarterSearchCriteria criteria) {

    }

}
