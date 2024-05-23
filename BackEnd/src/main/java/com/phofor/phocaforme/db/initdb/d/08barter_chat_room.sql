-- barter chat room table

CREATE TABLE `barter_chat_room`
(
    `barter_chat_room_id`        bigint(20) NOT NULL AUTO_INCREMENT,
    `barter_board_id`            bigint(20)   DEFAULT NULL,
    `barter_latest_chat`         bigint(20)   DEFAULT NULL,
    `barter_owner_latest_chat`   bigint(20)   DEFAULT NULL,
    `barter_room_created_at`     datetime(6)  DEFAULT NULL,
    `barter_visitor_latest_chat` bigint(20)   DEFAULT NULL,
    `barter_board_title`         varchar(255) DEFAULT NULL,
    `barter_owner_id`            varchar(255) DEFAULT NULL,
    `barter_visitor_id`          varchar(255) DEFAULT NULL,
    `barter_chat_room_delete`    bit(1)       DEFAULT NULL,
    PRIMARY KEY (`barter_chat_room_id`),
    KEY `FK8syjsdhq6dsuftxk56cuiq3jc` (`barter_latest_chat`),
    CONSTRAINT `FK8syjsdhq6dsuftxk56cuiq3jc` FOREIGN KEY (`barter_latest_chat`) REFERENCES `barter_chat_messages` (`barter_chat_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;