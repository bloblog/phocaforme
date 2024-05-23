create table user_wish_card
(
    user_wish_id BIGINT primary key AUTO_INCREMENT not null ,
    user_wish_user_id CHAR(50) unique not null,
    foreign key (user_wish_user_id) references user (user_id),
    user_wish_idol_member_id BIGINT(20) not null,
    foreign key (user_wish_idol_member_id) references idol_member (idol_member_id),
    user_wish_keyword1 VARCHAR(50) unique,
    user_wish_keyword2 VARCHAR(50) unique,
    user_wish_keyword3 VARCHAR(50) unique,
    user_wish_created_at  TIMESTAMP not null default current_timestamp,
    user_wish_updated_at  TIMESTAMP not null default current_timestamp
);