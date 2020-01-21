-- Add field "child_category_id" in user_check_topics

alter table user_check_topics add column child_category_id integer;

-- Remove primary key from "user_check_topics_answers" table 
alter table user_check_topics_answers drop constraint user_check_topics_answers_pkey ;

-- Remove Duplicate entry from table first
DELETE FROM user_check_topics_answers where id in(SELECT id from (SELECT max(id) as id,user_check_topic_id,count(user_id) from user_check_topics_answers group by user_check_topic_id,user_id
having count(user_id)>1) tbl);

-- Add primary key from "user_check_topics_answers" table
alter table user_check_topics_answers add constraint user_check_topics_answers_pkey primary key (user_check_topic_id,user_id);
