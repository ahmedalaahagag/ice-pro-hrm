/**
 * Author: Ahmed Alaa Hagag
 */

/**
 * ClientAdapter
 */

function ClientAdapter(endPoint,tab,filter,orderBy) {
	this.initAdapter(endPoint,tab,filter,orderBy);
}

ClientAdapter.inherits(AdapterBase);



ClientAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	        "details",
	        "address",
	        "contact_number"
	];
});

ClientAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID","bVisible":false },
			{ "sTitle": "Name" },
			{ "sTitle": "Details"},
			{ "sTitle": "Address"},
			{ "sTitle": "Contact Number"}
	];
});

ClientAdapter.method('getFormFields', function() {
	if(this.showSave){
		return [
		        [ "id", {"label":"ID","type":"hidden"}],
		        [ "name", {"label":"Name","type":"text"}],
		        [ "details",  {"label":"Details","type":"textarea","validation":"none"}],
		        [ "address",  {"label":"Address","type":"textarea","validation":"none"}],
		        [ "contact_number", {"label":"Contact Number","type":"text","validation":"none"}],
		        [ "contact_email", {"label":"Contact Email","type":"text","validation":"none"}],
		        [ "company_url", {"label":"Company Url","type":"text","validation":"none"}],
		        [ "first_contact_date", {"label":"First Contact Date","type":"date","validation":"none"}]
		];
	}else{
		return [
		        [ "id", {"label":"ID","type":"hidden"}],
		        [ "name", {"label":"Name","type":"placeholder"}],
		        [ "details",  {"label":"Details","type":"placeholder","validation":"none"}],
		        [ "address",  {"label":"Address","type":"placeholder","validation":"none"}],
		        [ "contact_number", {"label":"Contact Number","type":"placeholder","validation":"none"}],
		        [ "contact_email", {"label":"Contact Email","type":"placeholder","validation":"none"}],
		        [ "company_url", {"label":"Company Url","type":"placeholder","validation":"none"}],
		        [ "status", {"label":"Status","type":"placeholder","source":[["Active","Active"],["Inactive","Inactive"]]}],
		        [ "first_contact_date", {"label":"First Contact Date","type":"placeholder","validation":"none"}]
		];
	}
});

ClientAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=85';
});

/**
 * ProjectAdapter
 */

function ProjectAdapter(endPoint,tab,filter,orderBy) {
	this.initAdapter(endPoint,tab,filter,orderBy);
}

ProjectAdapter.inherits(AdapterBase);

var department = 1;

ProjectAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	        "client"
	];
});

ProjectAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID","bVisible":false },
			{ "sTitle": "Name" },
			{ "sTitle": "Client"},
	];
});

ProjectAdapter.method('getFormFields', function() {
	if(this.showSave){
		return [
		        [ "id", {"label":"ID","type":"hidden"}],
		        [ "name", {"label":"Project Name","type":"text"}],
		        [ "media_name", {"label":"Media Name","type":"text","validation":""}],
				[ "client", {"label":"Client","type":"select2","remote-source":["Clients","id","name"]}],
				[ "client_rep", {"label":"Client Representative","type":"text"}],
				[ "client_rep_phone", {"label":"Client Representative Phone","type":"text"}],
				[ "pm", {"label":"Project Manager","type":"select2","remote-source":["Employees","id","first_name+last_name"]}],
				[ "tba", {"label":"TBA","type":"text","validation":"number"}],

				[ "department"+department+"", {"label":"Department","type":"select2","remote-source":["CompanyStructures","id","title"]}],

				[ "budget", {"label":"Budget","type":"text","validation":"none"}],
				[ "actual_budget", {"label":"Actual Budget","type":"text","validation":"none"}],

				[ "governate", {"label":"Governate","type":"select2","remote-source":["Governoraties","id","name"]}],
			    [ "zone", {"label":"Zone","type":"text","validation":""}],
				[ "area", {"label":"Area","type":"text","validation":""}],
				["latitude" , {"label":"Latitude","type":"text","validation":""}],
				["longitude" , {"label":"Longitude","type":"text","validation":""}],

				["start_year" , {"label":"Start Year","type":"text","validation":"none"}],
				["start_date" , {"label":"Start Date","type":"date","validation":"none"}],
				["end_date" , {"label":"End Date","type":"date","validation":"none"}],
				["operation_moveout" , {"label":"Operations Move-out","type":"date","validation":"none"}],
				["projec_closedout" , {"label":"Project Closed-out","type":"date","validation":"none"}],

				["designer" , {"label":"Designer","type":"text","validation":"none"}],
				["engineer" , {"label":"Engineer","type":"text","validation":"none"}],
				["local_pm" , {"label":"Local PM","type":"text","validation":"none"}],
				["inter_pm" , {"label":"International PM","type":"text","validation":"none"}],

				["service_category" , {"label":"Service category","type":"select2","source":[["CivilWorks","Civil Works"],["Fitout","Fitout"],["Design","Design"]]}],
				["service_subcategory" , {"label":"Services subcategory","type":"select2","source":[["","Please select service category"]]}],
				["project_category" , {"label":"Project category","type":"select2","source":[["Residential","Residential"],["Commercial","Commercial"]]}],
				["project_subcategory" , {"label":"Project subcategory","type":"select2","source":[["","Please select project category"]]}],

				[ "phase", {"label":"Phase","type":"select","source":[["Post","Post Contract"],["Pre","Pre Contract"]]}],


		];
	}else{
		return [
		        [ "id", {"label":"ID","type":"hidden"}],
		        [ "name", {"label":"Name","type":"placeholder"}],
		        [ "client", {"label":"Client","type":"placeholder","allow-null":true,"remote-source":["Client","id","name"]}],
		        [ "details",  {"label":"Details","type":"placeholder","validation":"none"}],
		];
	}
	
});

