<?php

class ProjectsActionManager extends SubActionManager
{
    public function getSubServiceCategory($req)
    {

        if ($_REQUEST['req'] == 'Commercial') {
            $html = '<option value="Apartments">Apartments</option><option value="Banking">Banking</option><option value="Duplexes">Duplexes</option><option value="Hospitality">Hospitality</option><option value="Industrial">Industrial-Urban Planning</option>';
        }
        if ($_REQUEST['req'] == 'Residential') {
            $html = '<option value="Offices">Offices</option><option value="Palaces">Palaces</option><option value="Retail">Retail-F&amp;B </option><option value="Retail">Retail-F&amp;B </option><option value="Villas">Villas</option>';
        }
        print_r($html);
        exit;
    }
    public function getSubCategory($req)
    {

        if ($_REQUEST['req'] == 'CivilWorks') {
            $html = '<option value="CivilWorks">CivilWorks</option>';
        }
        if ($_REQUEST['req'] == 'Fitout') {
            $html = '<option value="CompleteFitout">Complete Fitout</option><option value="Arch">Arch</option><option value="MEP">MEP</option>';
        }
        if ($_REQUEST['req'] == 'Design') {
            $html = '<option value="Arch">Arch</option><option value="MEP">MEP</option>';
        }
        print_r($html);
        exit;
    }
    public function getDepartmentEmployess()
    {
        $employees = new Employees();
        $departments = $_REQUEST['req'];
        $departmentID = explode('_',$departments)[0];
        $department = explode('_',$departments)[1];
        $employees = $employees->Find('department = ?', array($departmentID));
        $html .= '<div class="row" id="field_supervisors' . $department . '">
	            <label class="control-label col-sm-3" for="_id_">Supervisors</label>
	            <div class="controls col-sm-6">
		        <select type="select-multi" multiple="multiple" class="form-control select2Multi" id="Supervisors' . $department . '" name="supervisors' . $department . '" valadtion="required">
            ';
        foreach ($employees as $employee) {
            $html .= '<option value="' . $employee->id . '">' . $employee->first_name . ' ' . $employee->last_name . '</option>';
        }
        $html .= '	</select>
	                </div>
                        <div class="controls col-sm-3">
                            <span class="help-inline control-label" id="help__id_"></span>
                        </div>
                    </div>';
        $html .= '<div class="row" id="field_members' . $department . '">
	            <label class="control-label col-sm-3" for="_id_">Members</label>
	            <div class="controls col-sm-6">
		        <select type="select-multi" multiple="multiple" class="form-control select2Multi" id="Members' . $department . '" name="supervisors' . $department . '" valadtion="required">
            ';
        foreach ($employees as $employee) {
            $html .= '<option value="' . $employee->id . '">' . $employee->first_name . ' ' . $employee->last_name . '</option>';
        }
        $html .= '	</select>
	                </div>
                        <div class="controls col-sm-3">
                            <span class="help-inline control-label" id="help__id_"></span>
                        </div>
                    </div>
                    ';

        print_r($html);exit;
    }
    public function getDepartments(){
        $departmentnumber  = $_REQUEST['req'];
        $departments = new CompanyStructure();
        $departments= $departments->Find('');
        $html.='<div id="field_department'.$departmentnumber.'" class="row">';
        $html.='<label class="control-label col-sm-3" for="department'.$departmentnumber.'">Department<font class="redFont">*</font></label>';
        $html.='<div class="controls col-sm-6">';
        $html.='<select name="department'.$departmentnumber.'" id="department'.$departmentnumber.'" type="select-one" class="form-control select2Field">';
        $html.='<option value="">Please select an option</option>';
        foreach($departments as $department){
            $html.='<option value="'.$department->id.'">'.$department->title.'</option>';
        }
        $html.='</select>
                    </div>
                        <div class="controls col-sm-3">
                            <span class="help-inline control-label" id="help_department'.$departmentnumber.'"></span>
                        </div>
                    </div>
                    </div>
                       ';
        print_r($html);exit;
    }
    public function addProject($req)
    {
        $req = (array)$req;
        foreach($req as $key => $value){
            if(strpos($key,'department') !== false) {
                $projectTeams['department_id'][] = $value;
                unset($req[$key]);
            }
            if(strpos($key,'Supervisors') !== false){
                $projectTeams['supervisors'][] = $value;
                unset($req[$key]);
            }
            if(strpos($key,'Members') !== false){
                $projectTeams['members'][] = $value;
                unset($req[$key]);
            }
        }
        $req = (Object)$req;
        $req =$this->cast('Project',$req);
        $ok = $req->Save();
        if(!$ok){
            return new IceResponse(IceResponse::ERROR,$req->ErrorMsg());
        }
        else{
            $projectID = $req->_lastid;
            for($i=0;$i<count($projectTeams);$i++){
                $projectTeam =  new ProjectTeams();
                $projectTeam->project_id = $projectID;
                $projectTeam->members = $projectTeams['members'][$i];
                $projectTeam->supervisors = $projectTeams['supervisors'][$i];
                $projectTeam->department_id = $projectTeams['department_id'][$i];
                $ok = $projectTeam->Save();
            }
        }
        if($ok){
             return new IceResponse(IceResponse::SUCCESS);
        }
    }
    /**
     * Class casting
     *
     * @param string|object $destination
     * @param object $sourceObject
     * @return object
     */
    function cast($destination, $sourceObject)
    {
        if (is_string($destination)) {
            $destination = new $destination();
        }
        $sourceReflection = new ReflectionObject($sourceObject);
        $destinationReflection = new ReflectionObject($destination);
        $sourceProperties = $sourceReflection->getProperties();
        foreach ($sourceProperties as $sourceProperty) {
            $sourceProperty->setAccessible(true);
            $name = $sourceProperty->getName();
            $value = $sourceProperty->getValue($sourceObject);
            if ($destinationReflection->hasProperty($name)) {
                $propDest = $destinationReflection->getProperty($name);
                $propDest->setAccessible(true);
                $propDest->setValue($destination,$value);
            } else {
                $destination->$name = $value;
            }
        }
        return $destination;
    }
}