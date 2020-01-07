-- This script use for topic_category_mastera  modified as per requirement when topics_category render in collapsable 
--Add new column check_type
alter table topics_category_masters add column check_type varchar;
--Update check_type
update topics_category_masters set sequence='CUSTOM' where id=9;
update topics_category_masters set sequence='CUSTOM' where id=17;
update topics_category_masters set sequence='CUSTOM' where id=18;
--Add new Column Sequence
alter table topics_category_masters add column sequence integer;
--Update Sequence
update topics_category_masters set sequence=1 where id=9;
update topics_category_masters set sequence=2 where id=17;
update topics_category_masters set sequence=3 where id=18;


---Add new field in users table 
alter table users add column last_login timestamp with time zone