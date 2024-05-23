CREATE TABLE idol_rank (
                           idol_rank_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           first_female_idol_id BIGINT,
                           second_female_idol_id BIGINT,
                           third_female_idol_id BIGINT,
                           first_male_idol_id BIGINT,
                           second_male_idol_id BIGINT,
                           third_male_idol_id BIGINT,
                           created_date DATETIME(6) default current_timestamp(6),
                           CONSTRAINT FK_first_female_idol FOREIGN KEY (first_female_idol_id) REFERENCES idol_member(idol_member_id),
                           CONSTRAINT FK_second_female_idol FOREIGN KEY (second_female_idol_id) REFERENCES idol_member(idol_member_id),
                           CONSTRAINT FK_third_female_idol FOREIGN KEY (third_female_idol_id) REFERENCES idol_member(idol_member_id),
                           CONSTRAINT FK_first_male_idol FOREIGN KEY (first_male_idol_id) REFERENCES idol_member(idol_member_id),
                           CONSTRAINT FK_second_male_idol FOREIGN KEY (second_male_idol_id) REFERENCES idol_member(idol_member_id),
                           CONSTRAINT FK_third_male_idol FOREIGN KEY (third_male_idol_id) REFERENCES idol_member(idol_member_id)
);