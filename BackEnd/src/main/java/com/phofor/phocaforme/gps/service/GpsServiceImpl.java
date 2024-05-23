package com.phofor.phocaforme.gps.service;

import com.phofor.phocaforme.auth.service.redis.RedisService;
import com.phofor.phocaforme.gps.dto.GpsLocationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GpsServiceImpl implements GpsService {

    @Value("${project.client-id}")
    private String REST_KEY;

    private final RedisService redisService;

    @Override
    public String getAddress(GpsLocationDto gpsLocationDto) throws Exception {
        JSONObject addressObject = convertAddress(
                gpsLocationDto.getLongitude(), gpsLocationDto.getLatitude()
        );

        JSONObject meta = (JSONObject) addressObject.get("meta");
        int size = (int) meta.get("total_count");
        if (size > 0) {
            JSONArray addressArray = (JSONArray) addressObject.get("documents");
            JSONObject subAddressObject = (JSONObject) addressArray.get(0);

            if(subAddressObject.get("address") != null){ // 지번 주소
                JSONObject address = (JSONObject) subAddressObject.get("address");
                return (String) address.get("address_name");
            }
            else if(subAddressObject.get("road_address") != null) { // 도로명 주소
                JSONObject road_address = (JSONObject) subAddressObject.get("road_address");
                return (String) road_address.get("address_name");
            }
        }
        throw new Exception();
    }

    @Override
    public Boolean saveGpsData(String userId, GpsLocationDto gpsLocationDto) {
        Map<String, Double> userGpsData = new HashMap<>();
        userGpsData.put("longitude", gpsLocationDto.getLongitude());
        userGpsData.put("latitude", gpsLocationDto.getLatitude());
        try{
            redisService.saveGpsData(userId, userGpsData);
            return true;
        }
        catch (Exception e) {
            log.info("데이터 저장 오류");
            return false;
        }
    }

    public JSONObject convertAddress(double x, double y) {
        String apiUrl = "https://dapi.kakao.com/v2/local/geo/coord2address.json?x=" + x + "&y=" + y + "&input_coord=WGS84";
        JSONObject addressObject = null;

        try {
            URL url = new URL(apiUrl);
            URLConnection conn = url.openConnection();
            conn.setRequestProperty("Authorization", "KakaoAK " + REST_KEY);
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            addressObject = new JSONObject(br.readLine());
        } catch (Exception e) {
            log.error("에러 발생", e);
            e.printStackTrace();
        }
        return addressObject;
    }
}