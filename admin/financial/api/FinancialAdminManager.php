<?php
/**
 * Class TaxesAdminManager
 *
 */

if (!class_exists('FinancialAdminManager')) {
	class FinancialAdminManager extends AbstractModuleManager{
		public function initializeUserClasses(){
		}
		public function initializeFieldMappings(){
		}
		public function initializeDatabaseErrorMappings(){
		}
		public function setupModuleClassDefinitions(){
            $this->addModelClass('Taxes');
            $this->addModelClass('TaxesSegments');
		}
	}
}
if (!class_exists('Taxes')) {
	class Taxes extends ICEHRM_Record
	{
		public function getAdminAccess()
		{
			return array("get", "element", "save", "delete");
		}

		public function getUserAccess()
		{
			return array();
		}
		var $_table = 'Taxes';
	}

}
if (!class_exists('TaxesSegments')) {
	class TaxesSegments extends ICEHRM_Record
	{
        var $_table = 'TaxesSegments';

        public function getAdminAccess(){
            return array("get","element","save","delete");
        }


        public function getUserAccess(){
            return array();
        }
	}
}
