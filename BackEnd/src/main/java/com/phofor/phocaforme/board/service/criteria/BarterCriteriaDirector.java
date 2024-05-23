package com.phofor.phocaforme.board.service.criteria;


import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;

public class BarterCriteriaDirector extends AbstractCriteriaDirector{

    public BarterCriteriaDirector(AbstractCriteriaBuilder abstractCriteriaBuilder) {
        super(abstractCriteriaBuilder);
    }

    @Override
    public void buildCriteria() {
        this.builder.createCriteria();
    }

    @Override
    public BarterSearchCriteria getCriteria() {
        return this.builder.getCriteria();
    }
}
