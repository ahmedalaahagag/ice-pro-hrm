<?php
/*
This file is part of iCE Hrm.

iCE Hrm is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

iCE Hrm is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with iCE Hrm. If not, see <http://www.gnu.org/licenses/>.

------------------------------------------------------------------

Original work Copyright (c) 2012 [Gamonoid Media Pvt. Ltd]  
Developer: Thilina Hasantha (thilina.hasantha[at]gmail.com / facebook.com/thilinah)
 */

$moduleName = 'leaves';
define('MODULE_PATH',dirname(__FILE__));
include APP_BASE_PATH.'header.php';
include APP_BASE_PATH.'modulejslibs.inc.php';


$moduleBuilder = new ModuleBuilder();

$options1 = array();
$options1['setRemoteTable'] = 'true';


//$moduleBuilder->addModuleOrGroup(new ModuleTab('LeavePeriod','LeavePeriod','Leave Period','LeavePeriodAdapter','',''));
$moduleBuilder->addModuleOrGroup(new ModuleTab('WorkDay','WorkDay','Work Week','WorkDayAdapter','','',true));
$moduleBuilder->addModuleOrGroup(new ModuleTab('HoliDay','HoliDay','Holidays','HoliDayAdapter','','',false,$options1));
$moduleBuilder->addModuleOrGroup(new ModuleTab('LeaveType','LeaveType','Leave Types','LeaveTypeAdapter','','',false));
//$moduleBuilder->addModuleOrGroup(new ModuleTab('LeaveRule','LeaveRule','Leave Rules','LeaveType','',''));
//$moduleBuilder->addModuleOrGroup(new ModuleTab('LeaveStartingBalance','LeaveStartingBalance','Paid Time Off','LeaveStartingBalanceAdapter','',''));


//$moduleGroup1 = new ModuleTabGroup('leaveGroupMenu','Leave Groups');
//$moduleGroup1->addModuleTab(new ModuleTab('LeaveGroup','LeaveGroup','Edit Leave Groups','LeaveGroupAdapter','',''));
//$moduleGroup1->addModuleTab(new ModuleTab('LeaveGroupEmployee','LeaveGroupEmployee','Leave Group Employees','LeaveGroupEmployeeAdapter','','leave_group'));

//$moduleBuilder->addModuleOrGroup($moduleGroup1);

$options2 = array();
$options2['setRemoteTable'] = 'true';
$options2['setShowAddNew'] = 'false';
$moduleBuilder->addModuleOrGroup(new ModuleTab('EmployeeLeave','EmployeeLeave','Employee Leave List','EmployeeLeaveAdapter','','date_start desc',false,$options2));

echo UIManager::getInstance()->renderModule($moduleBuilder);
?>

<div class="modal" id="leaveStatusModel" tabindex="-1" role="dialog" aria-labelledby="messageModelLabel" aria-hidden="true">
<div class="modal-dialog">
<div class="modal-content">	
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><li class="fa fa-times"/></button>
		<h3 style="font-size: 17px;">Change Leave Status</h3>
	</div>
	<div class="modal-body">
		<form id="leaveStatusForm">
		<div class="control-group">
			<label class="control-label" for="leave_status">Leave Status</label>
			<div class="controls">
			  	<select type="text" id="leave_status" class="form-control" name="leave_status" value="">
				  	<option value="Approved">Approved</option>
				  	<option value="Pending">Pending</option>
				  	<option value="Rejected">Rejected</option>
				  	<option value="Cancelled">Cancelled</option>
			  	</select>
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="leave_status">Status Change Note</label>
			<div class="controls">
			  	<textarea id="leave_reason" class="form-control" name="leave_reason" maxlength="500"></textarea>
			</div>
		</div>
		</form>
	</div>
	<div class="modal-footer">
 		<button class="btn btn-primary" onclick="modJs.changeLeaveStatus();">Change Leave Status</button>
 		<button class="btn" onclick="modJs.closeLeaveStatus();">Not Now</button>
	</div>
</div>
</div>
</div>

<?php include APP_BASE_PATH.'footer.php';?>      