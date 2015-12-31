<?php
if (!class_exists('LeavesAdminManager')) {
	class LeavesAdminManager extends AbstractModuleManager{
		
		public function initializeUserClasses(){
			
		}
		
		public function initializeFieldMappings(){
			
		}
		
		public function initializeDatabaseErrorMappings(){
			$this->addDatabaseErrorMapping("LeaveGroupEmployees_employee", "An employee can only be added to one leave group");
		}
		
		public function setupModuleClassDefinitions(){
			
			$this->addModelClass('LeaveType');
			$this->addModelClass('LeavePeriod');
			$this->addModelClass('WorkDay');
			$this->addModelClass('HoliDay');
			$this->addModelClass('LeaveRule');
			$this->addModelClass('LeaveGroup');
			$this->addModelClass('LeaveGroupEmployee');
			
		}
		
	}
}


if (!class_exists('LeaveType')) {
	class LeaveType extends ICEHRM_Record {
		var $_table = 'LeaveTypes';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}


		public function getUserAccess(){
			return array();
		}
		
		public function isProcessMappings(){
			return true;
		}
		
		
		public function getUserLeaveTypes(){
			$ele = new LeaveType();
			$empLeaveGroupId = NULL;
			$employeeId = BaseService::getInstance()->getCurrentProfileId();
			$empLeaveGroup = new LeaveGroupEmployee();
			$empLeaveGroup->Load("employee = ?",array($employeeId));
			if($empLeaveGroup->employee == $employeeId && !empty($empLeaveGroup->id)){
				$empLeaveGroupId =  $empLeaveGroup->leave_group;
			}	
			
			if(empty($empLeaveGroupId)){
				$list = $ele->Find('leave_group IS NULL',array());
			}else{
				$list = $ele->Find('leave_group IS NULL or leave_group = ?',array($empLeaveGroupId));
			}
			
			return $list;
		}
	}
}
	
if (!class_exists('LeavePeriod')) {
	class LeavePeriod extends ICEHRM_Record {
		var $_table = 'LeavePeriods';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array();
		}

		public function validateSave($obj){
			$leavePeriod = new LeavePeriod();
			$leavePeriods = $leavePeriod->Find("1=1");

			if(strtotime($obj->date_end) <= strtotime($obj->date_start)){
				return new IceResponse(IceResponse::ERROR,"Start date should be less than end date");
			}

			foreach($leavePeriods as $lp){
				if(!empty($obj->id) && $obj->id == $lp->id){
					continue;
				}

				if(strtotime($lp->date_end) >= strtotime($obj->date_end) && strtotime($lp->date_start) <= strtotime($obj->date_end)){
					//-1---0---1---0 || ---0--1---1---0
					return new IceResponse(IceResponse::ERROR,"Leave period is overlapping with an existing one");
				}else if(strtotime($lp->date_end) >= strtotime($obj->date_start) && strtotime($lp->date_start) <= strtotime($obj->date_start)){
					//---0---1---0---1 || ---0--1---1---0
					return new IceResponse(IceResponse::ERROR,"Leave period is overlapping with an existing one");
				}else if(strtotime($lp->date_end) <= strtotime($obj->date_end) && strtotime($lp->date_start) >= strtotime($obj->date_start)){
					//--1--0---0--1--
					return new IceResponse(IceResponse::ERROR,"Leave period is overlapping with an existing one");
				}
			}
			return new IceResponse(IceResponse::SUCCESS,"");
		}
	}
}
	
	
if (!class_exists('WorkDay')) {
	class WorkDay extends ICEHRM_Record {
		var $_table = 'WorkDays';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array();
		}

		public function validateSave($obj){
			$name = $obj->name;
			$location = $obj->location;
			$workDays = new WorkDay();
			$workDaysDuplicatied = $workDays->Find("name=? AND location=?",array($name,$location));
			if($workDaysDuplicatied[0]->id){
				return new IceResponse(IceResponse::ERROR,"Duplicated Entry");
			}
			return new IceResponse(IceResponse::SUCCESS,"");

		}
	}
}
	
	
if (!class_exists('HoliDay')) {
	class HoliDay extends ICEHRM_Record {
		var $_table = 'HoliDays';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array();
		}

		public function validateSave($obj){
			$name = $obj->name;
			$location = $obj->location;
			$holiDaysDuplicatied = new HoliDay();
			$holiDaysDuplicatied = $holiDaysDuplicatied->Find("name=? AND location=?",array($name,$location));
			if($holiDaysDuplicatied[0]->id){
				return new IceResponse(IceResponse::ERROR,"Duplicated Entry");
			}
			return new IceResponse(IceResponse::SUCCESS,"");

		}
	}
}
	
if (!class_exists('LeaveRule')) {
	class LeaveRule extends ICEHRM_Record {
		var $_table = 'LeaveRules';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array();
		}
		public function validateSave($obj){
			$name = $obj->leave_name;
			$location = $obj->location;
			$leaveRuleDuplicatied = new LeaveRule();
			$leaveRuleDuplicatied = $leaveRuleDuplicatied->Find("leave_name=? AND location=?",array($name,$location));
			if($leaveRuleDuplicatied[0]->id){
				return new IceResponse(IceResponse::ERROR,"Duplicated Entry");
			}
			return new IceResponse(IceResponse::SUCCESS,"");

		}
	}
}

if (!class_exists('LeaveStartingBalance')) {
	class LeaveStartingBalance extends ICEHRM_Record {
		var $_table = 'LeaveStartingBalance';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array();
		}
	}
}


if (!class_exists('LeaveGroup')) {
	class LeaveGroup extends ICEHRM_Record {
		var $_table = 'LeaveGroups';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array();
		}
	}
}


if (!class_exists('LeaveGroupEmployee')) {
	class LeaveGroupEmployee extends ICEHRM_Record {
		var $_table = 'LeaveGroupEmployees';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array();
		}
	}
}