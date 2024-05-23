-- notification table

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
