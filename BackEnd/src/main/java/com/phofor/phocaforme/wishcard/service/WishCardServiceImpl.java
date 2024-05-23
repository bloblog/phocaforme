package com.phofor.phocaforme.wishcard.service;

import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.auth.repository.UserRepository;
import com.phofor.phocaforme.idol.dto.response.IdolMemberResponseDto;
import com.phofor.phocaforme.idol.entity.IdolMember;
import com.phofor.phocaforme.idol.repository.IdolMemberRepository;
import com.phofor.phocaforme.wishcard.dto.WishCardDto;
import com.phofor.phocaforme.wishcard.dto.WishCardInfoDto;
import com.phofor.phocaforme.wishcard.dto.WishDocument1;
import com.phofor.phocaforme.wishcard.dto.response.WishCardResponseDto;
import com.phofor.phocaforme.wishcard.entity.WishCard;
import com.phofor.phocaforme.wishcard.repository.WishCardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishCardServiceImpl implements WishCardService {

    private final UserRepository userRepository;
    private final WishCardRepository wishCardRepository;
    private final IdolMemberRepository idolMemberRepository;

    @Transactional
    @Override
    public Boolean registWishCardByUserId(String userId, WishCardInfoDto wishCardInfoDto) {
        // 아이돌 등록 유무 확인
        Optional<IdolMember> idolMemberOptional = idolMemberRepository.findById(wishCardInfoDto.getMemberId());
        if (idolMemberOptional.isPresent()) {
            // 갈망 포카 등록 유무 확인
            Optional<WishCard> wishCardEntityOptional = wishCardRepository.findByUserEntity_UserId(userId);
            if (wishCardEntityOptional.isPresent()) {
                log.info("user_id : {}", userId);
                // 기존에 등록된 갈망 포카 업데이트
                WishCard wishCard = wishCardEntityOptional.get();
                wishCard.setIdolMember(idolMemberOptional.get()); // 아이돌 저장
                // 키워드 저장
                wishCard.setKeyword1(wishCardInfoDto.getKeyword1());
                wishCard.setKeyword2(wishCardInfoDto.getKeyword2());
                wishCard.setKeyword3(wishCardInfoDto.getKeyword3());

                // 새로운 정보 저장 - 자동 update
                wishCardRepository.save(wishCard);
                return true; // 성공적으로 업데이트된 경우 true 반환
            } else {
                // 회원 확인
                Optional<UserEntity> userEntityOptional = userRepository.findByUserId(userId);
                if (userEntityOptional.isPresent()) {
                    // 새로운 wishCard 생성 및 저장
                    WishCard newWishCard = new WishCard();
                    newWishCard.setUserEntity(userEntityOptional.get());
                    newWishCard.setIdolMember(idolMemberOptional.get()); // 아이돌 저장
                    // 키워드 저장
                    newWishCard.setKeyword1(wishCardInfoDto.getKeyword1());
                    newWishCard.setKeyword2(wishCardInfoDto.getKeyword2());
                    newWishCard.setKeyword3(wishCardInfoDto.getKeyword3());

                    // ID 설정은 MapsId 어노테이션을 통해 자동으로 처리됨
                    wishCardRepository.save(newWishCard);
                    return true; // 성공적으로 저장된 경우 true 반환
                }
                else{
                    log.info("User with id {} not found", userId);
                    return false;
                }
            }
        }
        else {
            log.info("Idol Member with id {} not found", wishCardInfoDto.getMemberId());
            return false;
        }
    }

    // 갈망포카 불러오기
    @Transactional
    public WishCardResponseDto loadWishCardByUserId(String userId){
        Optional<UserEntity> userEntityOptional = userRepository.findByUserId(userId);
        // 갈망포카 가져오기
        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            // 갈망포카가 있다면 갈망포카, 아이돌 정보 가져오기
            Optional<WishCard> wishCardEntityOptional =
                    wishCardRepository.findByUserEntity_UserId(userEntity.getUserId());
            if (wishCardEntityOptional.isPresent()) {
                // 최애가 있다면 아이돌 정보 가져오기
                WishCard wishCard = wishCardEntityOptional.get();
                Optional<IdolMember> idolMemberOptional =
                        idolMemberRepository.findById(wishCard.getIdolMember().getId());
                if (idolMemberOptional.isPresent()) {
                    IdolMemberResponseDto idolMember = IdolMemberResponseDto.of(idolMemberOptional.get());
                    return WishCardResponseDto.of(wishCard, idolMember);
                }
            }
            return null;
        }
        return null;
    }

    @Transactional
    @Override
    public Boolean deleteWishCardByUserId(String userId) {
        // 회원 확인 및 갈망 포카 유무 확인
        Optional<UserEntity> userEntityOptional = userRepository.findByUserId(userId);
        Optional<WishCard> wishCardEntityOptional = wishCardRepository.findByUserEntity_UserId(userId);
        if (userEntityOptional.isPresent() && wishCardEntityOptional.isPresent()) {
            wishCardRepository.deleteByUserEntity_UserId(userId);
            return true; // 성공적으로 저장된 경우 true 반환
        }
        else{
            log.info("User with wish card {} not found", userId);
            return false;
        }
    }

    @Override
    public WishCardDto findWishCardByUserId(String userId) {
        WishCard wishCardEntity = wishCardRepository.findByUserEntity_UserId(userId)
                .orElseThrow(IllegalArgumentException::new);;
        return WishCardDto.of(wishCardEntity);
    }
}
