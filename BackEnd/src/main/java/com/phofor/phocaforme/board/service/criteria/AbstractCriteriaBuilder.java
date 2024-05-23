package com.phofor.phocaforme.board.service.criteria;


import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;

abstract class AbstractCriteriaBuilder {
    abstract BarterSearchCriteria getCriteria();
    abstract void createCriteria();
}
