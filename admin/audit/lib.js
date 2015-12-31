/**
 * Author: Thilina Hasantha
 */


/**
 * AuditAdapter
 */

function AuditAdapter(endPoint,tab,filter,orderBy) {
	this.initAdapter(endPoint,tab,filter,orderBy);
}

AuditAdapter.inherits(AdapterBase);



AuditAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "time",
	        "user",
	        "employee",
	        "type"
	];
});

AuditAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Time (GMT)" },
			{ "sTitle": "User" },
			{ "sTitle": "Logged In Employee" },
			{ "sTitle": "Type" }
	];
});

AuditAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "time", {"label":"Time (GMT)","type":"placeholder","validation":"none"}],
	        [ "user", {"label":"User","type":"placeholder","validation":"none","remote-source":["User","id","username"]}],
	        [ "ip", {"label":"IP Address","type":"placeholder","validation":"none"}],
	        [ "employee", {"label":"Logged In Employee","type":"placeholder","validation":"none"}],
	        [ "type", {"label":"Type","type":"placeholder","validation":"none"}],
	        [ "details", {"label":"Details","type":"placeholder","validation":"none"}]
	];
});


AuditAdapter.method('getFilters', function() {
	return [
	        [ "user", {"label":"User","type":"select2","validation":"","allow-null":false,"remote-source":["User","id","username"]}]
	];
});


AuditAdapter.method('getActionButtonsHtml', function(id,data) {	
	var editButton = '<img class="tableActionButton" src="_BASE_images/view.png" style="cursor:pointer;" rel="tooltip" title="View" onclick="modJs.edit(_id_);return false;"></img>';
	var html = '<div style="width:80px;">'+editButton+'</div>';
	
	
	html = html.replace(/_id_/g,id);
	html = html.replace(/_BASE_/g,this.baseUrl);
	return html;
});

AuditAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=120';
});
