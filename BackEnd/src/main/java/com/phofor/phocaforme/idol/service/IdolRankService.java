package com.phofor.phocaforme.idol.service;

import com.phofor.phocaforme.idol.dto.response.IdolRankResponseDto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface IdolRankService {
    IdolRankResponseDto find();
}
