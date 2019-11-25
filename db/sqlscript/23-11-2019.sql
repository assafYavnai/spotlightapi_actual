-- This script for sendInvitation table altering->Removing the primary_key from id column    and apply the multiple column(email,user_check_id).
--Delete primary Key 
alter table user_check_invitations drop constraint user_check_invitations_pkey ;
--delete user_check_id null values
DELETE from user_check_invitations where user_check_id is null;
--- add multiple primary key
alter table user_check_invitations add constraint user_check_pkey primary key (email,user_check_id);
--- delete duplicate record of email and user_check_id
DELETE FROM user_check_invitations where id in(SELECT id from (SELECT max(id) as id,user_check_id,count(email) from user_check_invitations group by user_check_id,email
having count(email)>1) tbl);