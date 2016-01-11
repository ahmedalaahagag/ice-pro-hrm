<?php
class LoansEmailSender{
	
	var $emailSender = null;
	var $subActionManager = null;
	
	public function __construct($emailSender, $subActionManager){
		$this->emailSender = $emailSender;	
		$this->subActionManager = $subActionManager;	
	}
	
	private function getEmployeeSupervisor($employee){
		if(empty($employee->supervisor)){
			LogManager::getInstance()->info("Employee supervisor is empty");
			return null;
		}
		
		$sup = new Employee();
		$sup->Load("id = ?",array($employee->supervisor));
		if($sup->id != $employee->supervisor){
			LogManager::getInstance()->info("Employee supervisor not found");
			return null;
		}
		return $sup;
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
	
	public function sendLoanApplicationEmail($employee, $cancellation = false){

		$sup = $this->getEmployeeSupervisor($employee);
		if(empty($sup)){
			return false;
		}
		
		$params = array();
		$params['supervisor'] = $sup->first_name." ".$sup->last_name; 
		$params['name'] = $employee->first_name." ".$employee->last_name; 
		$params['url'] = CLIENT_BASE_URL; 
		
		if($cancellation){
			$email = $this->subActionManager->getEmailTemplate('loanCancelled.html');
		}else{
			$email = $this->subActionManager->getEmailTemplate('loanApplied.html');
		}
		
		
		$user = $this->subActionManager->getUserFromProfileId($sup->id);

		$emailTo = null;
		if(!empty($user)){
			$emailTo = $user->email;
		}

		if(!empty($emailTo)){
			if(!empty($this->emailSender)){
				
				$ccList = array();
				$ccListStr = SettingsManager::getInstance()->getSetting("Leave: CC Emails");
				if(!empty($ccListStr)){
					$arr = explode(",", $ccListStr);
					$count = count($arr)<=4?count($arr):4;
					for($i=0;$i<$count;$i++){
						if(filter_var( $arr[$i], FILTER_VALIDATE_EMAIL)) {
							$ccList[] = $arr[$i];
						}
						
					}
				}
				
				$bccList = array();
				$bccListStr = SettingsManager::getInstance()->getSetting("Leave: BCC Emails");
				if(!empty($bccListStr)){
					$arr = explode(",", $bccListStr);
					$count = count($arr)<=4?count($arr):4;
					for($i=0;$i<$count;$i++){
						if(filter_var( $arr[$i], FILTER_VALIDATE_EMAIL)) {
							$bccList[] = $arr[$i];
						}
					}
				}
				if($cancellation){
					$this->emailSender->sendEmail("Loan Cancellation Request Received",$emailTo,$email,$params,$ccList,$bccList);
				}else{
					$this->emailSender->sendEmail("Loan Application Received",$emailTo,$email,$params,$ccList,$bccList);
				}
				
			}
		}else{
			LogManager::getInstance()->info("[sendLoanApplicationEmail] email is empty");
		}
		
	}
	
	public function sendLoanApplicationSubmittedEmail($employee){
		
		$params = array();
		$params['name'] = $employee->first_name." ".$employee->last_name; 
		
		$email = $this->subActionManager->getEmailTemplate('loanSubmittedForReview.html');
		
		$user = $this->subActionManager->getUserFromProfileId($employee->id);
		
		$emailTo = null;
		if(!empty($user)){
			$emailTo = $user->email;
		}
		if(!empty($emailTo)){
			if(!empty($this->emailSender)){
				$this->emailSender->sendEmail("Loan Application Submitted",$emailTo,$email,$params);
			}
		}else{
			LogManager::getInstance()->info("[sendLoanApplicationSubmittedEmail] email is empty");
		}
	}
	
	public function sendLoanStatusChangedEmail($employee, $leave){
		
		$emp = $this->getEmployeeById($leave->employee);
		
		$params = array(); 
		$params['name'] = $emp->first_name." ".$emp->last_name; 
		$params['startdate'] = $leave->date_start; 
		$params['enddate'] = $leave->date_end; 
		$params['status'] = $leave->status; 
		
		$email = $this->subActionManager->getEmailTemplate('loanStatusChanged.html');
		
		$user = $this->subActionManager->getUserFromProfileId($emp->id);
		
		$emailTo = null;
		if(!empty($user)){
			$emailTo = $user->email;
		}
		
		if(!empty($emailTo)){
			if(!empty($this->emailSender)){
				$this->emailSender->sendEmail("Loan Application ".$leave->status,$emailTo,$email,$params);
			}
		}else{
			LogManager::getInstance()->info("[sendLoanStatusChangedEmail] email is empty");
		}
	}
}