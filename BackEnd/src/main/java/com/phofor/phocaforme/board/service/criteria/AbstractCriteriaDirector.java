package com.phofor.phocaforme.board.service.criteria;


import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;

abstract class AbstractCriteriaDirector {
    protected AbstractCriteriaBuilder builder;

    public AbstractCriteriaDirector(AbstractCriteriaBuilder abstractCriteriaBuilder){
        this.builder = abstractCriteriaBuilder;
    }

    abstract void buildCriteria();
    abstract BarterSearchCriteria getCriteria();
}
