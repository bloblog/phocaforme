-- user device table

create table user_device
(
    user_device_user_id CHAR(50) primary key not null,
    foreign key (user_device_user_id) references user (user_id),
    user_device_token VARCHAR(255) unique,
    user_device_created_at  TIMESTAMP not null default current_timestamp,
    user_device_updated_at  TIMESTAMP not null default current_timestamp
);
