package com.phofor.phocaforme.board.repository;

import com.phofor.phocaforme.board.dto.searchDto.BarterDocument;
import com.phofor.phocaforme.wishcard.dto.WishDocument1;
import com.phofor.phocaforme.wishcard.dto.WishDocument2;
import com.phofor.phocaforme.wishcard.dto.WishDocument3;
import lombok.AllArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;


@AllArgsConstructor
public class MyCustomRepositoryImpl implements MyCustomRepository {

    private ElasticsearchOperations operations;

    @Override
    public SearchHits<BarterDocument> findByOptions(NativeQuery searchQuery) {
        return operations.search(searchQuery,BarterDocument.class);
    }

    @Override
    public SearchHits<WishDocument1> findByTitleAndIdols1(NativeQuery query) {
        return operations.search(query, WishDocument1.class);
    }

    @Override
    public SearchHits<WishDocument2> findByTitleAndIdols2(NativeQuery query) {
        return operations.search(query, WishDocument2.class);
    }

    @Override
    public SearchHits<WishDocument3> findByTitleAndIdols3(NativeQuery query) {
        return operations.search(query, WishDocument3.class);
    }
//    public void func(){
//        IndexQuery indexQuery = new IndexQueryBuilder()
//                .withIndex("barter_post")
//                .
//    }
}
