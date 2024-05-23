-- barter own idol table

CREATE TABLE `barter_own_idol`
(
    `barter_board_id` bigint(20) DEFAULT NULL,
    `barter_own_id`   bigint(20) NOT NULL AUTO_INCREMENT,
    `idol_member_id`  bigint(20) DEFAULT NULL,
    PRIMARY KEY (`barter_own_id`),
    KEY `FKlhqs21wlhu7hk6khblvx2qty` (`barter_board_id`),
    KEY `FK2qceo7ae3vmo23vi6xdosnrn6` (`idol_member_id`),
    CONSTRAINT `FK2qceo7ae3vmo23vi6xdosnrn6` FOREIGN KEY (`idol_member_id`) REFERENCES `idol_member` (`idol_member_id`),
    CONSTRAINT `FKlhqs21wlhu7hk6khblvx2qty` FOREIGN KEY (`barter_board_id`) REFERENCES `barter` (`barter_board_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;