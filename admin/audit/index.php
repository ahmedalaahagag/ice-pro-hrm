<?php
$moduleName = 'Audits';
define('MODULE_PATH',dirname(__FILE__));
include APP_BASE_PATH.'header.php';
include APP_BASE_PATH.'modulejslibs.inc.php';
?><div class="span9">
			  
	<ul class="nav nav-tabs" id="modTab" style="margin-bottom:0px;margin-left:5px;border-bottom: none;">
		<li class="active"><a id="tabAudit" href="#tabPageAudit">Audit Log</a></li>
	</ul>
	 
	<div class="tab-content">
		<div class="tab-pane active" id="tabPageAudit">
			<div id="Audit" class="reviewBlock" data-content="List" style="padding-left:5px;">
		
			</div>
			<div id="AuditForm" class="reviewBlock" data-content="Form" style="padding-left:5px;display:none;">
		
			</div>
		</div>
	</div>

</div>
<script>
var modJsList = new Array();

modJsList['tabAudit'] = new AuditAdapter('Audit','Audit','','id desc');
modJsList['tabAudit'].setRemoteTable(true);
modJsList['tabAudit'].setShowDelete(false);
modJsList['tabAudit'].setShowAddNew(false);
modJsList['tabAudit'].setShowSave(false);
var modJs = modJsList['tabAudit'];

</script>
<?php include APP_BASE_PATH.'footer.php';?>      