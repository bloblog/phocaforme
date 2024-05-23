//package com.phofor.phocaforme.board.config;
//
//import com.phofor.phocaforme.idol.repository.IdolMemberRepository;
//import com.phofor.phocaforme.idol.entity.IdolMember;
//import jakarta.annotation.PostConstruct;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class InitDb {
//
//    private final InitService initService;
//
//    @PostConstruct
//    public void init() {
//        initService.dbInit();
//    }
//
//    @Component
//    @Transactional
//    @RequiredArgsConstructor
//    static class InitService {
//
//        private final IdolMemberRepository idolMemberRepository;
//
//        public void dbInit() {
//            for (long i = 0; i < 1000; ++i) {
//                idolMemberRepository.save(
//                        IdolMember.builder()
//                                .id(i)
//                                .image(null)
//                                .idolGroup(null)
//                                .name("name" + i)
//                                .searchCount(0L)
//                                .build()
//                );
//            }
//        }
//    }
//}
