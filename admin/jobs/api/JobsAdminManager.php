<?php
if (!class_exists('JobsAdminManager')) {
	class JobsAdminManager extends AbstractModuleManager{
		
		public function initializeUserClasses(){
			
		}
		
		public function initializeFieldMappings(){
			
		}
		
		public function initializeDatabaseErrorMappings(){

		}
		
		public function setupModuleClassDefinitions(){
			$this->addModelClass('JobTitles');
			$this->addModelClass('PayGrades');
			$this->addModelClass('CompanyStructures');
			$this->addModelClass('Employees');
			$this->addModelClass('GradeBenefits');
			$this->addModelClass('Duties');
			$this->addModelClass('Educations');
			$this->addModelClass('Languages');
		}
		
	}
}


if (!class_exists('JobTitles')) {
	class JobTitles extends ICEHRM_Record {
		var $_table = 'JobTitles';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}
	}
}

if (!class_exists('PayGrades')) {
	class PayGrades extends ICEHRM_Record {
		var $_table = 'PayGrades';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}
	}
}

if (!class_exists('PaySubGrade')) {
	class PaySubGrade extends ICEHRM_Record {
		var $_table = 'PaySubGrades';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}
	}
}


if (!class_exists('CompanyStructures')) {
	class CompanyStructures extends ICEHRM_Record {
		var $_table = 'CompanyStructures';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}
	}
}

if (!class_exists('Employees')) {
	class Employees extends ICEHRM_Record {
		var $_table = 'Employees';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}
	}
}

if (!class_exists('GradeBenefits')) {
	class GradeBenefits extends ICEHRM_Record {
		var $_table = 'GradeBenefits';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}
	}
}

if (!class_exists('JobDuties')) {
	class JobDuties extends ICEHRM_Record {
		var $_table = 'Duties';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}

	}
}

if (!class_exists('Educations')) {
	class Educations extends ICEHRM_Record {
		var $_table = 'Educations';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}
	}
}

if (!class_exists('Languages')) {
	class Languages extends ICEHRM_Record {
		var $_table = 'Languages';

		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save");
		}

		public function getUserAccess(){
			return array();
		}
	}
}