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
		        [ "client_rep", {"label":"Contact Representative","type":"text","validation":"none"}],
		        [ "contact_number", {"label":"Contact Number","type":"text","validation":"none"}],
		        [ "contact_email", {"label":"Contact Email","type":"text","validation":"none"}],
		        [ "company_url", {"label":"Company Url","type":"text","validation":"none"}],
		        [ "status", {"label":"Status","type":"select","source":[["Active","Active"],["Inactive","Inactive"]]}],
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
				[ "pm", {"label":"Project Manager","type":"select2","remote-source":["Employees","id","first_name+last_name"]}],
				[ "tba", {"label":"TBA","type":"text","validation":"number"}],

				[ "budget", {"label":"Budget","type":"text","validation":"none"}],
				[ "actual_budget", {"label":"Actual Budget","type":"text","validation":"none"}],

				[ "governate", {"label":"Governate","type":"select2","remote-source":["Governoraties","id","name"]}],
			    [ "zone", {"label":"Zone","type":"text","validation":""}],
				[ "area", {"label":"Area","type":"text","validation":""}],

				["start_year" , {"label":"Start Year","type":"text","validation":"none"}],
				["start_date" , {"label":"Start Date","type":"date","validation":"none"}],
				["end_date" , {"label":"End Date","type":"date","validation":"none"}],
				["operation_moveout" , {"label":"Operations Move-out","type":"date","validation":"none"}],
				["projec_closedout" , {"label":"Project Closed-out","type":"date","validation":"none"}],

				["designer" , {"label":"Designer","type":"text","validation":""}],
				["engineer" , {"label":"Engineer","type":"text","validation":""}],
				["local_pm" , {"label":"Local PM","type":"text","validation":""}],
				["inter_pm" , {"label":"International PM","type":"text","validation":""}],

				["service_category" , {"label":"Services category","type":"text","validation":""}],
				["service_subcategory" , {"label":"Services subcategory","type":"text","validation":""}],
				["project_category" , {"label":"Project category","type":"select2","source":[["Residential","Residential"],["Commercial","Commercial"]]}],
				["project_subcategory" , {"label":"Project subcategory","type":"select2","source":[["Apartments","Apartments"],["Duplexes","Duplexes"],["Villas","Villas"],["Palaces","Palaces"],["Offices","Offices"],["Banking","Banking"],["Retail","Retail-F&B "],["Industrial","Industrial-Urban Planning"],["Retail","Retail-F&B "],["Hospitality","Hospitality"]]}],

				[ "phase", {"label":"Phase","type":"select","source":[["Post","Post Contract"],["Pre","Pre Contract"]]}],
				[ "status", {"label":"Status","type":"select","source":[["Finished","Finished"],["NotDelivered","Finished / Not Delivered"],["OnGoing","On Going"],["Cancelled","Cancelled"]]}],
		];
	}else{
		return [
		        [ "id", {"label":"ID","type":"hidden"}],
		        [ "name", {"label":"Name","type":"placeholder"}],
		        [ "client", {"label":"Client","type":"placeholder","allow-null":true,"remote-source":["Client","id","name"]}],
		        [ "details",  {"label":"Details","type":"placeholder","validation":"none"}],
		        [ "status", {"label":"Status","type":"placeholder","source":[["Active","Active"],["Inactive","Inactive"]]}]
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


ProjectAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=85';
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
