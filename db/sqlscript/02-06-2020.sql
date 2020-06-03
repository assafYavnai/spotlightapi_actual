alter table user_check_topics_answers DROP CONSTRAINT user_check_topic_answers_pkey
---------
CREATE TABLE public.user_check_sharables
(
  id serial primary key,
  uniqe_id character varying(255),
  is_accepted boolean,
  is_completed boolean,
  current_topic integer,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  user_check_id integer NOT NULL,
  "current_time" integer
)
WITH (
  OIDS=FALSE
);
--------
alter table user_checks add column sharable_url character varying(255)