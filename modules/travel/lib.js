/*
This file is part of iCE Hrm.

Original work Copyright (c) 2012 [Gamonoid Media Pvt. Ltd]  
Developer: Thilina Hasantha (thilina.hasantha[at]gmail.com / facebook.com/thilinah)
 */

function EmployeeImmigrationAdapter(endPoint) {
	this.initAdapter(endPoint);
}

EmployeeImmigrationAdapter.inherits(AdapterBase);



EmployeeImmigrationAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "document",
	        "documentname",
	        "valid_until",
	        "status"
	];
});

EmployeeImmigrationAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Document" },
			{ "sTitle": "Document Id" },
			{ "sTitle": "Valid Until"},
			{ "sTitle": "Status"}
	];
});

EmployeeImmigrationAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "document", {"label":"Document","type":"select2","remote-source":["ImmigrationDocument","id","name"]}],
	        [ "documentname", {"label":"Document Id","type":"text","validation":""}],
	        [ "valid_until", {"label":"Valid Until","type":"date","validation":"none"}],
	        [ "status", {"label":"Status","type":"select","source":[["Active","Active"],["Inactive","Inactive"],["Draft","Draft"]]}],
	        [ "details", {"label":"Details","type":"textarea","validation":"none"}],
	        [ "attachment1", {"label":"Attachment 1","type":"fileupload","validation":"none"}],
	        [ "attachment2", {"label":"Attachment 2","type":"fileupload","validation":"none"}],
	        [ "attachment3", {"label":"Attachment 3","type":"fileupload","validation":"none"}]
	];
});





function EmployeeTravelRecordAdapter(endPoint) {
	this.initAdapter(endPoint);
}

EmployeeTravelRecordAdapter.inherits(AdapterBase);



EmployeeTravelRecordAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "type",
	        "purpose",
	        "travel_from",
	        "travel_to",
	        "travel_date",
	        "return_date",
	];
});

EmployeeTravelRecordAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Travel Type" },
			{ "sTitle": "Purpose" },
			{ "sTitle": "From"},
			{ "sTitle": "To"},
			{ "sTitle": "Travel Date"},
			{ "sTitle": "Return Date"}
	];
});

EmployeeTravelRecordAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "type", {"label":"Travel Type","type":"select","source":[["Local","Local"],["International","International"]]}],
	        [ "purpose", {"label":"Purpose of Travel","type":"text","validation":""}],
	        [ "travel_from", {"label":"Travel From","type":"text","validation":""}],
	        [ "travel_to", {"label":"Travel To","type":"text","validation":""}],
	        [ "travel_date", {"label":"Travel Date","type":"datetime","validation":"none"}],
	        [ "return_date", {"label":"Return Date","type":"datetime","validation":"none"}],
	        [ "details", {"label":"Details","type":"textarea","validation":"none"}],
	        [ "attachment1", {"label":"E-Ticket / Cab Recipt","type":"fileupload","validation":"none"}],
	        [ "attachment2", {"label":"Other Attachment 1","type":"fileupload","validation":"none"}],
	        [ "attachment3", {"label":"Other Attachment 2","type":"fileupload","validation":"none"}]
	];
});

