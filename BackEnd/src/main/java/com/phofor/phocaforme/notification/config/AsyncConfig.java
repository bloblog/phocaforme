package com.phofor.phocaforme.notification.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "asyncTaskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(20);  // 최소 5개의 스레드
        executor.setMaxPoolSize(50);  // 최대 10개의 스레드를 사용할 수 있음
        executor.setQueueCapacity(500); // 작업 대기열 크기
        executor.setThreadNamePrefix("Async-");  // 스레드 이름 프리픽스 설정
        executor.initialize();
        return executor;
    }
//    @Bean(name = "asyncTaskExecutor")
//    public ThreadPoolTaskExecutor taskExecutor() {  // 리턴 타입을 ThreadPoolTaskExecutor로 변경
//        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
//        executor.setCorePoolSize(5);  // 최소 5개의 스레드
//        executor.setMaxPoolSize(10);  // 최대 10개의 스레드를 사용할 수 있음
//        executor.setQueueCapacity(100); // 작업 대기열 크기
//        executor.setThreadNamePrefix("Async-");  // 스레드 이름 프리픽스 설정
//        executor.initialize();
//        return executor;
//    }
}