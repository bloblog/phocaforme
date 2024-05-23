-- barter image table

CREATE TABLE `barter_image`
(
    `barter_board_id` bigint(20)   DEFAULT NULL,
    `barter_image_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `barter_img_code` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`barter_image_id`),
    KEY `FK9hj4c092d4gvqqrxdjo6g83oj` (`barter_board_id`),
    CONSTRAINT `FK9hj4c092d4gvqqrxdjo6g83oj` FOREIGN KEY (`barter_board_id`) REFERENCES `barter` (`barter_board_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;