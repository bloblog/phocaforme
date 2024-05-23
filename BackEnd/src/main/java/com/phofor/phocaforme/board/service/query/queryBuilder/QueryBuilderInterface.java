package com.phofor.phocaforme.board.service.query.queryBuilder;

import com.phofor.phocaforme.board.dto.IdolMemberDto;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;

import java.util.List;

public interface QueryBuilderInterface {
    void createQuery(String title, List<IdolMemberDto> idols, int keywordNumber);

    void createQuery(BarterSearchCriteria criteria);
    NativeQuery getSearch();
}
