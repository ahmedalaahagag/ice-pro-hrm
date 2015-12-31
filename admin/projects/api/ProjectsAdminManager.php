<?php
if (!class_exists('ProjectsAdminManager')) {
	class ProjectsAdminManager extends AbstractModuleManager{

		public function initializeUserClasses(){
				
		}

		public function initializeFieldMappings(){
				
		}

		public function initializeDatabaseErrorMappings(){

		}

		public function setupModuleClassDefinitions(){
			
			$this->addModelClass('Client');
			$this->addModelClass('Project');
				
		}

	}
}


if (!class_exists('Client')) {
	class Client extends ICEHRM_Record {
		var $_table = 'Clients';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array();
		}
	}
}
	
if (!class_exists('Project')) {
	class Project extends ICEHRM_Record {
		var $_table = 'Projects';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array("get","element");
		}
	}
}

if (!class_exists('Clients')) {
	class Clients extends ICEHRM_Record {
		var $_table = 'Clients';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array("get","element");
		}
	}
}

if (!class_exists('Categorizations')) {
	class Categorizations extends ICEHRM_Record {
		var $_table = 'Categorizations';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array("get","element");
		}
	}
}


if (!class_exists('Governoraties')) {
	class Governoraties extends ICEHRM_Record {

		var $_table = 'Governoraties';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array("get","element");
		}
	}
}

if (!class_exists('Areas')) {

	class Areas extends ICEHRM_Record {
		var $_table = 'Areas';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array("get","element");
		}
	}
}

if (!class_exists('ThirdParties')) {
	class ThirdParties extends ICEHRM_Record {
		var $_table = 'ThirdParties';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array("get","element");
		}
	}
}
if (!class_exists('Scopes')) {
	class Scopes extends ICEHRM_Record {
		var $_table = 'Scopes';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array("get","element");
		}
	}
}
if (!class_exists('Categories')) {
	class Categories extends ICEHRM_Record {
		var $_table = 'Categorizations';
		public function getAdminAccess(){
			return array("get","element","save","delete");
		}

		public function getManagerAccess(){
			return array("get","element","save","delete");
		}

		public function getUserAccess(){
			return array("get","element");
		}
	}
}