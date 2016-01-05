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

function EmployeeCompanyLoanAdapter(endPoint) {
	this.initAdapter(endPoint);
}

EmployeeCompanyLoanAdapter.inherits(AdapterBase);



EmployeeCompanyLoanAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "start_date",
	        "period_months",
	        "amount",
	        "status"
	];
});

EmployeeCompanyLoanAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Loan Start Date"},
			{ "sTitle": "Loan Period (Months)"},
			{ "sTitle": "Amount"},
			{ "sTitle": "Status"}
	];
});

EmployeeCompanyLoanAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden"}],
		[ "employee", {"label":"employee","type":"hidden"}],
		[ "start_date", {"label":"Loan Start Date","type":"date","validation":""}],
		[ "last_installment_date", {"label":"Last Installment Date","type":"date","validation":"none"}],
		[ "period_months", {"label":"Loan Period (Months)","type":"text","validation":"number"}],
		[ "amount", {"label":"Loan Amount","type":"text","validation":"float"}],
		[ "monthly_installment", {"label":"Monthly Installment 10% of the salary","type":"text"}],
	];
});


EmployeeCompanyLoanAdapter.method('getActionButtonsHtml', function(id,data) {	
	var editButton = '<img class="tableActionButton" src="_BASE_images/view.png" style="cursor:pointer;" rel="tooltip" title="View" onclick="modJs.edit(_id_);return false;"></img>';
	var deleteButton = '<img class="tableActionButton" src="_BASE_images/delete.png" style="margin-left:15px;cursor:pointer;" rel="tooltip" title="Delete" onclick="modJs.deleteRow(_id_);return false;"></img>';
	var html = '<div style="width:80px;">_edit__delete_</div>';

	if(this.showDelete){
		html = html.replace('_delete_',deleteButton);
	}else{
		html = html.replace('_delete_','');
	}

	if(this.showEdit){
		html = html.replace('_edit_',editButton);
	}else{
		html = html.replace('_edit_','');
	}

	html = html.replace(/_id_/g,id);
	html = html.replace(/_BASE_/g,this.baseUrl);
	return html;
});

EmployeeCompanyLoanAdapter.method("postRenderForm", function(id,data) {
	    $.post(this.moduleRelativeURL, {'a': 'ca', 'req': '', 'mod': 'admin_employees', 'sa': 'getSalary'}, function (data) {
		var obj  = jQuery.parseJSON(data);
		$("#amount").val(obj.salary*2);
		$('#amount').attr('readonly', true);
		$("#employee").val(obj.userid);
		$("#monthly_installment").val(obj.salary/10);
		$('#monthly_installment').attr('readonly', true);
	});
});
EmployeeCompanyLoanAdapter.method('add', function() {
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req': '', 'mod': 'modules_loans', 'sa': 'hasAllRequiredDoucments'}, function (data) {
		alert(data);
		console.log(data);
	})
});

EmployeeCompanyLoanAdapter.method('getMonths', function() {
	var startDate = $("#start_date").val();
	var lastDate = $("#last_installment_date").val();
	console.log(startDate);
	console.log(startDate);
});
function EmployeeExceptionalLoansAdapter(endPoint) {
	this.initAdapter(endPoint);
}

EmployeeExceptionalLoansAdapter.inherits(AdapterBase);

EmployeeExceptionalLoansAdapter.method('getDataMapping', function() {
	return [
		"id",
		"loan",
		"start_date",
		"period_months",
		"amount",
		"status"
	];
});

EmployeeExceptionalLoansAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" ,"bVisible":false},
		{ "sTitle": "Loan Type" },
		{ "sTitle": "Loan Start Date"},
		{ "sTitle": "Loan Period (Months)"},
		{ "sTitle": "Amount"},
		{ "sTitle": "Status"}
	];
});

EmployeeExceptionalLoansAdapter.method('getFormFields', function() {
	return [
			[ "id", {"label":"ID","type":"hidden"}],
			[ "employee", {"label":"employee","type":"hidden"}],
			[ "start_date", {"label":"Loan Start Date","type":"date","validation":""}],
			[ "last_installment_date", {"label":"Last Installment Date","type":"date","validation":"none"}],
			[ "period_months", {"label":"Loan Period (Months)","type":"text","validation":"number","required":"true"}],
			[ "amount", {"label":"Loan Amount","type":"text","validation":"float","required":"true"}],
			[ "monthly_installment", {"label":"Monthly Installment","type":"text","validation":"float","required":"true"}],
			[ "details", {"label":"Details","type":"textarea","validation":"none"}],
			[ "attachment", {"label":"Attachment","type":"fileupload","validation":"none"}]
		];
});

EmployeeExceptionalLoansAdapter.method("postRenderForm", function(id,data) {
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req': '', 'mod': 'admin_employees', 'sa': 'getSalary'}, function (data) {
		var obj  = jQuery.parseJSON(data);
	    $("#employee").val(obj.userid);
	});


});

EmployeeExceptionalLoansAdapter.method('getActionButtonsHtml', function(id,data) {
	var editButton = '<img class="tableActionButton" src="_BASE_images/view.png" style="cursor:pointer;" rel="tooltip" title="View" onclick="modJs.edit(_id_);return false;"></img>';
	var deleteButton = '<img class="tableActionButton" src="_BASE_images/delete.png" style="margin-left:15px;cursor:pointer;" rel="tooltip" title="Delete" onclick="modJs.deleteRow(_id_);return false;"></img>';
	var html = '<div style="width:80px;">_edit__delete_</div>';

	if(this.showDelete){
		html = html.replace('_delete_',deleteButton);
	}else{
		html = html.replace('_delete_','');
	}

	if(this.showEdit){
		html = html.replace('_edit_',editButton);
	}else{
		html = html.replace('_edit_','');
	}

	html = html.replace(/_id_/g,id);
	html = html.replace(/_BASE_/g,this.baseUrl);
	return html;
});


