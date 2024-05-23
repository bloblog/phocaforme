create table user
(
    user_id     CHAR(50) primary key not null,
    user_name   CHAR(20) not null,
    user_kakao_id    VARCHAR(50) unique,
    user_email       VARCHAR(100) unique,
    user_nickname    VARCHAR(50) unique,
    user_bias_id     BIGINT,
    user_created_at  TIMESTAMP not null default current_timestamp,
    user_updated_at  TIMESTAMP not null default current_timestamp,
    user_oauth_type  VARCHAR(50)
);

create table user_device
(
    user_device_user_id CHAR(50) primary key not null,
    foreign key (user_device_user_id) references user (user_id),
    user_device_token VARCHAR(255) unique,
    user_device_created_at  TIMESTAMP not null default current_timestamp,
    user_device_updated_at  TIMESTAMP not null default current_timestamp
);

create table notification
(
    notification_id BIGINT primary key AUTO_INCREMENT not null ,
    notification_user_id CHAR(50) not null,
    foreign key (notification_user_id) references user (user_id),
    notification_title VARCHAR(50) not null,
    notification_content VARCHAR(100) not null,
    notification_created_at TIMESTAMP not null default current_timestamp,
    notification_read_status BOOLEAN not null,
    notification_delete_status BOOLEAN not null,
    notification_type ENUM('Chatting', 'Article') not null,
    notification_article_id BIGINT
);

create table barter_chat_room
(
    barter_chat_room_id        BIGINT primary key not null auto_increment,
    barter_board_id            BIGINT,
    foreign key (barter_board_id) references Barter (barter_board_id),
    barter_owner_id            CHAR(50),
    barter_visitor_id          CHAR(50),
    foreign key (barter_visitor_id) references user (user_id),
    barter_board_title         varchar(255),
    barter_latest_chat         BIGINT,
    barter_owner_latest_chat   BIGINT,
    barter_visitor_latest_chat BIGINT,
    barter_room_created_at     TIMESTAMP not null default CURRENT_TIMESTAMP,
    barter_chat_room_delete    boolean default false
);

create table barter_chat_messages
(
    barter_chat_id          BIGINT primary key not null auto_increment,
    barter_chat_room_id     BIGINT             not null,
    foreign key (barter_chat_room_id) references barter_chat_room (barter_chat_room_id),
    barter_chat_message     TEXT,
    barter_chat_read_or_not boolean default false,
    barter_chat_created_at  TIMESTAMP not null default CURRENT_TIMESTAMP,
    barter_chat_sender_id   CHAR(50)            not null,
    foreign key (barter_chat_sender_id) references user (user_id),
    barter_chat_img_code    varchar(8200)
);

CREATE TABLE Barter
(
    barter_board_id  BIGINT AUTO_INCREMENT PRIMARY KEY, -- 바터 게시물의 고유 ID
    barter_title     VARCHAR(255) NULL,                  -- 게시물 제목
    barter_content   VARCHAR(255) NULL,                  -- 게시물 내용
    barter_card_type VARCHAR(255) NULL,                  -- 카드 타입
    nickname         VARCHAR(255) NULL,                  -- 사용자 닉네임
    barterStatus     TINYINT(1) DEFAULT 0 NULL,          -- 바터 상태 (0: 비활성, 1: 활성)
    bartered         TINYINT(1) DEFAULT 0 NULL,          -- 거래 완료 여부 (0: 미완료, 1: 완료)
    registrationDate DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NULL, -- 등록 날짜 및 시간
    lastModifiedDate DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NULL, -- 마지막 수정 날짜 및 시간
    user_id          CHAR(50) NULL,                      -- 사용자 ID
    CONSTRAINT FK_Barter_User FOREIGN KEY (user_id) REFERENCES user (user_id) -- 사용자 테이블과의 관계
);