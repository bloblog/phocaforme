package com.phofor.phocaforme.common.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class RestGlobalExceptionHandler {

    // NoHandlerFoundException 예외 처리
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException ex, WebRequest request) {

        ApiError apiError = new ApiError(
                HttpStatus.NOT_FOUND,
                ex.getLocalizedMessage(),
                "Resource not found");

        return new ResponseEntity<Object>(apiError, HttpStatus.NOT_FOUND);
    }

    // 기타 예외 처리
    // 추가적인 예외 처리 로직을 여기에 구현할 수 있다.
}