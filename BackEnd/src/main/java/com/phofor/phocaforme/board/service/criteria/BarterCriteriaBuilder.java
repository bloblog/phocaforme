package com.phofor.phocaforme.board.service.criteria;


import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;
import com.phofor.phocaforme.board.dto.searchDto.request.SearchRequest;

public class BarterCriteriaBuilder extends AbstractCriteriaBuilder{

    private final SearchRequest searchRequest;
    private final BarterSearchCriteria barterSearchCriteria;

    public BarterCriteriaBuilder(SearchRequest searchRequest){
        this.searchRequest = searchRequest;
        this.barterSearchCriteria = new BarterSearchCriteria();
    }
    @Override
    BarterSearchCriteria getCriteria() {
        return this.barterSearchCriteria;
    }

    @Override
    void createCriteria() {
        if(searchRequest.getPage()>=1){
            System.out.println("Page:"+searchRequest.getPage());
            this.barterSearchCriteria.setPage(searchRequest.getPage()-1);
        }
        this.barterSearchCriteria.setGroupId(searchRequest.getGroupId());
        this.barterSearchCriteria.setQuery(searchRequest.getQuery());
        this.barterSearchCriteria.setTarget(searchRequest.getTarget());
        this.barterSearchCriteria.setOwn(searchRequest.getOwn());
        this.barterSearchCriteria.setCardType(searchRequest.getCardType());

        if(searchRequest.getSize() <= BarterSearchCriteria.SIZE_MAX && searchRequest.getSize() >=BarterSearchCriteria.SIZE_MIN){
            this.barterSearchCriteria.setSize(searchRequest.getSize());
        }
        System.out.println(">>>"+this.barterSearchCriteria.getPage()+","+this.barterSearchCriteria.getSize());
    }
}
