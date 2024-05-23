package com.phofor.phocaforme.board.repository;

import com.phofor.phocaforme.board.dto.searchDto.BarterDocument;
import com.phofor.phocaforme.wishcard.dto.WishDocument1;
import com.phofor.phocaforme.wishcard.dto.WishDocument2;
import com.phofor.phocaforme.wishcard.dto.WishDocument3;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHits;

public interface MyCustomRepository {
    SearchHits<BarterDocument> findByOptions(NativeQuery searchQuery);

    SearchHits<WishDocument1> findByTitleAndIdols1(NativeQuery query);

    SearchHits<WishDocument2> findByTitleAndIdols2(NativeQuery query);
    SearchHits<WishDocument3> findByTitleAndIdols3(NativeQuery query);

}
