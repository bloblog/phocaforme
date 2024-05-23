package com.phofor.phocaforme.board.service.query.queryBuilder;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import com.phofor.phocaforme.board.dto.IdolMemberDto;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;
import com.phofor.phocaforme.board.service.query.filters.*;
import lombok.Getter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class QueryBuilder implements QueryBuilderInterface{

    private final NativeQueryBuilder queryBuilder;
    @Getter
    private PageRequest pageRequest;

    public QueryBuilder(){
        this.queryBuilder = new NativeQueryBuilder();
    }


    @Override
    public void createQuery(BarterSearchCriteria criteria) {
        this.setPageOffset(criteria);
        this.setAggregation(criteria);
        this.setFilters(criteria);
    }

    @Override
    public NativeQuery getSearch() {
        return this.queryBuilder.build();
    }

    protected void setFilters(BarterSearchCriteria criteria){
        // 각 criteria 항목에 대해 filter 적용
        // if문 내의 must
        BoolQuery.Builder boolQueryBuilder = QueryBuilders.bool();

        /* 가장 제한적인(좁힐 수 있는) 검색어를 앞에 배치
         *  Group -> Query(앨범명 etc) -> CardType
         * */

        if (criteria.getGroupId() != null) {
            boolQueryBuilder.must(GroupFilter.createFilter(criteria));
        }

        if (criteria.getQuery() != null) {
            boolQueryBuilder.must(QueryFilter.createFilter(criteria));
        }else{
            this.queryBuilder.withSort(Sort.by(Sort.Order.desc("created_at")));
        }

        if (criteria.getCardType() != null) {
            boolQueryBuilder.must(CardTypeFilter.createFilter(criteria));
        }

        /* 가장 쿼리가 nested 되어있는 target과 own은 맨 뒤로 배치 */
        if (criteria.getTarget() != null && !criteria.getTarget().isEmpty()) {
            boolQueryBuilder.must(TargetFilter.createFilter(criteria));
        }

        if (criteria.getOwn() != null && !criteria.getOwn().isEmpty()) {
            boolQueryBuilder.must(OwnFilter.createFilter(criteria));
        }


        this.queryBuilder.withQuery(q -> q
                .bool(boolQueryBuilder.build())
        );
    }

    protected void setPageOffset(BarterSearchCriteria criteria) {
        // 페이지네이션
        int page = criteria.getPage() != null ? criteria.getPage() : 1;
        int size = criteria.getSize() != null ? criteria.getSize() : BarterSearchCriteria.SIZE_MAX;
        System.out.println(page+","+size);
        int pageIndex = page - 1;
        if (pageIndex < 0) {
            pageIndex = 0;
        }
        this.pageRequest = PageRequest.of(pageIndex, size);
        this.queryBuilder.withPageable(this.pageRequest);
    }

    protected void setAggregation(BarterSearchCriteria criteria){
        // 집계 설정
    }
    @Override
    public void createQuery(String title, List<IdolMemberDto> idols, int keywordNumber) {

    }

}
