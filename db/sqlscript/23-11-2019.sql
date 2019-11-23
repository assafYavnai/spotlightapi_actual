-- This script for sendInvitation table altering->Removing the primary_key from id column    and apply the multiple column(email,user_check_id).

-- Remove Existing PrimaryKey
alter table user_check_invitations drop constraint user_check_invitations_pkey ;

--add multiple pkey(email,user_check_id)

alter table user_check_invitations add constraint user_check_pkey primary key (email,user_check_id);

-- Delete Null Record of user_check_id
DELETE FROM user_check_invitations WHERE user_check_id IN NULL 