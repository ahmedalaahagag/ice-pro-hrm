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
Developer: Ahmed Alaa Hagag (thilina.hasantha[at]gmail.com / facebook.com/thilinah)
 */

$moduleName = 'jobs';
define('MODULE_PATH',dirname(__FILE__));
include APP_BASE_PATH.'header.php';
include APP_BASE_PATH.'modulejslibs.inc.php';
?><div class="span9">
	<ul class="nav nav-tabs" id="modTab" style="margin-bottom:0px;margin-left:5px;border-bottom: none;">
		<li id="Grade"  class="active"><a id="tabPayGrades" href="#tabPagePayGrades" onclick="location.reload();">Grades</a></li>
		<li><a id="tabEmploymentStatus" href="#tabPageEmploymentStatus">Employment Status</a></li>
		<li style="display: none;" id="JobTitle"><a id="tabJobTitles" href="#tabPageJobTitles">Job Details</a></li>
		<li style="display: none;"><a id="tabGradeBenefits" href="#tabPageGradeBenefits">Benefits</a></li>
	</ul>
	<div class="tab-content">
			<div class="tab-pane active" id="tabPayGrades">
				<div id="PayGrades" class="reviewBlock" data-content="List" style="padding-left:5px;">
				</div>
				<div id="PayGradesForm" class="reviewBlock" data-content="Form" style="padding-left:5px;display:none;">

				</div>
			</div>
		    <div class="tab-pane" id="tabPageEmploymentStatus">
			<div id="EmploymentStatus" class="reviewBlock" data-content="List" style="padding-left:5px;">
		
			</div>
			<div id="EmploymentStatusForm" class="reviewBlock" data-content="Form" style="padding-left:5px;display:none;">
		
			</div>
		</div>

	<div class="tab-pane" id="tabPageJobTitles">
		<div id="JobTitles" class="reviewBlock" data-content="List" style="padding-left:5px;">

		</div>
		<div id="JobTitlesForm" class="reviewBlock" data-content="Form" style="padding-left:5px;display:none;">

		</div>
	</div>
		<div class="tab-pane" id="tabPageGradeBenefits">
			<div id="GradeBenefits" class="reviewBlock" data-content="List" style="padding-left:5px;">

			</div>
			<div id="GradeBenefitsForm" class="reviewBlock" data-content="Form" style="padding-left:5px;display:none;">

			</div>
		</div>
</div>
</div>
<script>

var modJsList = new Array();
modJsList['tabPayGrades'] = new PayGradeAdapter('PayGrades');
modJsList['tabJobTitles'] = new JobTitleAdapter('JobTitles');
modJsList['tabGradeBenefits'] = new GradeBenefitsAdapter('GradeBenefits');
modJsList['tabEmploymentStatus'] = new EmploymentStatusAdapter('EmploymentStatus');
var modJs = modJsList['tabPayGrades'];

</script>
<?php include APP_BASE_PATH.'footer.php';?>      