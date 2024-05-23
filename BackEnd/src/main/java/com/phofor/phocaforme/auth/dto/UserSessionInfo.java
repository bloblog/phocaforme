package com.phofor.phocaforme.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Controller에서 사용할 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSessionInfo  {

    private String userId;
    private String email;
    private String nickname;
    private long biasId;

}
