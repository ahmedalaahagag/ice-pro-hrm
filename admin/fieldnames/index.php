<?php 
/*
This file is part of Ice Framework.

Ice Framework is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Ice Framework is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Ice Framework. If not, see <http://www.gnu.org/licenses/>.

------------------------------------------------------------------

Original work Copyright (c) 2012 [Gamonoid Media Pvt. Ltd]  
Developer: Thilina Hasantha (thilina.hasantha[at]gmail.com / facebook.com/thilinah)
 */

$moduleName = 'fieldnames';
define('MODULE_PATH',dirname(__FILE__));
include APP_BASE_PATH.'header.php';
include APP_BASE_PATH.'modulejslibs.inc.php';
?><div class="span9">
			  
	<ul class="nav nav-tabs" id="modTab" style="margin-bottom:0px;margin-left:5px;border-bottom: none;">
        <li class="dropdown">
            <a href="#" id="settingsEmployeeMenu" class="dropdown-toggle" data-toggle="dropdown" aria-controls="settingsEmployeeMenu-contents">Employee Fields <span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu" aria-labelledby="settingsEmployeeMenu" id="settingsEmployeeMenu-contents">
                <li><a id="tabEmployeeFieldName" href="#tabPageEmployeeFieldName">Employee Field Name Mapping</a></li>
                <li><a id="tabEmployeeCustomField" href="#tabPageEmployeeCustomField">Employee Custom Fields</a></li>
            </ul>
        </li>
	</ul>
	 
	<div class="tab-content">
        <div class="tab-pane active" id="tabPageEmployeeFieldName">
            <div id="EmployeeFieldName" class="reviewBlock" data-content="List" style="padding-left:5px;">

            </div>
            <div id="EmployeeFieldNameForm" class="reviewBlock" data-content="Form" style="padding-left:5px;display:none;">

            </div>
        </div>
        <div class="tab-pane" id="tabPageEmployeeCustomField">
            <div id="EmployeeCustomField" class="reviewBlock" data-content="List" style="padding-left:5px;">

            </div>
            <div id="EmployeeCustomFieldForm" class="reviewBlock" data-content="Form" style="padding-left:5px;display:none;">

            </div>
        </div>
	</div>

</div>
<script>
var modJsList = new Array();

modJsList['tabEmployeeFieldName'] = new FieldNameAdapter('FieldNameMapping','EmployeeFieldName',{"type":"Employee"});
modJsList['tabEmployeeFieldName'].setRemoteTable(true);
modJsList['tabEmployeeFieldName'].setShowAddNew(false);

modJsList['tabEmployeeCustomField'] = new CustomFieldAdapter('CustomField','EmployeeCustomField',{"type":"Employee"});
modJsList['tabEmployeeCustomField'].setRemoteTable(true);
modJsList['tabEmployeeCustomField'].setShowAddNew(false);


var modJs = modJsList['tabEmployeeFieldName'];

</script>
<?php include APP_BASE_PATH.'footer.php';?>      