ProjectAdapter.method('changeGovernorate', function(country) {
	var table='province';
	var selectElement='governorate';
	$.post(this.moduleRelativeURL,{'a':'loadSub','t': table  ,'sm':null , 'subSet':'country','subSetValue':country.val()},function(data){
		if(data.status == "SUCCESS"){
			modJs.changeSelect2Options('governorate',data);
		}else{
			if(selectElement)
				var select2 = $("select#"+selectElement);
			else
				var select2 = $("select#"+table);

			select2.find('option').remove();
			options ="<option value='NULL'>None</option>";
			select2.html(options);
		}
	},"JSON");
});
ProjectAdapter.method('add', function(object,callBackData) {
	var callBackData = [];
	var reqJson = JSON.stringify(object);
	callBackData['callBackData'] = [];
	callBackData['callBackSuccess'] = 'addProjectCallBack';
	callBackData['callBackFail'] = 'addProjectCallBackFail';
	this.customAction('addProject', 'admin_projects', reqJson, callBackData);
});

ProjectAdapter.method('addProjectCallBack',function(callBackData){
	window.reload();
});

ProjectAdapter.method('addProjectCallBackFail',function(callBackData){
	this.showMessage("Error", "Error Saving Project");
	this.get([]);
});

ProjectAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=85';
});

ProjectAdapter.method('postRenderForm',function(){
	$.post(this.moduleRelativeURL,{'a': 'ca', 'req': '' , 'mod': 'admin_jobs', 'sa': 'getNodes' } , function (data) {
		$("#department1").html(data);
	});
	if(!$("#id").val()){
		$("select").prepend("<option value=''>Please select an option</option>").val('');
		$(".select2-offscreen").select2("val", "");
	}
	$("#project_category").on('change',modJs.getSubServiceCategory());
	$("#field_longitude").after('<div id="map"></div><style>#map {width: 500px;height: 400px;background-color: #CCC;margin-left: 286px}</style>');
	this.initMap();
	$("#field_department1").after('<div id="Department_'+department+'"></div><button type="button" id="btnAddDepartment" class="btn btn-success pull-right" style="display: none" onclick="modJs.addDepartment()">+ Add Department</button>')
	$("#field_department1").after('<div id="Departments"></div>')
	if($("#id").val()) {
		var id =$("#id").val();
		var baseURL=this.moduleRelativeURL;
		$.post(this.moduleRelativeURL, {
			'a': 'ca',
			'req': id,
			'mod': 'admin_projects',
			'sa': 'getProjectTeam'
		}, function (data) {
			$("#field_department1").html(data);
			$("select").select2();
			$("#btnAddDepartment").show();
			$.post(baseURL, {'a': 'ca', 'req':  id , 'mod': 'admin_projects', 'sa': 'getLastDepartment'}, function (data) {
				department = parseInt(data);
			})
		})

	}
});
ProjectAdapter.method('removeDepartment',function (id) {
		$("#Department_"+id).remove();
		$("#removeBtn"+id).remove();
});
ProjectAdapter.method('addDepartment',function () {
	department = department+1;
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req':  department , 'mod': 'admin_projects', 'sa': 'getDepartments'}, function (data) {
		if($("#Department_" + department).length){
			var departmentName = "#department"+department;
			$("#Department_"+department).append(data);
			$("#department" + department).select2();
		$("#Department_" + department).append('<script>$("'+departmentName+'").on("change",function(){modJs.getDepartmentEmployess()});</script>');
		}
		else{
			$('#Departments').append('<div id="Department_'+department+'"></div>');
			var departmentName = "#department"+department;
			$("#Department_"+department).append(data);
			$("#department" + department).select2();
			$("#Department_" + department).append('<script>$("'+departmentName+'").on("change",function(){modJs.getDepartmentEmployess()});</script>');
		}
	});
});

