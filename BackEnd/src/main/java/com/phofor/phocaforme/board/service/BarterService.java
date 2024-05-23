package com.phofor.phocaforme.board.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.board.config.ApplicationEventPublisherHolder;
import com.phofor.phocaforme.board.dto.BarterDetailDto;
import com.phofor.phocaforme.board.dto.BarterRegisterDto;
import com.phofor.phocaforme.board.dto.BarterUpdateDto;
import com.phofor.phocaforme.board.dto.queueDTO.BarterMessage;
import com.phofor.phocaforme.board.entity.Barter;
import com.phofor.phocaforme.board.entity.BarterFindIdol;
import com.phofor.phocaforme.board.entity.BarterImage;
import com.phofor.phocaforme.board.entity.BarterOwnIdol;
import com.phofor.phocaforme.board.repository.*;
import com.phofor.phocaforme.common.rabbit.producer.events.PostDeleteEvent;
import com.phofor.phocaforme.common.rabbit.producer.events.PostPersistEvent;
import com.phofor.phocaforme.common.rabbit.producer.events.PostUpdateEvent;
import com.phofor.phocaforme.idol.entity.IdolMember;
import com.phofor.phocaforme.idol.repository.IdolMemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BarterService {

    private final BarterRepository barterRepository;
    private final BarterImageRepository barterImageRepository;
    private final BarterOwnIdolRepository barterOwnIdolRepository;
    private final BarterFindIdolRepository barterFindIdolRepository;
    private final IdolMemberRepository idolMemberRepository;

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.base-url}")
    private String baseUrl;

