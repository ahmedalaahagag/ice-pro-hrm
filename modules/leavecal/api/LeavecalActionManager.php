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

class LeavecalActionManager extends SubActionManager{
	
	public function getLeavesForMeAndSubordinates($req){
        $req->start = gmdate("Y-m-d", $req->start);
        $req->end = gmdate("Y-m-d", $req->end);
		$shareCalendar = $this->baseService->settingsManager->getSetting("Leave: Share Calendar to Whole Company");
		$map = json_decode('{"employee":["Employee","id","first_name+last_name"],"leave_type":["LeaveType","id","name"]}');
		$employee = $this->baseService->getElement('Employee',$this->getCurrentProfileId(),null,true);
		if($shareCalendar != "1"){
			$subordinate = new Employee();
			$subordinates = $subordinate->Find("supervisor = ?",array($employee->id));
			$subordinatesIds = $employee->id;
			foreach($subordinates as $sub){
				if($subordinatesIds != ""){
					$subordinatesIds.=",";
				}
				$subordinatesIds.=$sub->id;
			}
            $employeeLeave = new EmployeeLeave();
			$startDate = date("Y-m-d H:i:s",$req->start);
			$endDate = date("Y-m-d H:i:s",$req->end);
			$list = $employeeLeave->Find("employee in (".$subordinatesIds.") and status in ('Approved','Pending') and ((date_start >= ? and date_start <= ? ) or (date_end >= ? and date_end <= ?))",array($startDate,$endDate,$startDate,$endDate));
		}else{
            $employeeLeave = new EmployeeLeave();
			$startDate = $req->start;
			$endDate = $req->end;
            $list = $employeeLeave->Find("status in ('Approved','Pending') and ((date_start >= ? and date_start <= ? ) or (date_end >= ? and date_end <= ?))",array($startDate,$endDate,$startDate,$endDate));
        }

		
		if(!$list){
			LogManager::getInstance()->info($employeeLeave->ErrorMsg());
		}
		if(!empty($map)){
			$list = $this->baseService->populateMapping($list,$map);
		}


        $leaveType = new LeaveType();
        $leaveTypesTemp = $leaveType->Find("1=1");
        $leaveTypes = array();
        foreach($leaveTypesTemp as $leaveType){
            $leaveTypes[$leaveType->name] = $leaveType;
        }

		$data = array();
        $mode = CalendarTools::getCalendarMode($req->start, $req->end);
        foreach($list as $leave){
            $tmpEvents = $this->leaveToEvents($leave, $leaveTypes);
            foreach($tmpEvents as $event){
                $data[] =  $event;
            }
        }
        /*
        if($mode == CalendarTools::MODE_MONTH){
            foreach($list as $leave){
                $data[] = $this->leaveToEvent($leave, $leaveTypes);
            }
        }else{
            foreach($list as $leave){
                $tmpEvents = $this->leaveToEvents($leave, $leaveTypes);
                foreach($tmpEvents as $event){
                    $data[] =  $event;
                }
            }
        }
		*/
		$holiday = new HoliDay();
		$holidays = $holiday->Find("1=1",array());
		
		foreach($holidays as $holiday){
			$data[] = $this->holidayToEvent($holiday);
		}
		
		echo json_encode($data);
		exit();
	}
	
	
	public function leaveToEvent($leave, $leaveTypes){
		$event = array();
		$event['id'] = $leave->id;
		$event['title'] = $leave->employee." (".$leave->leave_type.")";
		$event['start'] = $leave->date_start;
		$event['end'] = $leave->date_end;

		$eventBackgroundColor = "";
        if(empty($leaveTypes[$leave->leave_type]->leave_color)){
            if($leave->status == "Pending"){
                $eventBackgroundColor = "#cc9900";
            }else{
                $eventBackgroundColor = "#336633";
            }
            $event['title'] = $leave->employee." (".$leave->leave_type.")";
        }else{
            $eventBackgroundColor = $leaveTypes[$leave->leave_type]->leave_color;
            $event['title'] = $leave->employee." (".$leave->status.")";
        }
		$event['color'] = $eventBackgroundColor;
		$event['backgroundColor'] = $eventBackgroundColor;
		$event['textColor'] = "#FFF";

		return $event;
	}

