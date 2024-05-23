package com.phofor.phocaforme.gps.service;

import com.phofor.phocaforme.gps.dto.GpsLocationDto;

import java.util.Map;

public interface GpsService {
    String getAddress(GpsLocationDto gpsLocationDto) throws Exception;

    Boolean saveGpsData(String userId, GpsLocationDto gpsLocationDto);
}
