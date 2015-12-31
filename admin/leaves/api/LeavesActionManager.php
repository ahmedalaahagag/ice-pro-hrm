<?php
include (APP_BASE_PATH."modules/leaves/api/LeavesEmailSender.php");
class AdminLeavesEmailSender extends LeavesEmailSender{

}

class LeavesActionManager extends SubActionManager{
	
	const FULLDAY = 1;
	const HALFDAY = 0;
	const NOTWORKINGDAY = 2;
	
	
	public function getLeaveDaysReadonly($req){
		$leaveId = $req->leave_id;
		$leaveLogs = array();
	
		$employeeLeave = new EmployeeLeave();
		$employeeLeave->Load("id = ?",array($leaveId));
	
		$employee = $this->baseService->getElement('Employee',$employeeLeave->employee,null,true);
		//$rule = $this->getLeaveRule($employee, $employeeLeave->leave_type);
	
		$currentLeavePeriodResp = $this->getCurrentLeavePeriod($employeeLeave->date_start, $employeeLeave->date_end);
		if($currentLeavePeriodResp->getStatus() != IceResponse::SUCCESS){
			return new IceResponse(IceResponse::ERROR,$currentLeavePeriodResp->getData());
		}else{
			$currentLeavePeriod = $currentLeavePeriodResp->getData();
		}
	
		$leaveMatrix = $this->getAvailableLeaveMatrixForEmployeeLeaveType($employee, $currentLeavePeriod, $employeeLeave->leave_type);
	
		$leaves = array();
		$leaves['totalLeaves'] = floatval($leaveMatrix[0]);
		$leaves['pendingLeaves'] = floatval($leaveMatrix[1]);
		$leaves['approvedLeaves'] = floatval($leaveMatrix[2]);
		$leaves['rejectedLeaves'] = floatval($leaveMatrix[3]);
		$leaves['cancelRequestedLeaves'] = floatval($leaveMatrix[4]);
		$leaves['cancelledLeaves'] = floatval($leaveMatrix[5]);
		$leaves['availableLeaves'] = $leaves['totalLeaves'] - $leaves['pendingLeaves'] -  $leaves['approvedLeaves'] - $leaves['cancelRequestedLeaves'];
		$leaves['attachment'] = $employeeLeave->attachment;
	
		$employeeLeaveDay = new EmployeeLeaveDay();
		$days = $employeeLeaveDay->Find("employee_leave = ?",array($leaveId));
	
		$employeeLeaveLog = new EmployeeLeaveLog();
		$logsTemp = $employeeLeaveLog->Find("employee_leave = ? order by created",array($leaveId));
		foreach($logsTemp as $empLeaveLog){
			$t = array();
			$t['time'] = $empLeaveLog->created;
			$t['status_from'] = $empLeaveLog->status_from;
			$t['status_to'] = $empLeaveLog->status_to;
			$t['time'] = $empLeaveLog->created;
			$userName = null;
			if(!empty($empLeaveLog->user_id)){
				$lgUser = new User();
				$lgUser->Load("id = ?",array($empLeaveLog->user_id));
				if($lgUser->id == $empLeaveLog->user_id){
					if(!empty($lgUser->employee)){
						$lgEmployee = new Employee();
						$lgEmployee->Load("id = ?",array($lgUser->employee));
						$userName = $lgEmployee->first_name." ".$lgEmployee->last_name;
					}else{
						$userName = $lgUser->userName;
					}
						
				}
			}
				
			if(!empty($userName)){
				$t['note'] = $empLeaveLog->data." (by: ".$userName.")";
			}else{
				$t['note'] = $empLeaveLog->data;
			}
				
			$leaveLogs[] = $t;
		}
	
		return new IceResponse(IceResponse::SUCCESS,array($days,$leaves,$leaveId,$employeeLeave,$leaveLogs));
	}

