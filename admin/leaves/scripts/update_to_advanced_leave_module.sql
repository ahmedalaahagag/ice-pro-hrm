ALTER TABLE `LeaveTypes` ADD COLUMN `carried_forward_percentage` int(11) NULL default 0;
ALTER TABLE `LeaveTypes` ADD COLUMN `carried_forward_leave_availability` int(11) NULL default 365;
ALTER TABLE `LeaveTypes` ADD COLUMN `propotionate_on_joined_date` enum('No','Yes') default 'No';

ALTER TABLE `LeaveRules` ADD COLUMN `carried_forward_percentage` int(11) NULL default 0;
ALTER TABLE `LeaveRules` ADD COLUMN `carried_forward_leave_availability` int(11) NULL default 365;
ALTER TABLE `LeaveRules` ADD COLUMN `propotionate_on_joined_date` enum('No','Yes') default 'No';

ALTER TABLE  `LeaveTypes` ADD COLUMN  `leave_group` bigint(20) NULL;