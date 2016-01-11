<?php

class EmployeesActionManager extends SubActionManager
{

    public function terminateEmployee($req)
    {
        $employee = new Employee();
        $employee->Load("id = ?", array($req->id));

        if (empty($employee->id)) {
            return new IceResponse(IceResponse::ERROR, "Employee Not Found");
        }

        $employee->termination_date = date('Y-m-d H:i:s');
        $employee->status = 'Terminated';

        $ok = $employee->Save();
        if (!$ok) {
            return new IceResponse(IceResponse::ERROR, "Error occured while terminating employee");
        }

        return new IceResponse(IceResponse::SUCCESS, $employee);

        //$user = BaseService::getInstance()->getUserFromProfileId($employee->id);
    }

    public function activateEmployee($req)
    {
        $employee = new Employee();
        $employee->Load("id = ?", array($req->id));

        if (empty($employee->id)) {
            return new IceResponse(IceResponse::ERROR, "Employee Not Found");
        }

        $employee->termination_date = NULL;
        $employee->status = 'Active';

        $ok = $employee->Save();
        if (!$ok) {
            return new IceResponse(IceResponse::ERROR, "Error occured while activating employee");
        }

        return new IceResponse(IceResponse::SUCCESS, $employee);

        //$user = BaseService::getInstance()->getUserFromProfileId($employee->id);
    }

    public function deleteEmployee($req)
    {
        $employee = new Employee();
        $employee->Load("id = ?", array($req->id));
        if (empty($req->id)) {
            return new IceResponse(IceResponse::ERROR, "Employee Not Found");
        }
        $ok = $employee->Delete();
        if (!$ok) {
            return new IceResponse(IceResponse::ERROR, "Error occured while deleting employee");
        }
        return new IceResponse(IceResponse::SUCCESS, "");
    }

    public function downloadArchivedEmployee($req)
    {


        if ($this->baseService->currentUser->user_level != 'Admin') {
            echo "Error: Permission denied";
            exit();
        }

        $employee = new ArchivedEmployee();
        $employee->Load("id = ?", array($req->id));

        if (empty($employee->id)) {
            return new IceResponse(IceResponse::ERROR, "Employee Not Found");
        }

        $employee->data = json_decode($employee->data);
        $employee = $this->baseService->cleanUpAdoDB($employee);

        $str = json_encode($employee, JSON_PRETTY_PRINT);

        $filename = uniqid();
        $file = fopen("/tmp/" . $filename, "w");
        fwrite($file, $str);
        fclose($file);

        $downloadFileName = "employee_" . $employee->id . "_" . str_replace(" ", "_", $employee->first_name) . "_" . str_replace(" ", "_", $employee->last_name) . ".txt";

        header("Pragma: public"); // required
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Description: File Transfer");
        header("Content-Type: image/jpg");
        header('Content-Disposition: attachment; filename="' . $downloadFileName . '"');
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: " . filesize("/tmp/" . $filename));
        readfile("/tmp/" . $filename);
        exit();

    }

    private function getEmployeeData($id, $obj)
    {
        $data = array();
        $objs = $obj->Find("employee = ?", array($id));
        foreach ($objs as $entry) {
            $data[] = BaseService::getInstance()->cleanUpAdoDB($entry);
        }
        return $data;
    }

    public function getSalary()
    {
        $employee = new Employee();
        $session = json_decode($_SESSION['userapp']);
        $id = $session->id;
        $employee = $employee->Find("id = ?", array($id));
        $salary['salary'] = $employee[0]->salary;
        $salary['userid'] = $session->id;
        print_r(json_encode($salary));
        exit;
    }

    private function getAllAviableDays($leaves)
    {
        $total = 0;
        foreach ($leaves as $leave) {
            $total += $leaves->default_per_year;
        }
        return $total;
    }

    private function getAllVacationDays($id)
    {
        $EmployeeLeaves = new EmployeeLeave();
        $EmployeeLeaves = $EmployeeLeaves->Find('employee=?', array($id));
        $total = 0;
        foreach ($EmployeeLeaves as $EmployeeLeave) {

            $total += $EmployeeLeave->leave_period;
        }
        return $total;
    }

    private function getTotalVacation($id, $salary)
    {
        $day = $salary / 22;
        $EmployeeLeaves = new EmployeeLeave();
        $EmployeeLeaves = $EmployeeLeaves->Find('employee=? AND status=?', array($id, 'Approved'));
        $total = 0;
        foreach ($EmployeeLeaves as $EmployeeLeave) {
            $leave = new LeaveType();
            $leave = $leave->Find('id = ?', array($EmployeeLeave->leave_type));
            if ($leave[0]->percentage > 0) {
                $cost = floor(($day * $leave[0]->percentage) / 100);
                $total += $cost;
            } else {
                $daysTakenFromThisType = new EmployeeLeave();
                $daysTakenFromThisType = count($daysTakenFromThisType->Find('leave_type=? AND employee=?', array($EmployeeLeave->leave_type, $id)));
                $leave = new LeaveType();
                $leave = $leave->Find('id = ?', array($EmployeeLeave->leave_type));
                $aviableDays = $leave[0]->default_per_year;
                if ($daysTakenFromThisType - $aviableDays > 0) {
                    $total += ($aviableDays - $daysTakenFromThisType) * $day;
                }
            }
        }
        return $total;
    }

