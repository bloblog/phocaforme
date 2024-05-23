package com.phofor.phocaforme.chat.handler;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.IOUtils;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
// https://velog.io/@dirn0568/Socket-%EC%8B%A4%EC%8B%9C%EA%B0%84-%EC%B1%84%ED%8C%85-%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%A0%84%EC%86%A1


//@Component
public class SocketHandler extends TextWebSocketHandler {   // TextWebSocketHandler 상속

    List<HashMap<String, Object>> sessions = new ArrayList<>(); // roomNumber 별로 세션 저장
    static int roomIndex = -1;
    private String S3Bucket = "photocardforme"; // Bucket 이름 aws img
    //@Autowired  // aws img test
    AmazonS3Client amazonS3Client;

    // 파일 저장 경로
    private static final String FILE_UPLOAD_PATH = "src/main/resources/static";

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 메시지 발송, 구독 개념이 아닌 세션들을 찾아서 찾은 세션들한테만 보내주는 개념(아마도)
        String msg = message.getPayload();
        JSONObject obj = jsonToObjectParser(msg);

        String roomNumber = (String) obj.get("roomNumber");
        String msgType = (String) obj.get("type");
        HashMap<String, Object> sessionMap = new HashMap<String, Object>();

        if (sessions.size() > 0) {
            for (int i=0;i<sessions.size();i++) {
                String tempRoomNumber = (String) sessions.get(i).get("roomNumber");
                if (roomNumber.equals(tempRoomNumber)) {
                    sessionMap = sessions.get(i);
                    roomIndex = i;
                    break;
                }
            }

            if (!msgType.equals("file")) {
                // 해당 방에 있는 세션들에만 메시지 전송
                for (String sessionMapKey: sessionMap.keySet()) {
                    if (sessionMapKey.equals("roomNumber")) {   // 방 번호일 경우에는 건너뛴다
                        continue;
                    }
                    WebSocketSession webSocketSession = (WebSocketSession) sessionMap.get(sessionMapKey);
                    // webSocketSession == StandardWebSocketSession[id=9b6f63f7-c1b1-9a09-5110-1fdff5973f86,
                    // uri=ws://localhost:8080/chating/abc]
                    webSocketSession.sendMessage(new TextMessage(obj.toJSONString()));
                }
            }
        }
    }

    @Override
    public void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        // 바이너리 메시지 발송
        ByteBuffer byteBuffer = message.getPayload();
//        byte[] bytes = message.getPayload().array();
//        ByteBuffer byteBuffer = ByteBuffer.wrap(bytes);
        // BinaryMessage를 getPayload()함수를 통해 ByteBuffer로 변환시켜준다
        String fileName = "file.jpg";

        File dir = new File(FILE_UPLOAD_PATH);
        if (!dir.exists()) {
            dir.mkdir();
        }

        File Old_File = new File(FILE_UPLOAD_PATH + "/file.jpg");   // 삭제할 파일을 찾아준다
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(Old_File);
            fileOutputStream.close();   // 파일 삭제시 FileOutputStream을 닫아줘야함
            Old_File.delete();  // 삭제
        } catch (Exception e) {
            e.printStackTrace();
        }

        File file = new File(FILE_UPLOAD_PATH, fileName);   // 파일을 새로 생성해줌

        FileOutputStream fileOutputStream = null;
        FileChannel fileChannel = null;
        try {
            byteBuffer.flip();  // byteBuffer를 읽기 위해 셋팅
            fileOutputStream = new FileOutputStream(file, true);    // 생성을 위해 OutputStream을 연다
            fileChannel = fileOutputStream.getChannel();    // 채널을 열고
            byteBuffer.compact();   // 파일을 복사한다
            fileChannel.write(byteBuffer);  // 파일을 쓴다
        }catch (Exception e) {
            e.printStackTrace();
        }finally {
            try {
                if (fileOutputStream != null) {
                    fileOutputStream.close();
                } if (fileChannel != null) {
                    fileChannel.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        String imageurl = "";
        try {
            FileItem fileItem = new DiskFileItem("mainFile",
                    Files.probeContentType(file.toPath()), false, file.getName(), (int)file.length(), file.getParentFile());
            // File을 MultiPartFile로 변환하는 과정 -> 우선 file을 DiskFileItem에 넣어준다
            try {
                InputStream input = new FileInputStream(file);  // 파일에서 바이트 파일로 읽을 수 있게 해줌
                OutputStream os = fileItem.getOutputStream();   // OutputStream을 생성
                IOUtils.copy(input, os);    // 복사
                // Or faster...
                // IOUtils.copy(new FileInputStream(file), fileItem.getOutputStream());
            } catch (IOException ex) {
                // do something.
            }
            //MultipartFile multipartFile = new CommonsMultipartFile(fileItem);   // File을 MultipartFile로 변환시키기
            // 저 코드가 맞는 코드인데 Spring 3버전으로 올라오면서 commons 관련 패키지가 싹 다 사라짐...

            String originalName = UUID.randomUUID().toString(); // aws s3 저장 과정
            long imageFileSize = fileItem.getSize();    // aws s3 저장 과정

            ObjectMetadata objectMetadata = new ObjectMetadata();   // aws s3 저장 과정


        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private JSONObject jsonToObjectParser(String msg) {
        return null;
    }

}





