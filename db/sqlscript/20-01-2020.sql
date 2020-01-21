-- Table: public.user_active_logs

-- DROP TABLE public.user_active_logs;

CREATE TABLE public.user_active_logs
(
  id integer NOT NULL DEFAULT nextval('user_active_logs_id_seq'::regclass),
  user_id integer,
  url text,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.user_active_logs
  OWNER TO postgres;


insert into topics_category_masters(name_en,name_he,is_active,"createdAt","updatedAt") values('Base','בסיס',true,current_timestamp,current_timestamp) 
insert into topics_category_masters(name_en,name_he,is_active,"createdAt","updatedAt") values('Insight','תובנה',true,current_timestamp,current_timestamp) 
insert into topics_category_masters(name_en,name_he,is_active,"createdAt","updatedAt") values('Deep','עמוק',true,current_timestamp,current_timestamp) 


update topics_masters set child_category_id=34 where theme_id=10
update topics_masters set child_category_id=35 where theme_id=11
update topics_masters set child_category_id=36 where theme_id=12