    public function getSalaryCompnents($id)
    {
        $currentUserID = $this->getCurrentProfileId();
        $user = new User();
        $user = $user->Find('employee = ?', array($currentUserID));
        $readOnly = '';
        $readOnlyButton = '';
        if ($user[0]->username == 'HRManager') {
            $readOnly = 'readonly';
            $readOnlyButton = 'display:none;';
        }
        $employee = new Employee();
        $employee = $employee->Find("id = ?", array($id));
        $salary = $employee[0]->salary;
        $jobTitle = $employee[0]->job_title;
        $location = $employee[0]->work_location;
        $payGrade = new JobTitles();
        $payGrade = $payGrade->Find('id = ?', array($jobTitle));
        $payGrade = $payGrade[0]->grade;
        $jobTitleName = $payGrade[0]->name;
        $leaves = new LeaveType();
        $leaves = $leaves->Find('location = ?', array($location));
        $vacations = $this->getTotalVacation($id, $salary);
        if (!$vacations) {
            $vacations = 0;
        }
        $departments = new EmployeeDependents();
        $department = $departments->Find('id = ?', array($employee[0]->deparment));
        $department = $department[0]->name;
        $attendaceTotal = $this->getTotalLateCost($id, $salary);
        $loans = $this->getTotalLoans($id);
        $taxes = $this->getTotalTaxes($salary);
        //$advantages = $this->getTotalGradeAdvantages($payGrade);
        //$advantages =0;
        $allowances = $this->getTotalGradeAllowances($payGrade);
        //$allowances = 0;
        $exptionalLoans = $this->getTotalExptionalLoans($id);
        $loansTotal = $loans + $exptionalLoans;
        $totalPalenties = $loansTotal + $allowances + $taxes + $attendaceTotal + $vacations;
        $overTimeTotal = $this->getTotalOverTimeCost($id, $salary);
        $totalCompunctions = $overTimeTotal;
        $final = ($salary + $totalCompunctions) - $totalPalenties;
        //$loans = new EmployeeCompanyLoans();
        //$attendance = $attendance ->Find('`employee` = ? AND (`in_time` BETWEEN ? AND ?)',array($id,$firstday,$lastday));
        echo '<div  id="nonprint" >
            <div class = "row" style="margin-left: 5px">
            <div class="col-md-12 ">
            <h2>Basic Information</h2>
            <h4>Name : ' . $employee[0]->employee_id . '</h4>
            <h4>ID :   ' . $employee[0]->first_name . '</h4>
            <h4>Salary of ' . date('F') . date('Y') . '</h4>
            <span>Issued in ' . date("Y/m/d") . '</span>
            </div>
            </div>
            <hr>
            <div class="container col-md-12 BreakDown">
            <h3>Salary Breakdown</h3>
                <div class="col-md-4">
                     <h3>Deductions</h3>
                    <div class="form-group form-inline">
                      <input type="text" id="Lateniess" class="form-control palenties" ' . $readOnly . ' style="width:60px" value="' . $attendaceTotal . '">
                       <span class="">Lateniess</span>
                       <button class="btn btn-danger palenties Lateniess"style="margin-left: 60px;' . $readOnlyButton . '">Remove</button>
                       <script>
                        $(".Lateniess").on("click",function(){
                        $("#Lateniess").val(0);
                        recalculateSalary();
                        });
                        $("#Lateniess").on("change",function(){
                            recalculateSalary();
                        });
                        </script>
                     </div>
                    <div class="form-group form-inline">
                      <input type="text" id="Advantages" class="form-control Advantages" ' . $readOnly . ' style="width:60px" value="' . $allowances . '">
                       <span class="">Benefits</span>
                       <button class="btn btn-danger palenties Advantages"style="margin-left: 65px;' . $readOnlyButton . '">Remove</button>
                       <script>
                        $(".Advantages").on("click",function(){
                         $("#Advantages").val(0);
                            recalculateSalary();
                        });
                         $("#Advantages").on("change",function(){
                            recalculateSalary();
                        });
                        </script>
                     </div>
                      <div class="form-group form-inline">
                      <input type="text" id="Loans" class="form-control palenties " ' . $readOnly . ' style="width:60px" value="' . $loansTotal . '">
                       <span class="">Loans</span>
                       <button class="btn btn-danger palenties Loans"style="margin-left: 78px;' . $readOnlyButton . '">Remove</button>
                       <script>
                        $(".Loans").on("click",function(){
                        $("#Loans").val(0);
                            recalculateSalary();
                        });
                         $("#Loans").on("change",function(){
                            recalculateSalary();
                        });
                        </script>
                     </div>
                     <div class="form-group form-inline">
                      <input type="text" id="Insurance" class="form-control palenties" ' . $readOnly . ' style="width:60px" value="' . $taxes . '">
                       <span class="">Taxes And Insurance </span>
                       <button class="btn btn-danger palenties Insurance"  style="' . $readOnlyButton . '">Remove</button>
                       <script>
                        $(".Insurance").on("click",function(){
                        $("#Insurance").val(0);
                            recalculateSalary();
                        });
                        $("#Insurance").on("change",function(){
                            recalculateSalary();
                        });
                        </script>
                     </div>
                     <div class="form-group form-inline">
                      <input type="text" id="Vacations" class="form-control palenties" ' . $readOnly . ' style="width:60px" value="' . $vacations . '">
                       <span class="">Unplanned Vacations</span>
                       <button class="btn btn-danger palenties Vacations" style="' . $readOnlyButton . '">Remove</button>
                       <script>
                        $(".Vacations").on("click",function(){
                          $("#Vacations").val(0);
                            recalculateSalary();
                        });
                         $("#Vacations").on("change",function(){
                            recalculateSalary();
                            });
                        </script>
                     </div>
                     <div class="form-group form-inline">
                      <input type="text" id="Mobile" class="form-control palenties" ' . $readOnly . ' style="width:60px" value="0">
                       <span class="">Mobile Plan</span>
                       <button class="btn btn-danger palenties Mobile"  style="margin-left: 50px;' . $readOnlyButton . '">Remove</button>
                       <script>
                        $(".Mobile").on("click",function(){
                          $("#Mobile").val(0);
                            recalculateSalary();
                        });
                         $("#Mobile").on("change",function(){
                            recalculateSalary();
                            $("#MobilePlan").text($(this).val());
                            });
                        </script>
                     </div>
                     <div class="form-group form-inline">
                      <input type="text" id="Internet" class="form-control palenties" ' . $readOnly . ' style="width:60px" value="0">
                       <span class="">Internet Plan</span>
                       <button class="btn btn-danger palenties Internet"  style="margin-left: 42px;' . $readOnlyButton . '">Remove</button>
                       <script>
                        $(".Internet").on("click",function(){
                          $("#Internet").val(0);
                            recalculateSalary();

                        });
                         $("#Internet").on("change",function(){
                            recalculateSalary();
                            $("#InternetPlan").text($(this).val());
                            });
                        </script>
                     </div>
                  <div class="form-group form-inline">
                      <input type="text" id="Others" class="form-control" ' . $readOnly . ' style="width:60px" value="0">
                       <span class="Others">Others </span>
                        <script>
                        $("#Others").on("change",function(){
                         recalculateSalary();
                        });
                        </script>
                     </div>
                </div>
                <div class="col-md-4">
                     <h3>Compensations</h3>
                    <div class="form-group form-inline">
                      <input type="text" class="form-control compensations" ' . $readOnly . ' id="Overtime" style="width:50px" value="' . $overTimeTotal . '">
                       <span class="">Overtime </span>
                       <button class="btn btn-danger compensations OverTime"  style="margin-left: 11px;' . $readOnlyButton . '">Remove</button>
                        <script>
                        $(".OverTime").on("click",function(){
                        $("#Overtime").val(0);
                            recalculateSalary();
                        });
                         $("#Overtime").on("change",function(){
                            recalculateSalary();
                        });
                        </script>
                     </div>
                    <div class="form-group form-inline">
                      <input type="text" id="OthersPlus" class="form-control" ' . $readOnly . ' style="width:50px;" value="0">
                       <span class="OthersPlus">Others </span>
                        <script>
                        $("#OthersPlus").on("change",function(){
                          recalculateSalary();
                        });
                        </script>
                     </div>
                </div>
                </div>

            <hr>

             <button class="btn btn-success" onclick="printPaySlip();">Print Payslip</button>
             <div class="col-md-4">
              <h4>Total :<span id="SalaryFormula"><span class="basicsalary" id="basicsalary">' . $salary . '</span> + <span class="totalcompensations" id="totalcompensations"> ' . $totalCompunctions . ' </span> - <span class="totalpalenties" id="totalpalenties"> ' . $totalPalenties . ' </span> = <span id="totalsalary" class="totalsalary">' . $final . '</span></span></h4>
            </div>
            </div>
            <br>
             <script>
             function recalculateSalary()
             {
                var salary = parseInt($("#basicsalary").text() , 10);
                 console.log(salary);
                 if($("#Lateniess").length)
                    var lateniss = parseInt($("#Lateniess").val(), 10);
                else
                    var lateniss =0;
                 console.log(lateniss);
                 if($("#Advantages").length)
                    var advantages =  parseInt($("#Advantages").val(), 10);
                else
                    var advantages =0;
                 console.log(advantages);
                if($("#Loans").length)
                    var loans = parseInt($("#Loans").val(), 10);
                else
                    var loans =0;
                 console.log(loans);
                 if($("#Insurance").length)
                    var insurance = parseInt($("#Insurance").val(), 10);
                else
                    var insurance =0;
                 console.log(insurance);
                 if($("#Vacations").length)
                    var vacations = parseInt($("#Vacations").val(), 10);
                else
                    var vacations =0;
                 if($("#Mobile").length)
                    var mobile = parseInt($("#Mobile").val(), 10);
                else
                    var mobile =0;
                 if($("#Internet").length)
                    var internet = parseInt($("#Internet").val(), 10);
                else
                    var internet =0;

                 if($("#Others").length)
                    var others = parseInt($("#Others").val(), 10);
                else
                    var others =0;
                 console.log(others);
                 if($("#Overtime").length)
                    var overtime = parseInt($("#Overtime").val(), 10);
                else
                    var overtime =0;
                  console.log(overtime);
                 if($("#OthersPlus").length)
                    var othersplus = parseInt($("#OthersPlus").val(), 10);
                else
                    var othersplus =0;
                    console.log(othersplus);
                    if($("#Advantages").length)
                    var advantages = parseInt($("#Advantages").val(), 10);
                else
                    var advantages =0;
                    if($("#Allowances").length)
                    var allowances = parseInt($("#Allowances").val(), 10);
                else
                    var allowances =0;
                var totalcomp = overtime + allowances + othersplus;
                var totalpalen = lateniss + advantages + internet + mobile + loans + insurance + vacations + others;
                var final =(salary+totalcomp)-totalpalen;
                $("#totalsalary").text(final);
                $("#totalcompensations").text(totalcomp);
                $("#totalpalenties").text(totalpalen);
                }
                function printPaySlip(){

                  var loans = parseInt($("#Loans").val(), 10);
                  $("#LoansPay").text(loans);
                   var lateniess  = parseInt($("#Lateniess ").val(), 10);
                  $("#LatniessPay").text(lateniess);
                  var vacations = parseInt($("#Vacations").val(), 10);
                  $("#UnplannedVactionsPay").text(vacations);
                  var mobile = parseInt($("#Mobile").val(), 10);
                   $("#MobilePlan").text(mobile);
                  var internet = parseInt($("#Internet").val(), 10);
                   $("#InternetPlan").text(internet);
                   var others = parseInt($("#Others").val(), 10);
                   $("#OthersPay").text(others);
                   var overtime = parseInt($("#Overtime").val(), 10);
                   $("#OverTimePay").text(overtime);
                   var othersplus = parseInt($("#OthersPlus").val(), 10);
                    $("#OtherPlusPay").text(othersplus);
                    var allowances = parseInt($("#Allowances").val(), 10);
                    $("#AllowancesPay").text(allowances);
                    var advantages = parseInt($("#Advantages").val(), 10);
                    $("#AdvantagesPay").text(advantages);
                    var palenties = $("#totalpalenties").text();
                    $("#TotalDeductionsPay").text(palenties);
                    var compensations = $("#totalcompensations").text();
                    $("#TotalCompensationsPay").text(compensations);
                    var salaryformula = $("#SalaryFormula").text();
                    $("#TotalSalary").text(salaryformula);
                    $("#nonprint").hide();
                    $("#tabEmployeeSalaryPayslip").hide();
                    $("#printpayslip").show();
                     window.print();
                     $("#nonprint").show();
                    $("#tabEmployeeSalaryPayslip").show();
                    $("#printpayslip").hide();

             }
             </script>
             <div id="printpayslip" style="display:none; margin-top:-20px !important">
                <style type="text/css">
                .tg  {border-collapse:collapse;border-spacing:0;border-color:#ccc;}
                .tg td{font-family:Arial, sans-serif;font-size:14px;padding:1px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#ccc;color:#333;background-color:#fff;}
                .tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:2px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#ccc;color:#333;background-color:#f0f0f0;}
                .tg .tg-uqo3{background-color:#efefef;text-align:center;vertical-align:top}
                .tg .tg-erlg{font-weight:bold;background-color:#efefef;vertical-align:top}
                .tg .tg-n1l0{background-color:#f9f9f9;font-weight:bold;font-size:20px;vertical-align:top}
                .tg .tg-d3q0{background-color:#7fc241;font-weight:bold;font-size:24px;color:#000000;text-align:center;vertical-align:top}
                .tg .tg-yzt1{background-color:#efefef;vertical-align:top}
                .tg .tg-lqy6{text-align:right;vertical-align:top}
                .tg .tg-3we0{background-color:#ffffff;vertical-align:top ; text-align:left}
                .tg .tg-o4ll{font-weight:bold;background-color:#ffffff;vertical-align:top;padding :0px 5px;}
                .tg .tg-phym{background-color:#ffffff;font-weight:bold;vertical-align:top}
                .tg .tg-oskr{background-color:#ffffff;vertical-align:top}
                .tg .tg-b7b8{background-color:#f9f9f9;vertical-align:top}
                </style>
                <table class="tg" style="undefined;table-layout: fixed; width: 907px">
                <colgroup>
                <col style="width: 178px">
                <col style="width: 269px">
                <col style="width: 32px">
                <col style="width: 175px">
                <col style="width: 253px">
                </colgroup>
                  <tr>
                    <th class="tg-3we0" colspan="5"><img src="http://ingenuity-studio.com/PCPHRM/img/PCPNewLogo-01.png" width="160px" height="100px" > </th>
                  </tr>
                  <tr>
                    <td class="tg-d3q0" colspan="5">SALARY SLIP</td>
                  </tr>
                  <tr>
                    <td class="tg-o4ll">Name:</td>
                    <td class="tg-o4ll">' . $employee[0]->first_name . '</td>
                    <td class="tg-o4ll" rowspan="15"></td>
                    <td class="tg-o4ll">From:</td>
                    <td class="tg-o4ll">' . date("Y-m-1") . '</td>
                  </tr>
                  <tr>
                    <td class="tg-phym">ID:</td>
                    <td class="tg-oskr">' . $employee[0]->employee_id . '</td>
                    <td class="tg-phym">To:</td>
                    <td class="tg-oskr">' . date("Y-m-1") . '</td>
                  </tr>
                  <tr>
                    <td class="tg-o4ll">Department:</td>
                    <td class="tg-3we0">' . $department . '</td>
                    <td class="tg-o4ll">Bank Account No.:</td>
                    <td class="tg-3we0">' . $employee[0]->bank_account . '</td>
                  </tr>
                  <tr>
                    <td class="tg-phym">Job Title:</td>
                    <td class="tg-oskr">' . $jobTitleName . '</td>
                    <td class="tg-phym">Pay Procedure:</td>
                    <td class="tg-oskr">Bank Transfer</td>
                  </tr>
                  <tr>
                    <td class="tg-uqo3" colspan="2">Benefits</td>
                    <td class="tg-uqo3" colspan="2">Deductions</td>
                  </tr>
                  <tr>
                    <td class="tg-oskr">Telephone :</td>
                    <td class="tg-oskr" id="MobilePlan"></td>
                    <td class="tg-oskr">Social insurance:</td>
                    <td class="tg-oskr">270</td>
                  </tr>
                  <tr>
                    <td class="tg-3we0">USB:</td>
                    <td class="tg-3we0" id="InternetPlan"></td>
                    <td class="tg-3we0">Taxes:</td>
                    <td class="tg-3we0">200</td>
                  </tr>
                  <tr>
                    <td class="tg-oskr">Overtime:</td>
                    <td class="tg-oskr" id="OverTimePay"></td>
                    <td class="tg-oskr">Absence:</td>
                    <td class="tg-oskr" id="UnplannedVactionsPay"></td>
                  </tr>
                  <tr>
                    <td class="tg-3we0">Other:</td>
                    <td class="tg-3we0"id="OthersPlusPay"></td>
                     <td class="tg-oskr">Lateness :</td>
                    <td class="tg-oskr" id="LatniessPay"></td>
                  </tr>
                  <tr>
                    <td class="tg-3we0">Allowances:</td>
                    <td class="tg-3we0" id="AllowancesPay"></td>
                    <td class="tg-oskr">Loans:</td>
                    <td class="tg-oskr" id="LoansPay"></td>
                  </tr>
                  <tr>
                    <td class="tg-3we0"></td>
                    <td class="tg-3we0"></td>
                    <td class="tg-3we0">Health insurance:</td>
                    <td class="tg-3we0">170</td>
                  </tr>
                  <tr>
                    <td class="tg-oskr"></td>
                    <td class="tg-oskr"></td>
                    <td class="tg-oskr">Advantages:</td>
                    <td class="tg-oskr" id="AdvantagesPay"></td>
                  </tr>
                  <tr>
                    <td class="tg-oskr"></td>
                    <td class="tg-oskr"></td>
                    <td class="tg-oskr">Others:</td>
                    <td class="tg-oskr" id="OthersPay"></td>
                  </tr>
                  <tr>
                    <td class="tg-erlg">Total Compensations:</td>
                    <td class="tg-yzt1" id="TotalCompensationsPay"></td>
                    <td class="tg-erlg">Total Deductions:</td>
                    <td class="tg-yzt1" id="TotalDeductionsPay"></td>
                  </tr>
                  <tr>
                    <td class="tg-n1l0">Total Salary:</td>
                    <td class="tg-b7b8" colspan="4" ID="TotalSalary"></td>
                  </tr>
                  <tr>
                    <td class="tg-lqy6" colspan="5"> Employee Signature <br><br> _________________________</td>
                  </tr>
                </table>
           </div>
            ';
        exit;
    }

    private function getTotalLateCost($id, $salary)
    {
        $attendance = new Attendance();
        $attendances = $attendance->Find('employee = ?', array($id));
        $halfDay = ($salary / 22) / 2;
        $total = 0;
        foreach ($attendances as $dayAttendance) {
            if ($dayAttendance->in_time > '10:15:00') {
                $total += $halfDay;
            }
        }
        $total = floor($total);
        return $total;
    }

    private function getTotalLoans($id)
    {
        $loans = new EmployeeCompanyLoan();
        $loans = $loans->Find('employee = ? AND status="Approved" AND start_date>= ?', array($id, date('Y-m-d')));
        if (count($loans) > 0) {
            $total = $loans[0]->monthly_installment;
        }
        return $total;
    }

    private function getTotalExptionalLoans($id)
    {
        $loans = new EmployeeExceptionalLoans();
        $loans = $loans->Find('employee = ? AND status="Approved" AND start_date>= ?', array($id, date('Y-m-d')));
        $total = 0;
        if (count($loans) > 0) {
            $total = $loans[0]->monthly_installment;
        }
        return $total;
    }

    private function getTotalTaxes($salary)
    {
        return 640;
    }

    private function getTotalOverTimeCost($id, $salary)
    {
        $attendance = new Attendance();
        $attendances = $attendance->Find('employee = ?', array($id));
        $hourPay = ($salary / 22) / 8;
        $total = 0;
        foreach ($attendances as $dayAttendance) {
            if ($dayAttendance->in_time - $dayAttendance->out_time > 8) {
                $overTimeHours = $dayAttendance->in_time - $dayAttendance->out_time - 8;
                $total += $overTimeHours * $hourPay;
            }
        }
        $total = floor($total);
        return $total;
    }

    private function getTotalGradeBenefits($grade)
    {
        $benefits = new GradeBenefits();
        $total = 0;
        $benefits = $benefits->Find('grade = ?', array($grade));
        foreach ($benefits as $benefit) {
            if ($benefit->type == 'Allowance')
                $total += $benefit->value;
        }
        return $total;
    }

    private function getTotalGradeAdvantages($grade)
    {
        $benefits = new GradeBenefits();
        $total = 0;
        $benefits = $benefits->Find('grade = ?', array($grade));
        foreach ($benefits as $benefit) {
            if ($benefit->type == 'Advantage')
                $total += $benefit->value;
        }
        return $total;
    }

    private function getTotalGradeAllowances($grade)
    {
        $benefits = new GradeBenefits();
        $total = 0;
        $benefits = $benefits->Find('grade = ?', array($grade));
        foreach ($benefits as $benefit) {
            if ($benefit->type == 'Allowance')
                $total += $benefit->value;
        }
        return $total;
    }

    public function getSalaryByGrade($req)
    {
        $grade = new PayGrades();
        $jobtitle = new JobTitles();
        $gradelevel = $req->grade;
        $jobtitle = $jobtitle->Find('id = ?', array($req->jobtitle));
        $gradeid = $jobtitle[0]->grade;
        $grade = $grade->Find('id = ?', array($gradeid));
        $grossSalary = $this->getGrossSalary($grade[0]->$gradelevel, $gradeid);
        $totalSalaries = $this->getTotalSalaries();
        $totalSalaries += $grossSalary;
        $status ['data'][] = $grade[0]->$gradelevel;
        $status ['data'][] = $grossSalary;
        $status ['data'][] = $totalSalaries;
        $status ['status'] = 'SUCCESS';
        print_r(json_encode($status));
        exit;
    }

    private function getTotalSalaries()
    {
        $employees = new Employee();
        $employees = $employees->Find();
        $total = 0;
        foreach ($employees as $employee) {
            $total += $employee->gross_salary;
        }
        return $total;
    }

    public function getGrossSalary($salary, $payGrade)
    {
        $taxes = $this->getTotalTaxes($salary);
        $benefits = $this->getTotalGradeBenefits($payGrade);
        $totalPalenties = $benefits + $taxes;
        $final = $salary - $totalPalenties;
        return $final;
    }

    public function getEmergencyContacts($req)
    {
        $emergencyContacts = new EmergencyContacts();

        $emergencyContacts = $emergencyContacts->Find('employee = ?', $req);

        $html = "";
        foreach ($emergencyContacts as $emergencyContact) {
            $html .= '<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Name</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $emergencyContact->name . '</label>
						</div>
						<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Mobile Phone</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $emergencyContact->mobile_phone . '</label>
						</div>
						<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Work Phone</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $emergencyContact->work_phone . '</label>
						</div><br>
                        <br><br>';
        }
        print_r($html);
        exit;
    }

    public function getSalariesTable()
    {
        $html = "";
        $employess = new Employee();
        $employess = $employess->Find();
        $html .= '<div id="print" style=" margin-top:-20px !important">
                <th class="tg-3we0" colspan="5"><img src="http://ingenuity-studio.com/PCPHRM/img/PCPNewLogo-01.png" width="160px" height="100px" > </th>
                <table cellspacing="0" cellpadding="0" border="0" id="grid" class="table table-bordered table-striped dataTable" aria-describedby="grid_info" style="width: 1074px;">
                <thead><tr role="row"><th class="header" tabindex="0" rowspan="1" colspan="1" style="width: 228px;" aria-label="First Name: activate to sort column ascending">First Name</th><th class="header" tabindex="0" rowspan="1" colspan="1" style="width: 225px;" aria-label="Last Name: activate to sort column ascending">Last Name</th><th class="header" tabindex="0" rowspan="1" colspan="1" style="width: 284px;" aria-label="Bank Account: activate to sort column ascending">Bank Account</th><th class="header" tabindex="0" rowspan="1" colspan="1" style="width: 222px;" aria-label="Net Salary: activate to sort column ascending">Net Salary</th><th class="center header" tabindex="0" rowspan="1" colspan="1" style="width: 32px;" aria-label=": activate to sort column ascending"></th></tr></thead>
                ';
        foreach ($employess as $employee) {
            $html .= '<tr class="odd"><td class="">' . $employee->first_name . '</td><td class="">' . $employee->last_name . '</td><td class="">' . $employee->bank_account . '</td><td class="">' . $employee->gross_salary . '</td></tr>';
        }
        $html .= '</table>';
        $html .= '<h4>Total : ' . $employee->total_salaries . '</h4>';
        print_r($html);
        exit;
    }

    public function getDepentants($req)
    {
        $emergencyDependents = new EmployeeDependents();
        $emergencyDependents = $emergencyDependents->Find('employee = ?', $req);
        $html = "";
        foreach ($emergencyDependents as $emergencyDependent) {
            $html .= '<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Name</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $emergencyDependent->name . '</label>
						</div>
						<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Relationship</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $emergencyDependent->relationship . '</label>
						</div>
						<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Birthdate</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $emergencyDependent->dob . '</label>
						</div><br>
                        <br><br>';
        }
        print_r($html);
        exit;
    }

    public function getDoucments($req)
    {
        $userID = $_REQUEST['req'];
        $documents = new Document();
        $documents = $documents->Find();
        $html = "";
        $userID = $this->getCurrentProfileId();
        $allRequiredDoucments = new Document();
        $allRequiredDoucments = $allRequiredDoucments->Find('');
        foreach ($allRequiredDoucments as $requiredDoucment) {
            $employeeDocument = new EmployeeDocument();
            $hasDoucment = $employeeDocument->count('employee = ? AND document=? AND status = "Active"', array($userID, $requiredDoucment->id));
            if ($hasDoucment == 0) {
                $html .= '<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Required Documents</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;color:red" class="control-label col-xs-12 iceLabel">' . $requiredDoucment->name . '</label>
						</div>
                        ';
            } else {
                $html .= '<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Required Documents</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $requiredDoucment->name . '</label>
						</div>
                        ';
            }
        }
        print_r($html);
        exit;
    }

    public function getGradeName($req)
    {
        $payGrade = new PayGrades();
        $payGrade = $payGrade->Find('id = ?', array($req->id));
        return $payGrade[0]->name;
    }

    public function getLeaves()
    {
        $userID = $this->getCurrentProfileId();
        $user = new Employee();
        $user = $user->Find('id=?', array($userID));
        $jobTitle = $user[0]->job_title;
        $location = new JobTitles();
        $location = $location->Find('id = ?', array($jobTitle));
        $leaves = new LeaveType();

        $leaves = $leaves->Find('location=?', array($location[0]->work_location));
        $options = "";
        foreach ($leaves as $leave) {
            $options .= '<option value=' . $leave->id . '>' . $leave->name . '</option>';
        }
        echo $options;
        exit;
    }

    public function getQualifications($req)

    {
        $employeeSkills = new EmployeeSkill();
        $employeeSkills = $employeeSkills->Find('employee = ?', $req);
        $html = "";
        foreach ($employeeSkills as $employeeSkill) {
            $skillName = new Skills();
            $skillName = $skillName->Find('id=?', array($employeeSkill->skill_id))[0]->name;
            $html .= '<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Skill</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $skillName . '</label>
						</div>
						<div style="font-size:16px;" class="col-xs-6 col-md-3">
							<label style="font-size:13px;" class="control-label col-xs-12">Details</label>
							<label id="emergency_contact_name" style="font-size:13px;font-weight: bold;" class="control-label col-xs-12 iceLabel">' . $employeeSkill->details . '</label>
						</div>
						<br>
                        <br><br><br>';
        }
        print_r($html);
        exit;
    }

    public function getJobDescription($req)
    {
        $jobTitle = new JobTitles();
        $jobTitle = $jobTitle->Find('id = ?', array($req));
        $jobTitleNames = new JobTitlesNames();
        $jobTitleNames = $jobTitleNames->Find('id = ?', array($jobTitle[0]->name));
        $reportingTo = new JobTitlesNames();
        $reportingTo = $reportingTo->Find('id = ?', array($jobTitle[0]->reporting_to));
        $department = new CompanyStructures();
        $department = $department->Find('id = ?', array($jobTitle[0]->department));
        $education =  new Educations();
        $education = $education->Find('id  = ?',array($jobTitle[0]->education));
        $generalduites = json_decode($jobTitle[0]->general_duties);
        foreach ($generalduites as $generalduty) {
            $duties = new Duties();
            $duty = $duties->Find('id = ?', array($generalduty));
            $general[] = $duty[0]->name . ':' . $duty[0]->description . ',<br>';
        }
        $general = implode(',', $general);
        $stratgicduites = json_decode($jobTitle[0]->strategic_duties);
        foreach ($stratgicduites as $stratgicduty) {
            $duties = new Duties();
            $duty = $duties->Find('id = ?', array($stratgicduty));
            $stratgic[] = $duty[0]->name . ':' . $duty[0]->description . ',<br>';
        }
        $stratgic = implode(',', $stratgic);
        $technicalduties = json_decode($jobTitle[0]->technical_duties);
        foreach ($technicalduties as $technicalduty) {
            $duties = new Duties();
            $duty = $duties->Find('id = ?', array($technicalduty));
            $technical[] = $duty[0]->name . ':' . $duty[0]->description . ',<br>';
        }
        $technical = implode(',', $technical);
        $skills = json_decode($jobTitle[0]->skills);
        foreach ($skills as $skill) {
            $skill1 = new Skills();
            $skill2 = $skill1->Find('id = ?', array($skill));
            $allSkills[] = $skill2[0]->name;
        }
        $allSkills = implode(',', $allSkills);
        $languages = json_decode($jobTitle[0]->language);
        foreach ($languages as $language) {
            $lang = new Languages();
            $langs = $lang->Find('id = ?', array($language));

            $allLangs[] = $langs[0]->name;
        }
        $allLanguages = implode(',', $allLangs);
        $html .= '<style>
            #color{
            background-color: #365f91 !important;
            }
            </style>
       ';
        $html .= '<h2 style="margin-left: 275px;"><b>' . $jobTitleNames[0]->name . '</b></h2>
<h2 style="margin-left: 275px;"><b>Code: ' . $jobTitle[0]->code . '</b></p>
<h4 id="color" style="background-color: #365f91 !important;color: white !important;">Job Organizational Context</h4>
<table border="1" cellpadding="0" cellspacing="0" style="margin-left: 123px;width: 598px;">
	<tbody>
		<tr>
			<td>
			<p><b>Department</b></p>
			</td>
			<td>
			<p>'.$department[0]->title.'</p>
			</td>
			<td>
			<p><b>Section</b></p>
			</td>
			<td>
			<p>'.$department[0]->title.'</p>
			</td>
		</tr>
		<tr>
			<td>
			<p><b>Reporting to</b></p>
			</td>
			<td>
			<p>'.$reportingTo[0]->name.'</p>
			</td>
			<td>
			<p><b>Job Location</b></p>
			</td>
			<td>
			<p>PCP Premises</p>
			</td>
		</tr>
		<tr>
			<td>
			<p><b>Direct Supervision</b></p>
			</td>
			<td>
			<p>N/A</p>
			</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
	</tbody>
</table>
<h4  id="color" style="background-color: #365f91 !important;color: white !important;">Job Summary</h4>
<p>&sect; ' . $jobTitle[0]->description . '.</p>
<h4 id="color" style="background-color: #365f91 !important; color: white !important;">Job Duties and Responsibilities</h4>
<h4 id="color"  style="background-color: #365f91 !important; color: white !important;"><b>Strategic Duties</b></h4>
<p>&sect; ' . $stratgic . '</p>
<h4 id="color" style="background-color: #365f91 !important; color: white !important;"><b>General Administrative Duties</b></h4>
<p>&sect; ' . $general . '</p>
<h4 id="color" style="background-color: #365f91 !important; color: white !important;"><b>Technical Duties</b></h4>
<p>&sect; ' . $technical . '</p>
<p><b>For more information on roles and responsibilities, refer to company manual</b>.</p>
<h4 id="color" style="background-color: #365f91 !important; color: white !important;">Job Specifications</h4>
<h4 id="color" style="background-color: #365f91 !important; color: white !important;"><b>Minimum Required Education</b></h4>
<p>&sect; ' . $education[0]->name . '</p>
<h4 id="color" style="background-color: #365f91 !important; color: white !important;"><b>Language Proficiency </b></h4>
<p>&sect; Fluent in ' . $allLanguages . ' language.</p>
<h4 id="color" style="background-color: #365f91 !important; color: white !important;"><b>Skills and Abilities</b></h4>
<p>&sect; ' . $allSkills . '</p>
<h4 id="color" style="background-color: #365f91 !important; color: white !important;"><b>Professional Knowledge</b></h4>
<p>&sect; Strong software skills include MS PowerPoint, Project &amp; Excel</p>
<p>&sect; Experience in proposal or grant writing</p>
<br><br><br><br>
<h4 id="color" style="background-color: #365f91 !important;color: white !important;">Job Interactions (Communication)</h4>
<table border="1" cellpadding="0" cellspacing="0" style="style="width: 723px;height: 128px;">
	<tbody>
		<tr>
			<td valign="top">
			<p><b>Key Internal Interactions</b></p>
			</td>
			<td valign="top">
			<p><b>Key External Interactions</b></p>
			</td>
		</tr>
		<tr>
			<td>
			<p>&sect; Supply Chain , Operation</p>
			</td>
			<td>
			<p>&sect; Customers , Outsourcing consultancy , Commercial and legal consultancy</p>
			</td>
		</tr>
	</tbody>
</table>
<p>Job Description Acknowledgment</p>
<table border="1" cellpadding="0" cellspacing="0" style="width: 723px;height: 128px;">
	<tbody>
		<tr>
			<td>
			<p><b>Employee</b></p>
			</td>
			<td>&nbsp;</td>
			<td>
			<p><b>Direct Manager</b></p>
			</td>
			<td>&nbsp;</td>
			<td valign="top">
			<p><b>HR </b></p>
			</td>
			<td valign="top">&nbsp;</td>
		</tr>
		<tr>
			<td>
			<p><b>Signature</b></p>
			</td>
			<td>&nbsp;</td>
			<td>
			<p><b>Signature</b></p>
			</td>
			<td>&nbsp;</td>
			<td valign="top">
			<p><b>Signature</b></p>
			</td>
			<td valign="top">&nbsp;</td>
		</tr>
		<tr>
			<td>
			<p><b>Date</b></p>
			</td>
			<td>&nbsp;</td>
			<td>
			<p><b>Date</b></p>
			</td>
			<td>&nbsp;</td>
			<td valign="top">
			<p><b>Date</b></p>
			</td>
			<td valign="top">&nbsp;</td>
		</tr>
	</tbody>
</table>
';

        print_r($html);
        exit;
    }

    public function getBankBaranches($req)
    {
        $branches = new BanksBranches();
        $branches = $branches->Find('bank = ?', array($req));
        $html = "";
        $html .= '<option value="">Please select an option</option>';
        foreach ($branches as $branch) {
            $html .= '<option value=' . $branch->id . '>' . $branch->name . '</option>';
        }
        print_r($html);
        exit;
    }
}