	private function getAvailableLeaveMatrixForEmployee($employee,$currentLeavePeriod){


		//Iterate all leave types and create leave matrix
		/**
		 * [[Leave Type],[Total Available],[Pending],[Approved],[Rejected]]
		 */
		
		$leaveGroupId = $this->getEmployeeLeaveGroup($employee->id);
		
		$leaveType = new LeaveType();
		if(empty($leaveGroupId)){
			$leaveTypes = $leaveType->Find("leave_group IS NULL",array());
		}else{
			$leaveTypes = $leaveType->Find("leave_group IS NULL or leave_group = ?",array($leaveGroupId));
		}
		

		foreach($leaveTypes as $leaveType){
			$employeeLeaveQuota = new stdClass();
				
			$rule = $this->getLeaveRule($employee, $leaveType->id, $currentLeavePeriod);
			$employeeLeaveQuota->avalilable = floatval($rule->default_per_year);
			$pending = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $currentLeavePeriod->id, $leaveType->id, 'Pending'));
			$approved = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $currentLeavePeriod->id, $leaveType->id, 'Approved'));
			$rejected = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $currentLeavePeriod->id, $leaveType->id, 'Rejected'));
				
				
			$leaveCounts[$leaveType->name] = array($avalilable,$pending,$approved,$rejected);
		}

		return $leaveCounts;

	}

	private function getAvailableLeaveMatrixForEmployeeLeaveType($employee,$currentLeavePeriod,$leaveTypeId){

		/**
		 * [Total Available],[Pending],[Approved],[Rejected],[Cancellation Requested],[Cancelled]
		 */

		$rule = $this->getLeaveRule($employee, $leaveTypeId, $currentLeavePeriod);
		$avalilableLeaves = $this->getAvailableLeaveCount($employee, $rule, $currentLeavePeriod, $leaveTypeId);
		$avalilable = $avalilableLeaves[0];
		$pending = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $currentLeavePeriod->id, $leaveTypeId, 'Pending'));
		$approved = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $currentLeavePeriod->id, $leaveTypeId, 'Approved'));
		$rejected = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $currentLeavePeriod->id, $leaveTypeId, 'Rejected'));
		$cancelRequested = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $currentLeavePeriod->id, $leaveTypeId, 'Cancellation Requested'));
		$cancelled = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $currentLeavePeriod->id, $leaveTypeId, 'Cancelled'));

		return array($avalilable,$pending,$approved,$rejected,$cancelRequested,$cancelled);


	}
	
	/*
	 * Find available leave counts considering Leaves Accrued and Carried Forward
	*/
	private function getAvailableLeaveCount($employee, $rule, $currentLeavePeriod, $leaveTypeId){
	
		LogManager::getInstance()->info("getAvailableLeaveCount:".print_r(array($employee, $rule, $currentLeavePeriod, $leaveTypeId),true));
	
		$availableLeaveArray = array();
	
		$currentLeaves = floatval($rule->default_per_year);
	
		LogManager::getInstance()->info("Leaves before propotionate on joined date :".$currentLeaves);
	
		if($rule->propotionate_on_joined_date == "Yes"){
			//If the employee joined in current leave period, his leaves should be calculated proportional to joined date
			if($employee->joined_date != "0000-00-00 00:00:00" && !empty($employee->joined_date)){
				if(strtotime($currentLeavePeriod->date_start) < strtotime($employee->joined_date)){
					$currentLeaves = floatval($currentLeaves * (strtotime($currentLeavePeriod->date_end) - strtotime($employee->joined_date))/(strtotime($currentLeavePeriod->date_end) - strtotime($currentLeavePeriod->date_start)));
				}
			}
	
		}
	
		$availableLeaveArray["total"] = round($currentLeaves,3);
	
		LogManager::getInstance()->info("Leaves after propotionate on joined date :".$currentLeaves);
	
		if($rule->leave_accrue == "Yes"){
			$dateTodayTime = strtotime(date("Y-m-d"));
			//Take employee joined date into account
			$startTime = strtotime($currentLeavePeriod->date_start);
			$endTime = strtotime($currentLeavePeriod->date_end);
			$datediffFromStart = $dateTodayTime - $startTime;
			$datediffPeriod = $endTime - $startTime;
				
			$currentLeaves = floatval(($currentLeaves * $datediffFromStart)/$datediffPeriod);
		}
	
		LogManager::getInstance()->info("Leaves after accrue :".$currentLeaves);
	
		$availableLeaveArray["accrued"] = round($currentLeaves,3);
	
		$availableLeaveArray["carriedForward"] = 0;
	
		//Leaves should be carried forward only if employee joined before current leave period
	
		if($rule->carried_forward == "Yes" &&
		strtotime($currentLeavePeriod->date_start) > strtotime($employee->joined_date)){
			//findPreviosLeavePeriod
			$dayInPreviousLeavePeriod = date('Y-m-d', strtotime($currentLeavePeriod->date_start.' -1 day'));
			$resp = $this->getCurrentLeavePeriod($dayInPreviousLeavePeriod,$dayInPreviousLeavePeriod);
			if($resp->getStatus() == "SUCCESS"){
				$prvLeavePeriod = $resp->getData();
				$avalilable = $rule->default_per_year;
	
				LogManager::getInstance()->info("Leaves in previous leave period :".$avalilable);
	
				if($rule->propotionate_on_joined_date == "Yes"){
					//If the employee joined in this leave period, his leaves should be calculated proportionally
					if($employee->joined_date != "0000-00-00 00:00:00" && !empty($employee->joined_date)){
						if(strtotime($prvLeavePeriod->date_start) < strtotime($employee->joined_date)){
							$avalilable = floatval($avalilable * (strtotime($prvLeavePeriod->date_end) - strtotime($employee->joined_date))/(strtotime($prvLeavePeriod->date_end) - strtotime($prvLeavePeriod->date_start)));
						}
					}
				}
	
				LogManager::getInstance()->info("Leaves in previous leave period (after joined date):".$avalilable);
	
				if($rule->carried_forward_percentage.'' == "100"){
					//do nothing
				}else if($rule->carried_forward_percentage.'' == '0' || empty($rule->carried_forward_percentage)){
					$avalilable = 0;
				}else{
					$avalilable = floatval($avalilable * floatval($rule->carried_forward_percentage) / 100);
				}
	
				LogManager::getInstance()->info("Leaves in previous leave period (after carried forward percentage calculation):".$avalilable);
	
				if(!empty($rule->carried_forward_leave_availability)){
					$dateDiff = (strtotime("now") - strtotime($currentLeavePeriod->date_start))/(60 * 60 * 24);
					if($dateDiff > $rule->carried_forward_leave_availability){
						$avalilable = 0;
					}
				}
	
				LogManager::getInstance()->info("Leaves in previous leave period (after carried_forward_leave_availability calculation):".$avalilable);
	
				$approved = $this->countLeaveAmounts($this->getEmployeeLeaves($employee->id, $prvLeavePeriod->id, $leaveTypeId, 'Approved'));
	
				LogManager::getInstance()->info("Number of approved leaves:".$approved);
	
				$leavesCarriedForward =  floatval($avalilable) - floatval($approved);
				if($leavesCarriedForward < 0){
					$leavesCarriedForward = 0;
				}
	
				LogManager::getInstance()->info("Number of approved leaves:".$leavesCarriedForward);
	
				$availableLeaveArray["carriedForward"] = round($leavesCarriedForward,3);
				$currentLeaves = floatval($currentLeaves) + floatval($leavesCarriedForward);
				$currentLeaves = round($currentLeaves,3);
			}
		}
		LogManager::getInstance()->info("Return:".print_r(array($currentLeaves, $availableLeaveArray),true));
		return array($currentLeaves, $availableLeaveArray);
	}

	private function countLeaveAmounts($leaves){
		$amount = 0;
		foreach($leaves as $leave){
			$empLeaveDay = new EmployeeLeaveDay();
			$leaveDays = $empLeaveDay->Find("employee_leave = ?",array($leave->id));
			foreach($leaveDays as $leaveDay){
				if($leaveDay->leave_type == 'Full Day'){
					$amount += 1;
				}else if($leaveDay->leave_type == 'Half Day - Morning'){
					$amount += 0.5;
				}else if($leaveDay->leave_type == 'Half Day - Afternoon'){
					$amount += 0.5;
				}else if($leaveDay->leave_type == '1 Hour - Morning'){
					$amount += 0.125;
				}else if($leaveDay->leave_type == '2 Hours - Morning'){
					$amount += 0.25;
				}else if($leaveDay->leave_type == '3 Hours - Morning'){
					$amount += 0.375;
				}else if($leaveDay->leave_type == '1 Hour - Afternoon'){
					$amount += 0.125;
				}else if($leaveDay->leave_type == '2 Hours - Afternoon'){
					$amount += 0.25;
				}else if($leaveDay->leave_type == '3 Hours - Afternoon'){
					$amount += 0.375;
				}
			}
		}
		return round(floatval($amount),3);
	}

	private function getEmployeeLeaves($employeeId,$leavePeriod,$leaveType,$status){
		$employeeLeave = new EmployeeLeave();
		$employeeLeaves = $employeeLeave->Find("employee = ? and leave_period = ? and leave_type = ? and status = ?",
		array($employeeId,$leavePeriod,$leaveType,$status));
		if(!$employeeLeaves){
			LogManager::getInstance()->info($employeeLeave->ErrorMsg(),true);
		}
		
		return $employeeLeaves;
			
	}
	
	private function getCurrentLeavePeriod($startDate,$endDate){
	
		$leavePeriod = new LeavePeriod();
		$leavePeriod->Load("date_start <= ? and date_end >= ?",array($startDate,$endDate));
		if(empty($leavePeriod->id)){
			return new IceResponse(IceResponse::ERROR,"Error in leave period" );
		}else{
			return new IceResponse(IceResponse::SUCCESS,$leavePeriod);
		}
	}

	private function getEmployeeLeaveGroup($employeeId){
		$empLeaveGroup = new LeaveGroupEmployee();	
		$empLeaveGroup->Load("employee = ?",array($employeeId));
		if($empLeaveGroup->employee == $employeeId && !empty($empLeaveGroup->id)){
			return $empLeaveGroup->leave_group;	
		}
		return null;
	}

    private function getLeaveRule($employee,$leaveType, $leavePeriod){
        $additionalLB = $this->getAdditionalLeaveBalance($employee->id, $leaveType, $leavePeriod->id);
        $rule = $this->getLeaveRuleOnly($employee,$leaveType);

        $rule->default_per_year = floatval($rule->default_per_year);
        $rule->default_per_year += floatval($additionalLB);

        return $rule;

    }

	private function getLeaveRuleOnly($employee,$leaveType){

		$rule = null;
		$leaveRule = new LeaveRule();
		$leaveTypeObj = new LeaveType();
		$rules = $leaveRule->Find("employee = ? and leave_type = ?",array($employee->id,$leaveType));
		if(count($rules)>0){
			return $rules[0];
		}
		
		//Check whether this employee has a leave group
		$leaveGroupId = $this->getEmployeeLeaveGroup($employee->id);
		if(!empty($leaveGroupId)){
			$rules = $leaveRule->Find("leave_group = ? and leave_type = ?",array($leaveGroupId,$leaveType));
			if(count($rules)>0){
				return $rules[0];
			}
			
			$rules = $leaveRule->Find("leave_group = ? and job_title = ? and employment_status = ? and leave_type = ? and employee is null",array($leaveGroupId, $employee->job_title,$employee->employment_status,$leaveType));
			if(count($rules)>0){
				return $rules[0];
			}
			
			$rules = $leaveRule->Find("leave_group = ? and job_title = ? and employment_status is null and leave_type = ? and employee is null",array($leaveGroupId, $employee->job_title,$leaveType));
			if(count($rules)>0){
				return $rules[0];
			}
			
			$rules = $leaveRule->Find("leave_group = ? and job_title is null and employment_status = ? and leave_type = ? and employee is null",array($leaveGroupId, $employee->employment_status,$leaveType));
			if(count($rules)>0){
				return $rules[0];
			} 
			
			$rules = $leaveTypeObj->Find("leave_group = ? and id = ?",array($leaveGroupId, $leaveType));
			if(count($rules)>0){
				return $rules[0];
			}
			
			
		}
		
		$rules = $leaveRule->Find("job_title = ? and employment_status = ? and leave_type = ? and employee is null",array($employee->job_title,$employee->employment_status,$leaveType));
		if(count($rules)>0){
			return $rules[0];
		}
			
		$rules = $leaveRule->Find("job_title = ? and employment_status is null and leave_type = ? and employee is null",array($employee->job_title,$leaveType));
		if(count($rules)>0){
			return $rules[0];
		}
			
		$rules = $leaveRule->Find("job_title is null and employment_status = ? and leave_type = ? and employee is null",array($employee->employment_status,$leaveType));
		if(count($rules)>0){
			return $rules[0];
		}
			
		$rules = $leaveTypeObj->Find("id = ?",array($leaveType));
		if(count($rules)>0){
			return $rules[0];
		}

	}

    public function getAdditionalLeaveBalance($employeeId, $leaveType, $leavePeriodId){
        //Get additional leaves for this leave type and period
        $statingLeaveBalance = new LeaveStartingBalance();
        $list = $statingLeaveBalance->Find("employee = ? and leave_type = ? and leave_period",
            array($employeeId, $leaveType, $leavePeriodId));

        $total = 0;
        foreach($list as $obj){
            $total += floatval($obj->amount);
        }

        return $total;
    }

	public function getSubEmployeeLeaves($req){

		$mappingStr = $req->sm;
		$map = json_decode($mappingStr);
		$employeeLeave = new EmployeeLeave();
		$list = $employeeLeave->Find("1=1");	
		if(!$list){
			LogManager::getInstance()->info($employeeLeave->ErrorMsg());	
		}
		if(!empty($mappingStr)){
			$list = $this->baseService->populateMapping($list,$map);	
		}
		
		return new IceResponse(IceResponse::SUCCESS,$list);
	}
	
	public function changeLeaveStatus($req){
		
		//$employee = $this->baseService->getElement('Employee',$this->getCurrentProfileId());
		
		
		$employeeLeave = new EmployeeLeave();
		$employeeLeave->Load("id = ?",array($req->id));
		if($employeeLeave->id != $req->id){
			return new IceResponse(IceResponse::ERROR,"Leave not found");
		}
		
		if($this->user->user_level != 'Admin'){
			return new IceResponse(IceResponse::ERROR,"Only an admin can do this");	
		}
		
		$oldLeaveStatus = $employeeLeave->status;
		$employeeLeave->status = $req->status;
		$ok = $employeeLeave->Save();
		if(!$ok){
			LogManager::getInstance()->info($employeeLeave->ErrorMsg());
			return new IceResponse(IceResponse::ERROR,"Error occured while saving leave infomation. Please contact admin");
		}
		
		$employeeLeaveLog = new EmployeeLeaveLog();
		$employeeLeaveLog->employee_leave = $employeeLeave->id;
		$employeeLeaveLog->user_id = $this->baseService->getCurrentUser()->id;
		$employeeLeaveLog->status_from = $oldLeaveStatus;
		$employeeLeaveLog->status_to = $employeeLeave->status;
		$employeeLeaveLog->created = date("Y-m-d H:i:s");
		$employeeLeaveLog->data = isset($req->reason)?$req->reason:"";
		$ok = $employeeLeaveLog->Save();
		if(!$ok){
			LogManager::getInstance()->info($employeeLeaveLog->ErrorMsg());
		}
		
		$employee = $this->getEmployeeById($employeeLeave->employee);
		
		if($oldLeaveStatus != $employeeLeave->status){
			$this->sendLeaveStatusChangedEmail($employee, $employeeLeave);
		}
		
		$this->baseService->audit(IceConstants::AUDIT_ACTION, "Leave status changed \ from:".$oldLeaveStatus."\ to:".$employeeLeave->status." \ id:".$employeeLeave->id);
		
		$currentEmpId = $this->getCurrentProfileId();
		
		if(!empty($currentEmpId)){
			$employee = $this->baseService->getElement('Employee',$currentEmpId);
			
			if($employeeLeave->status != "Pending"){
				$notificationMsg = "Your leave has been $employeeLeave->status by ".$employee->first_name." ".$employee->last_name;
				if(!empty($req->reason)){
					$notificationMsg.=" (Note:".$req->reason.")";
				}
			}
			
			$this->baseService->notificationManager->addNotification($employeeLeave->employee,$notificationMsg,'{"type":"url","url":"g=modules&n=leaves&m=module_Leaves#tabEmployeeLeaveApproved"}',IceConstants::NOTIFICATION_LEAVE);
			
		}
		
		
		return new IceResponse(IceResponse::SUCCESS,"");
	}
	
	public function sendLeaveStatusChangedEmail($employee, $leave){
	
		$emp = $this->getEmployeeById($leave->employee);
	
		$params = array();
		$params['name'] = $emp->first_name." ".$emp->last_name;
		$params['startdate'] = $leave->date_start;
		$params['enddate'] = $leave->date_end;
		$params['status'] = $leave->status;
	
		$user = $this->getUserFromProfileId($employee->id);
		
		if(!empty($user)){
			$email = file_get_contents(APP_BASE_PATH."modules/leaves/emailTemplates/leaveStatusChanged.html");
			if(!empty($this->emailSender)){
				$this->emailSender->sendEmail("Leave Application ".$leave->status,$user->email,$email,$params);
			}	
		}
		
	}
	
	private function getEmployeeById($id){
		$sup = new Employee();
		$sup->Load("id = ?",array($id));
		if($sup->id != $id){
			LogManager::getInstance()->info("Employee not found");
			return null;
		}
	
		return $sup;
	}
	

}