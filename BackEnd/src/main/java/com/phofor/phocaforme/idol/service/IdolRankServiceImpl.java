package com.phofor.phocaforme.idol.service;

import com.phofor.phocaforme.idol.dto.response.IdolRankResponseDto;
import com.phofor.phocaforme.idol.entity.IdolRank;
import com.phofor.phocaforme.idol.repository.IdolMemberRepository;
import com.phofor.phocaforme.idol.repository.IdolRankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IdolRankServiceImpl implements IdolRankService {
    private final IdolRankRepository idolRankRepository;


    @Override
    public IdolRankResponseDto find() {
        Pageable topOne = PageRequest.of(0, 1);
        List<IdolRank> idolRankList = idolRankRepository.findTop(topOne);
        IdolRank idolRank = idolRankList.get(0);
        IdolRankResponseDto responseDto = IdolRankResponseDto.builder()
                .id(idolRank.getId())
                .firstFemaleIdolId(idolRank.getFirstFemaleIdolId())
                .secondFemaleIdolId(idolRank.getSecondFemaleIdolId())
                .thirdFemaleIdolId(idolRank.getThirdFemaleIdolId())
                .firstMaleIdolId(idolRank.getFirstMaleIdolId())
                .secondMaleIdolId(idolRank.getSecondMaleIdolId())
                .thirdMaleIdolId(idolRank.getThirdMaleIdolId())
                .createdDate(idolRank.getCreatedDate())
                .build();
        return responseDto;
    }


}
