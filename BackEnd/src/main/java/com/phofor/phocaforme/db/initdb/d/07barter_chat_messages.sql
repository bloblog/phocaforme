-- barter chat messages table

CREATE TABLE `barter_chat_messages`
(
    `barter_chat_id`         bigint(20) NOT NULL AUTO_INCREMENT,
    `barter_chat_room_id`    bigint(20)   DEFAULT NULL,
    `barter_chat_img_code`   varchar(255) DEFAULT NULL,
    `barter_chat_message`    text         DEFAULT NULL,
    `barter_chat_sender_id`  varchar(255) DEFAULT NULL,
    `barter_chat_created_at` datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`barter_chat_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;