//    public Page<BarterThumbnailDto> findAll(Pageable pageable){
//        Page<Barter> barters = barterRepository.findAll(pageable);
//        Page<BarterThumbnailDto> thumbnails = new Page<BarterThumbnailDto>();
//        for(Barter barter : barters) {
//            thumbnails.add(BarterThumbnailDto.of(barter));
//        }
//        return thumbnails;
//    }

    // 상세게시물 보기
    @Transactional
    public BarterDetailDto findOne(Long barterId){
        Barter barter = barterRepository.findById(barterId)
                .orElseThrow(IllegalArgumentException::new);

        return BarterDetailDto.of(barter);
    }

    // 교환게시글 등록
    public Barter registerBarter(BarterRegisterDto registerDto, UserEntity userEntity) throws IOException {
        Barter barter = Barter.builder()
                .userEntity(userEntity)
                .title(registerDto.getTitle())
                .content(registerDto.getContent())
                .cardType((registerDto.getCardType()))
                .groupId((registerDto.getGroupId()))
                .build();
        Barter savedBarter = barterRepository.save(barter);
        
        // 아이돌 멤버 테이블에서 찾는 멤버, 소유 멤버 정보들 가져오기
        List<IdolMember> ownIdols = idolMemberRepository.findAllById(registerDto.getOwnIdolMembers());
        List<IdolMember> findIdols = idolMemberRepository.findAllById(registerDto.getFindIdolMembers());

        for(IdolMember ownIdol : ownIdols){
            BarterOwnIdol barterOwnIdol = BarterOwnIdol.builder()
                    .idolMember(ownIdol)
                    .barter(savedBarter)
                    .build();
            barterOwnIdolRepository.save(barterOwnIdol);
        }

        for(IdolMember findIdol : findIdols){
            BarterFindIdol barterFindIdol = BarterFindIdol.builder()
                    .idolMember(findIdol)
                    .barter(savedBarter)
                    .build();
            barterFindIdolRepository.save(barterFindIdol);
        }

        // 다중사진들 저장하기
        if(registerDto.getPhotos()!=null){
            List<MultipartFile> photos = registerDto.getPhotos();
            for(MultipartFile photo : photos){
                // AW3 S3에 사진 올리기
                String fileName = "barter/" + UUID.randomUUID() + photo.getOriginalFilename();
                String fileUrl = baseUrl + fileName;
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(photo.getContentType());
                metadata.setContentLength(photo.getSize());

                PutObjectRequest putObjectRequest = new PutObjectRequest(
                        bucket, fileName, photo.getInputStream(), metadata
                );
                putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead);
                amazonS3Client.putObject(putObjectRequest);

                // 교환게시글 사진테이블에 사진 저장하기
                BarterImage barterImage = BarterImage.builder()
                        .imgCode(fileName)
                        .barter(savedBarter)
                        .build();
                barterImageRepository.save(barterImage);
            }
        } else {
            BarterImage barterImage = BarterImage.builder()
                    .imgCode("icon.PNG")
                    .barter(savedBarter)
                    .build();
            barterImageRepository.save(barterImage);
        }
        // 기존 @PostPersist의 문제로 이쪽으로 이동
        publishPersistEvent(savedBarter, 0);
        return savedBarter;
    }

    // 교환게시글 수정하기
    public void update(UserEntity user, Long barterId, BarterUpdateDto updateDto) throws IOException {
        Barter barter = barterRepository.findById(barterId)
                .orElseThrow(IllegalArgumentException::new);

        // 일정 부분을 찾아 수정하는 것보다 전부 다 지워주고 다시 올려주는 방식을 선택
        deleteDB(barter);

        if(!barter.getImages().get(0).getImgCode().equals("icon.PNG"))
            deleteS3(barter.getImages());

        barter.update(user, updateDto.getTitle(), updateDto.getContent(), updateDto.getCardType(), updateDto.getGroupId(), LocalDateTime.now());

        // register 방법과 똑같음
        List<IdolMember> newOwnIdols = idolMemberRepository.findAllById(updateDto.getOwnIdolMembers());
        List<IdolMember> newFindIdols = idolMemberRepository.findAllById(updateDto.getFindIdolMembers());

        for(IdolMember ownIdol : newOwnIdols){
            BarterOwnIdol barterOwnIdol = BarterOwnIdol.builder()
                    .idolMember(ownIdol)
                    .barter(barter)
                    .build();
            barterOwnIdolRepository.save(barterOwnIdol);
        }

        for(IdolMember findIdol : newFindIdols){
            BarterFindIdol barterFindIdol = BarterFindIdol.builder()
                    .idolMember(findIdol)
                    .barter(barter)
                    .build();
            barterFindIdolRepository.save(barterFindIdol);
        }

        if(updateDto.getPhotos()!=null) {
            List<MultipartFile> photos = updateDto.getPhotos();
            for (MultipartFile photo : photos) {
                String fileName = "barter/" + UUID.randomUUID() + photo.getOriginalFilename();
                String fileUrl = baseUrl + fileName;
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(photo.getContentType());
                metadata.setContentLength(photo.getSize());

                PutObjectRequest putObjectRequest = new PutObjectRequest(
                        bucket, fileName, photo.getInputStream(), metadata
                );
                putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead);
                amazonS3Client.putObject(putObjectRequest);

                BarterImage barterImage = BarterImage.builder()
                        .imgCode(fileName)
                        .barter(barter)
                        .build();
                barterImageRepository.save(barterImage);
            }
        } else { // 사진을 업로드하지 않을 시 기본 이미지가 들어감
            BarterImage barterImage = BarterImage.builder()
                    .imgCode("icon.PNG")
                    .barter(barter)
                    .build();
            barterImageRepository.save(barterImage);
        }
        publishUpdateEvent(barter,1);
    }

    // 교환게시글 삭제하기
    public void delete(Long barterId){
        Barter barter = barterRepository.findById(barterId)
                .orElseThrow(IllegalArgumentException::new);
        deleteDB(barter);
        if(!barter.getImages().get(0).getImgCode().equals("icon.PNG"))
            deleteS3(barter.getImages());
        barterRepository.deleteById(barterId);
        publishDeleteEvent(barter,2);
    }

    // 교환게시글 관련 테이블 정보 다 삭제하기
    private void deleteDB(Barter barter){
        List<BarterFindIdol> findIdols = barter.getFindIdols();
        barterFindIdolRepository.deleteAllById(barter
                .getFindIdols()
                .stream()
                .map(BarterFindIdol::getId)
                .collect(Collectors.toList()));

//        List<Long> result = new ArrayList<>();
//        for (BarterFindIdol idol: findIdols) {
//            result.add(idol.getId());
//        }

        List<BarterOwnIdol> ownIdols = barter.getOwnIdols();
        barterOwnIdolRepository.deleteAllById(barter
                .getOwnIdols()
                .stream()
                .map(BarterOwnIdol::getId)
                .collect(Collectors.toList()));

        if(barter.getImages()!=null) {
            List<BarterImage> images = barter.getImages();
            barterImageRepository.deleteAllById(barter
                    .getImages()
                    .stream()
                    .map(BarterImage::getId)
                    .collect(Collectors.toList()));
        }
    }

    private void deleteS3(List<BarterImage> images){
        for (BarterImage image: images) {
            String fileName = image.getImgCode();
            amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, fileName));
        }
    }

    public Long regen(Long barterId){
        Barter barter = barterRepository.findById(barterId)
                .orElseThrow(IllegalArgumentException::new);

        Barter newBarter = Barter.builder()
                .userEntity(barter.getUser())
                .title(barter.getTitle())
                .content(barter.getContent())
                .cardType((barter.getCardType()))
                .groupId(barter.getGroupId())
                .build();
        barterRepository.save(newBarter);

        List<BarterOwnIdol> barterOwnIdols = barterOwnIdolRepository.findByBarter(barter);
        List<BarterFindIdol> barterFindIdols = barterFindIdolRepository.findByBarter(barter);
        List<BarterImage> photos = barterImageRepository.findByBarter(barter);

        for(BarterOwnIdol ownIdol : barterOwnIdols){
            BarterOwnIdol newOwnIdol = BarterOwnIdol.builder()
                    .idolMember(ownIdol.getIdolMember())
                    .barter(newBarter)
                    .build();
            barterOwnIdolRepository.save(newOwnIdol);
        }

        for(BarterFindIdol findIdol : barterFindIdols){
            BarterFindIdol newFindIdol = BarterFindIdol.builder()
                    .idolMember(findIdol.getIdolMember())
                    .barter(newBarter)
                    .build();
            barterFindIdolRepository.save(newFindIdol);
        }

        for(BarterImage photo : photos){
            BarterImage newPhoto = BarterImage.builder()
                    .imgCode(photo.getImgCode())
                    .barter(newBarter)
                    .build();
            barterImageRepository.save(newPhoto);
        }
        publishPersistEvent(newBarter,0);

        deleteDB(barter);
        barterRepository.deleteById(barterId);
        publishDeleteEvent(barter,2);
        return newBarter.getId();
    }

    private void publishPersistEvent(Barter barter, int type){
        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
        if (publisher != null) {
            System.out.println(barter.getId());
            LocalDateTime localDateTime = barter.getRegistrationDate();
            ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
            Instant instant = zonedDateTime.toInstant();
            PostPersistEvent event = new PostPersistEvent(new BarterMessage(
                    barter.getId(),
                    barter.isBartered(),
                    type,
                    instant)
            );
            publisher.publishEvent(event);
        }
    }

    private void publishUpdateEvent(Barter barter, int type){
        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
        if (publisher != null) {
            LocalDateTime localDateTime = barter.getRegistrationDate();
            ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
            Instant instant = zonedDateTime.toInstant();
            PostUpdateEvent event = new PostUpdateEvent(new BarterMessage(
                    barter.getId(),
                    barter.isBartered(),
                    type,
                    instant)
            );
            publisher.publishEvent(event);
        }
    }

    private void publishDeleteEvent(Barter barter, int type){
        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
        if (publisher != null) {
            LocalDateTime localDateTime = barter.getRegistrationDate();
            ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
            Instant instant = zonedDateTime.toInstant();
            PostDeleteEvent event = new PostDeleteEvent(new BarterMessage(
                    barter.getId(),
                    barter.isBartered(),
                    type,
                    instant)
            );
            publisher.publishEvent(event);
        }
    }
}