<?php
class JobsActionManager extends SubActionManager{
    public function getGradeDetails($id){
        $gradeBasicInfo = new PayGrades();
        $gradeBasicInfo = $gradeBasicInfo->Find('id = ?',array($id));
        $gradeJobTitles = new JobTitles();
        $gradeJobTitles = $gradeJobTitles->Find('grade = ?',array($id));
        $gradeBenefits = new GradeBenefits();
        $gradeBenefits = $gradeBenefits->Find('grade = ?',array($id));
        $basicinfoSection = '
        <script>
        var gradesession= '. $id .';
        </script>
        <div class ="container">
        <h3>Grade Name : '.$gradeBasicInfo[0]->name.'</h3>
        <button class="btn btn-primary" type="button"> Min : <span class="badge">'.$gradeBasicInfo[0]->min.' </span><br>
        <button class="btn btn-primary" type="button"> <a href="#" style="color:white">  Q1 : </a><span class="badge">'.$gradeBasicInfo[0]->Q1.'</span><br>
        <button class="btn btn-primary" type="button"> <a href="#" style="color:white">  Q2 : </a><span class="badge">'.$gradeBasicInfo[0]->Q2.'</span><br>
        <button class="btn btn-primary" type="button"> <a href="#" style="color:white">  Q3 : </a><span class="badge">'.$gradeBasicInfo[0]->Q3.'</span><br>
        <button class="btn btn-primary" type="button"> <a href="#" style="color:white">  Mid : </a><span class="badge">'.$gradeBasicInfo[0]->mid.'</span><br>
        <button class="btn btn-primary" type="button"> <a href="#" style="color:white">   Q4 : </a><span class="badge">'.$gradeBasicInfo[0]->Q4.'</span><br>
        <button class="btn btn-primary" type="button"> <a href="#" style="color:white">   Q5 : </a><span class="badge">'.$gradeBasicInfo[0]->Q5.'</span><br>
        <button class="btn btn-primary" type="button"> <a href="#" style="color:white">  Q6 : </a><span class="badge">'.$gradeBasicInfo[0]->Q6.'</span><br>
        <button class="btn btn-primary" type="button"> <a href="#" style="color:white">  Max : </a><span class="badge">'.$gradeBasicInfo[0]->max.'</span><br>
        </div><hr>';
        echo $basicinfoSection;
        $jobtitleSection = '<div class="jobtitles container" style="margin-left: -11px; width: 1035px;">
        <div class ="container">
        <h3>Grade Job Details </h3><button class="btn btn-success" type="submit" onclick="modJsList[\'tabJobTitles\'].addNew()">Add new job title</button>
        <hr>
        <table class="table" style="width: 1035px;">
        <tbody>
        <tr>
        <th>Job Title</th>
        <th>Action</th>
        </tr>';
            foreach($gradeJobTitles as $gradeJobTitle)
            {
                $gradeJobTitle = (array)$gradeJobTitle;
                $gradeJobTitleName = new JobTitlesNames();
                $gradeJobTitleName = $gradeJobTitleName->Find('id = ?',array($gradeJobTitle['name']));
                $jobtitleSection.='<tr><th>'.$gradeJobTitleName[0]->name.'</th><th><div style="width:110px;"><img class="tableActionButton" src="'.BASE_URL.'images/edit.png" style="cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJsList[\'tabJobTitles\'].editNew('.$gradeJobTitle['id'].');return false;"></img><img class="tableActionButton" src="_BASE_images/edit.png" style="display:none;cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJsList[\'tabJobTitles\'].editNew('.$gradeJobTitle['id'].');return false;"></img></th></tr>';
            }
        $jobtitleSection  .='</tbody>
        </table>
        </div>';
        echo $jobtitleSection;
        $jobbenefitsSection = '<div class="jobbenefits container" style="margin-left: -11px; ">
        <div class ="container">
        <h3>Grade Benefits Details </h3><button class="btn btn-success" onclick="modJsList[\'tabGradeBenefits\'].addNew()">Add new benefit</button>
        <hr>
        <table class="table" style="width: 1035px;">
        <tbody>
        <tr>
        <th style="width: 594px;">Benefits Title</th>
        <th>Action</th>
        </tr>';
        foreach($gradeBenefits as $gradeBenefit)
        {
            $gradeBenefit = (array)$gradeBenefit;
            $jobbenefitsSection.='<tr><th>'.$gradeBenefit['item'].'</th><th><div style="width:110px;"><img class="tableActionButton" src="'.BASE_URL.'images/edit.png" style="cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJsList[\'tabGradeBenefits\'].editNew('.$gradeJobTitle['id'].');return false;"></img><img class="tableActionButton" src="_BASE_images/edit.png" style="display:none;cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJsList[\'tabGradeBenefits\'].editNew('.$gradeBenefit['id'].');return false;"></img></th></tr>';
        }
        $jobbenefitsSection  .='</tbody>
        </table>
        </div>';
        print_r($jobbenefitsSection);
        exit;

    }
    public function getGradeName($req){
        $payGrade = new PayGrades();
        $payGrade = $payGrade->Find('id = ?',array($req));
        print_r($payGrade[0]->name);
        exit;
    }
    public function getGeneralDuites(){
        $duites = new Duties();
        $duites = $duites->Find('type = ?',array(1));
        foreach($duites as $duty){
            $html.='<option value="'.$duty->id.'" data-toggle="tooltip" title="'.$duty->description.'">'.$duty->name.'</option>';
        }
        print_r($html);
        exit;
    }
    public function getTechnicalDuites(){
        $duites = new Duties();
        $duites = $duites->Find('type = ?',array(2));
        foreach($duites as $duty){
            $html.='<option value="'.$duty->id.'" data-toggle="tooltip" title="'.$duty->description.'">'.$duty->name.'</option>';
        }
        print_r($html);
        exit;
    }
    public function getStrategicDuites(){
        $duites = new Duties();
        $duites = $duites->Find('type = ?',array(3));
        foreach($duites as $duty){
            $html.='<option value="'.$duty->id.'" data-toggle="tooltip" title="'.$duty->description.'">'.$duty->name.'</option>';
        }
        print_r($html);
        exit;
    }
    public function getDutyDescription(){
        $dutyname = $_REQUEST['req'];
        $duites = new Duties();
        $duites = $duites->Find('name = ?',array($dutyname));
        print_r($duites[0]->description);
        exit;
    }
}