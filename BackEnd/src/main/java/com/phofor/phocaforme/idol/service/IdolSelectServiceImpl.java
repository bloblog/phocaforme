package com.phofor.phocaforme.idol.service;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.idol.dto.response.IdolGroupResponseDto;
import com.phofor.phocaforme.idol.dto.response.IdolMemberResponseDto;
import com.phofor.phocaforme.idol.entity.IdolGroup;
import com.phofor.phocaforme.idol.entity.IdolMember;
import com.phofor.phocaforme.idol.repository.IdolGroupRepository;
import com.phofor.phocaforme.idol.repository.IdolMemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class IdolSelectServiceImpl implements IdolSelectService{

    private final IdolGroupRepository idolGroupRepository;
    private final IdolMemberRepository idolMemberRepository;

    @Override
    public List<IdolGroupResponseDto> findAll() {
        List<IdolGroupResponseDto> allIdolGroupDto = new ArrayList<>();
        for (IdolGroup idolGroup : idolGroupRepository.findAll()){
            allIdolGroupDto.add(IdolGroupResponseDto.of(idolGroup));
        }
        return allIdolGroupDto;
    }

    @Override
    public List<IdolMemberResponseDto> getAllByIdolGroupId(Long idolGroupId) {

        List<IdolMemberResponseDto> allIdolMemberDto = new ArrayList<>();
        for (IdolMember idolMember: idolMemberRepository.findAllByIdolGroupId(idolGroupId)) {
            allIdolMemberDto.add(IdolMemberResponseDto.of(idolMember));
        }

        return allIdolMemberDto;
    }

    @Override
    public IdolMemberResponseDto getIdolMemberByIdolMemberId(Long idolMemberId) {
        IdolMemberResponseDto singleIdolMemberDto = null;
        Optional<IdolMember> idolMemberOptional = idolMemberRepository.findIdolMemberById(idolMemberId);
        if(idolMemberOptional.isPresent()){
            IdolMember idolMember = idolMemberOptional.get();
            singleIdolMemberDto = IdolMemberResponseDto.of(idolMember);
        }
        return singleIdolMemberDto;
    }


}
