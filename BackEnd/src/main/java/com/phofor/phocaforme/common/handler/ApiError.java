package com.phofor.phocaforme.common.handler;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ApiError {
    private HttpStatus status;
    private String message;
    private String errorDetails;

    public ApiError(HttpStatus status, String message, String errorDetails) {
        super();
        this.status = status;
        this.message = message;
        this.errorDetails = errorDetails;
    }
}
