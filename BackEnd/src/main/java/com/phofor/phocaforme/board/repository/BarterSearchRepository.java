package com.phofor.phocaforme.board.repository;

import com.phofor.phocaforme.board.dto.searchDto.BarterDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface BarterSearchRepository extends ElasticsearchRepository<BarterDocument,String>, MyCustomRepository {
}
