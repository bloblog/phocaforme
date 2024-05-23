-- barter table

CREATE TABLE barter
(
    barter_board_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    barter_title     VARCHAR(255) NULL,
    barter_content   VARCHAR(255) NULL,
    barter_card_type VARCHAR(255) NULL,
    barter_status     TINYINT(1) DEFAULT 0,
    bartered         TINYINT(1) DEFAULT 0,
    barter_group_id BIGINT NULL,
    created_date DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NULL,
    last_modified_date DATETIME(6) DEFAULT CURRENT_TIMESTAMP,
    user_id          CHAR(50) NULL,
    CONSTRAINT FK_Barter_User FOREIGN KEY (user_id) REFERENCES user (user_id)
);