ProjectAdapter.method('getDepartmentEmployess', function () {
	var departmentid = $("#department"+department).val();
	var dataObject = departmentid+'_'+department;
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req':  dataObject , 'mod': 'admin_projects', 'sa': 'getDepartmentEmployess'}, function (data) {
		$("#field_supervisors"+department).remove();
		$("#field_members"+department).remove();
		$("#Department_"+department).append(data);
		$("#Supervisors"+department).select2();
		$("#Members"+department).select2();
		$("#btnAddDepartment").show(data);
		var nextDiv = department+1;
		$("#Department_"+department).after('<div id="Department_'+nextDiv+'"></div>');
	})
});

ProjectAdapter.method('initMap',function(){
$.getScript('https://maps.googleapis.com/maps/api/js', function(){
	var  marker;
	var mapCanvas = document.getElementById('map');
	var mapOptions = {
		center: new google.maps.LatLng(30.0304306,31.2243741),
		zoom: 13,
		disableDoubleClickZoom: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(mapCanvas,mapOptions);

	if($("#latitude").val()>1) {
		var location =new google.maps.LatLng($("#latitude").val(),$("#longitude").val());
		placeMarker(location);
	}
	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	})
	function placeMarker(location) {
		if (!marker) {
			// Create the marker if it doesn't exist
			marker = new google.maps.Marker({
				position: location,
				map: map
			});
		}
		// Otherwise, simply update its location on the map.
		else {
			marker.setPosition(location);
		  }

		$("#latitude").val(location.lat());
		$("#longitude").val(location.lng());
		map.setCenter(location);
	}
})
});

ProjectAdapter.method('placeMarker',function(location){

});


ProjectAdapter.method('getSubServiceCategory',function(){
	var servicecat = $("#project_category").val();
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req': servicecat , 'mod': 'admin_projects', 'sa': 'getSubServiceCategory'}, function (data) {
	 $("#project_subcategory").html(data);
	})
});
ProjectAdapter.method('getSubCategory',function(){
	var servicecat = $("#service_category").val();
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req': servicecat , 'mod': 'admin_projects', 'sa': 'getSubCategory'}, function (data) {
		$("#service_subcategory").html(data);
	})
});


/*
 * EmployeeProjectAdapter
 */


function EmployeeProjectAdapter(endPoint) {
	this.initAdapter(endPoint);
}

EmployeeProjectAdapter.inherits(AdapterBase);



EmployeeProjectAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "employee",
	        "project",
	        "status"
	];
});

EmployeeProjectAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Employee" },
			{ "sTitle": "Project" },
			/*{ "sTitle": "Start Date"},*/
			{ "sTitle": "Status"}
	];
});

EmployeeProjectAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
	        [ "project", {"label":"Project","type":"select2","remote-source":["Project","id","name"]}],
	        [ "details", {"label":"Details","type":"textarea","validation":"none"}]
	];
});

EmployeeProjectAdapter.method('getFilters', function() {
	return [
	        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}]
	        
	];
});

EmployeeProjectAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=85';
});

/**
 * ThirdPartiesAdapter
 */

function ThirdPartiesAdapter(endPoint) {
	this.initAdapter(endPoint);
}

ThirdPartiesAdapter.inherits(AdapterBase);

ThirdPartiesAdapter.method('getDataMapping', function() {
	return [
		"id",
		"name"
	];
});

ThirdPartiesAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" ,"bVisible":false},
		{ "sTitle": "Name" },
	];
});

ThirdPartiesAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden"}],
		[ "name", {"label":"Party Name","type":"text","required":true}],
	];
});

ThirdPartiesAdapter.method('getFilters', function() {
	return [
		[ "name", {"label":"Name","type":"select2","remote-source":["ThirdParties","id","name"]}]
	];
});

ThirdPartiesAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=85';
});

/**
 * ScopesAdapter
 */

function ScopesAdapter(endPoint) {
	this.initAdapter(endPoint);
}

ScopesAdapter.inherits(AdapterBase);

ScopesAdapter.method('getDataMapping', function() {
	return [
		"id",
		"name"
	];
});

ScopesAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" ,"bVisible":false},
		{ "sTitle": "Name" },
	];
});

ScopesAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden"}],
		[ "name", {"label":"Scope Name","type":"text","required":true}],
	];
});

ScopesAdapter.method('getFilters', function() {
	return [
		[ "name", {"label":"Name","type":"select2","remote-source":["ThirdParties","id","name"]}]
	];
});

ScopesAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=85';
});

/**
 * CategoriesAdapter
 */

function CategoriesAdapter(endPoint) {
	this.initAdapter(endPoint);
}

CategoriesAdapter.inherits(AdapterBase);

CategoriesAdapter.method('getDataMapping', function() {
	return [
		"id",
		"name"
	];
});

CategoriesAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" ,"bVisible":false},
		{ "sTitle": "Name" },
	];
});

CategoriesAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden"}],
		[ "name", {"label":"Category Name","type":"text","required":true}],
	];
});

CategoriesAdapter.method('getFilters', function() {
	return [
		[ "name", {"label":"Name","type":"select2","remote-source":["ThirdParties","id","name"]}]
	];
});

CategoriesAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=85';
});