    public function leaveToEvents($leave, $leaveTypes){

        $leaveDay = new EmployeeLeaveDay();
        $leaveDays = $leaveDay->Find("employee_leave = ?",array($leave->id));
        $events = array();
        foreach($leaveDays as $leaveDay){
            $event = array();
            $event['id'] = $leaveDay->id;
            $event['title'] = $leave->employee." (".$leave->leave_type.")";

            if($leaveDay->leave_type == 'Full Day'){
                $event['allDay'] = true;
            }else{
                $event['allDay'] = false;
            }
            $time = $this->leaveTypeToTime($leaveDay->leave_date, $leaveDay->leave_type);
            $event['start'] = $time[0];
            $event['end'] = $time[1];
            $eventBackgroundColor = "";
            if(empty($leaveTypes[$leave->leave_type]->leave_color)){
                if($leave->status == "Pending"){
                    $eventBackgroundColor = "#cc9900";
                }else{
                    $eventBackgroundColor = "#336633";
                }
                $event['title'] = $leave->employee." (".$leave->leave_type.")";
            }else{
                $eventBackgroundColor = $leaveTypes[$leave->leave_type]->leave_color;
                $event['title'] = $leave->employee." (".$leave->status.")";
            }
            $event['color'] = $eventBackgroundColor;
            $event['backgroundColor'] = $eventBackgroundColor;
            $event['textColor'] = "#FFF";

            $events[] = $event;
        }


        return $events;
    }

    private function leaveTypeToTime($date, $type){
        //'Full Day','Half Day - Morning','Half Day - Afternoon','1 Hour - Morning','2 Hours - Morning','3 Hours - Morning','1 Hour - Afternoon','2 Hours - Afternoon','3 Hours - Afternoon'
        $start = $date;
        $end = $date;
        $timeZone = "+00:00";
        switch($type){

            case 'Full Day':
                break;
            case 'Half Day - Morning':
                $start = $start."T"."08:00:00".$timeZone;
                $end = $end."T"."12:30:00".$timeZone;
                break;
            case 'Half Day - Afternoon':
                $start = $start."T"."13:30:00".$timeZone;
                $end = $end."T"."18:00:00".$timeZone;
                break;
            case '1 Hour - Morning':
                $start = $start."T"."08:00:00".$timeZone;
                $end = $end."T"."09:00:00".$timeZone;
                break;
            case '2 Hours - Morning':
                $start = $start."T"."08:00:00".$timeZone;
                $end = $end."T"."10:00:00".$timeZone;
                break;
            case '3 Hours - Morning':
                $start = $start."T"."08:00:00".$timeZone;
                $end = $end."T"."11:00:00".$timeZone;
                break;
            case '1 Hour - Afternoon':
                $start = $start."T"."13:30:00".$timeZone;
                $end = $end."T"."14:30:00".$timeZone;
                break;
            case '2 Hours - Afternoon':
                $start = $start."T"."13:30:00".$timeZone;
                $end = $end."T"."15:30:00".$timeZone;
                break;
            case '3 Hours - Afternoon':
                $start = $start."T"."13:30:00".$timeZone;
                $end = $end."T"."16:30:00".$timeZone;
                break;

        }
        return array($start, $end);
    }
	
	public function holidayToEvent($holiday){
		$event = array();
		$event['id'] = "hd_".$holiday->id;
		if($holiday->status == "Full Day"){
			$event['title'] = $holiday->name;
		}else{
			$event['title'] = $holiday->name." (".$holiday->status.")";
		}

		if(!empty($holiday->country)){
			$country = new Country();
			$country->Load("id = ?",array($holiday->country));
			$event['title'] .=" / ".$country->name." only";
		}
	
		$event['start'] = $holiday->dateh;
		$event['end'] = $holiday->dateh;
	
		$eventBackgroundColor = "#3c8dbc";
	
		$event['color'] = $eventBackgroundColor;
		$event['backgroundColor'] = $eventBackgroundColor;
		$event['textColor'] = "#FFF";
	
		return $event;
	}

}