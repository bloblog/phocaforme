-- barter find idol

CREATE TABLE `barter_find_idol`
(
    `barter_board_id` bigint(20) DEFAULT NULL,
    `barter_find_id`  bigint(20) NOT NULL AUTO_INCREMENT,
    `idol_member_id`  bigint(20) DEFAULT NULL,
    PRIMARY KEY (`barter_find_id`),
    KEY `FK337te895vx8beghuhst57r7l` (`barter_board_id`),
    KEY `FK2ggjmradi2lx9es2kq13e1ndh` (`idol_member_id`),
    CONSTRAINT `FK2ggjmradi2lx9es2kq13e1ndh` FOREIGN KEY (`idol_member_id`) REFERENCES `idol_member` (`idol_member_id`),
    CONSTRAINT `FK337te895vx8beghuhst57r7l` FOREIGN KEY (`barter_board_id`) REFERENCES `barter` (`barter_board_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;