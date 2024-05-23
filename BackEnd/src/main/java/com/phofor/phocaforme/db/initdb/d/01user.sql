-- user table

create table user
(
    user_id         CHAR(50) primary key not null,
    user_name       CHAR(20)             not null,
    user_kakao_id   VARCHAR(50) unique,
    user_email      VARCHAR(100) unique,
    user_nickname   VARCHAR(50) unique,
    user_bias_id    BIGINT,
    user_created_at TIMESTAMP            not null default current_timestamp,
    user_updated_at TIMESTAMP            not null default current_timestamp,
    user_oauth_type VARCHAR(50)
);
