/**
 * Author: Ahmed Alaa Hagag
 */


/**
 * JobTitleAdapter
 */

function JobTitleAdapter(endPoint) {
	this.initAdapter(endPoint);

}

JobTitleAdapter.inherits(AdapterBase);



JobTitleAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	];
});

JobTitleAdapter.method('addNew', function() {
	$("#tabJobTitles").trigger("click");
	modJs.renderForm();
	window.stop();
	modJs.getGradeName();
});

JobTitleAdapter.method('editNew', function(id) {
	$("#tabJobTitles").trigger("click");
	modJs.edit(id);
});


JobTitleAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Name" },
	];
});

JobTitleAdapter.method('printJobDescription',function(){
	var id =$("#id").val();
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req': id , 'mod': 'admin_employees', 'sa': 'getJobDescription'}, function (data) {
		$("#JobTitles_submit").hide();
		$("#Grade").hide();
		$("#tabEmploymentStatus").hide();
		$("#printJobDescription").show();
		$("#printJobDescription").html(data);
		window.print();
		$("#JobTitles_submit").show();
		$("#Grade").show();
		$("#tabEmploymentStatus").show();
		$("#printJobDescription").hide();

	})
});

JobTitleAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
			[ "name", {"label":"Job Title","type":"select2","remote-source":["JobTitlesNames","id","name"]}],
			[ "grade", {"label":"Job Grade","type":"text"}],
			[ "code", {"label":"Code","type":"text"}],
		    [ "department", {"label":"Department","type":"select2","remote-source":["CompanyStructures","id","title"]}],
		    [ "reporting_to", {"label":"Reporting To","type":"select2","remote-source":["JobTitlesNames","id","name"]}],
		    [ "description", {"label":"Job Summry","type":"textarea"}],
		    [ "general_duties", {"label":"General Duties","type":"select2multi","remote-source":["JobDuties","id","name"]}],
		    [ "technical_duties", {"label":"Technical Duties","type":"select2multi","remote-source":["JobDuties","id","name"]}],
		    [ "strategic_duties", {"label":"Strategic Duties","type":"select2multi","remote-source":["JobDuties","id","name"]}],
			[ "education", {"label":"Education Degree","type":"select2","validation":"none","remote-source":["Educations","id","name"]}],
			[ "skills", {"label":"Skills","type":"select2multi","validation":"none","remote-source":["Skills","id","name"]}],
			[ "language", {"label":"Languages","type":"select2multi","validation":"none","remote-source":["Languages","id","name"]}],
			[ "work_location", {"label":"Work Location","type":"select2","source":[["Office","Office"],["Site","Site"]]}],
	];

});

JobTitleAdapter.method('getGradeName',function(){
	var grade = $("#grade").val();
	$.post(this.moduleRelativeURL,{'a': 'ca', 'req': grade , 'mod': 'admin_jobs', 'sa': 'getGradeName' } , function (data) {
		$("#JobTitles_submit").prepend("<h3 id='gradetitle' style='margin-left:440px'>Grade : " + data + "</h3>");
		})
});

JobTitleAdapter.method('getGradeNameCallback',function(callBackData){
	$("#field_name").before(callBackData)
});

JobTitleAdapter.method('postRenderForm',function(){
	$("#field_grade").hide();
	$("#grade").attr("value",gradesession);
	$("#modaljobtitle").text($("#name").val());
	$("#modaljobdescription").text($("#description").val());
	$("#general_duties").on('change',function(){
		modJs.getToolTip();
	})
	$("#technical_duties").on('change',function(){
		modJs.getToolTip();
	})
	$("#strategic_duties").on('change',function(){
		modJs.getToolTip();
	})
	this.getGeneralDuites();
	this.getTechnicalDuites();
	this.getStrategicDuites();
	this.getToolTip();
	modJs.getGradeName();
});
JobTitleAdapter.method('getToolTip',function(){
	$(".select2-search-choice>div").each(function(index, value) {
		var thisObject =  $(this);
		$.post('http://localhost/icepro/app/service.php',{'a': 'ca', 'req': $(this).text() , 'mod': 'admin_jobs', 'sa': 'getDutyDescription'}, function (data) {
			thisObject.attr('data-toggle','tooltip');
			thisObject.attr('title',data);
		})
})
});
JobTitleAdapter.method('getGeneralDuites',function(){
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req': '' , 'mod': 'admin_jobs', 'sa': 'getGeneralDuites'}, function (data) {
		$("#general_duties").html(data);
	})
});
JobTitleAdapter.method('getTechnicalDuites',function(){
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req':''  , 'mod': 'admin_jobs', 'sa': 'getTechnicalDuites'}, function (data) {
		$("#technical_duties").html(data);
	})
});
JobTitleAdapter.method('getStrategicDuites',function(){
$.post(this.moduleRelativeURL, {'a': 'ca', 'req': '' , 'mod': 'admin_jobs', 'sa': 'getStrategicDuites'}, function (data) {
		$("#strategic_duties").html(data);
	})
});

JobTitleAdapter.method('print',function(){
	$('input').prop('readonly', true);
	$('textarea').prop('readonly', true);
	$('#Grade').hide();
	$('#tabEmploymentStatus').hide();
	$('button').hide();
	window.print();
	$('input').prop('readonly', false);
	$('textarea').prop('readonly', false);
	$('#Grade').show();
	$('#tabEmploymentStatus').show();
	$('button').show();
});

JobTitleAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=80';
});

/**
 * BenefitsAdapter
 */

function GradeBenefitsAdapter(endPoint) {
	this.initAdapter(endPoint);
}

GradeBenefitsAdapter.inherits(AdapterBase);



GradeBenefitsAdapter.method('getDataMapping', function() {
	return [
		"id",
		"item",
	];
});

GradeBenefitsAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" ,"bVisible":false},
		{ "sTitle": "Item" },
	];
});

GradeBenefitsAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden","validation":""}],
		[ "grade", {"label":"Job Grade","type":"text"}],
		[ "item", {"label":"Item Name","type":"text", "required":true ,"validation":"notEmpty"}],
		[ "type", {"label":"Item Type","type":"select2", "required":true ,"source":[['Allowance','Allowance'],['Advantage','Advantage']]}],
		[ "value", {"label":"Value","type":"text", "required":true ,"validation":"number"}],
		[ "depreciation_time", {"label":"Depreciation Time","type":"text", "required":true ,"validation":"none"}],
		[ "depreciation_percentage", {"label":"Depreciation Percentage","type":"text", "required":true ,"validation":"none"}],
		[ "image", {"label":"Item Image","type":"fileupload","validation":"none"}],
	];
});

GradeBenefitsAdapter.method('addNew', function() {
	$("#tabGradeBenefits").trigger("click");
	modJs.renderForm();
	window.stop();
});

GradeBenefitsAdapter.method('editNew', function(id) {
	$("#tabGradeBenefits").trigger("click");
	modJs.edit(id);

});

GradeBenefitsAdapter.method('postRenderForm',function(){
	$("#field_grade").hide();
	$("#grade").attr("value",gradesession);
	$("#depreciation_time").after("<span>Months</span>");
	$("#depreciation_percentage").after("<span>Per Month</span>");
	$("#field_depreciation_time").val(0);
	$("#field_depreciation_percentage").val(0);
	$("#type").on('change', function () {
		if($("#type").val()=='Allowance'){
			$("#field_depreciation_time").hide();
			$("#field_depreciation_percentage").hide();
		}
		if($("#type").val()=='Advantage'){
			$("#field_depreciation_time").show();
			$("#field_depreciation_percentage").show();
		}
	})
});
GradeBenefitsAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=90';
});

/**
 * PayGradeAdapter
 */

function PayGradeAdapter(endPoint) {
	this.initAdapter(endPoint);
}

PayGradeAdapter.inherits(AdapterBase);



PayGradeAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	];
});

PayGradeAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Name" },
	];
});

PayGradeAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "name", {"label":"Grade Name","type":"text","validation":""}],
	        [ "min", {"label":"Min","type":"text","validation":""}],
	        [ "Q1", {"label":"Q1","type":"text","validation":""}],
	        [ "Q2", {"label":"Q2","type":"text","validation":""}],
	        [ "Q3", {"label":"Q3","type":"text","validation":""}],
	        [ "mid", {"label":"Mid","type":"text","validation":""}],
	        [ "Q4", {"label":"Q4","type":"text","validation":""}],
	        [ "Q5", {"label":"Q5","type":"text","validation":""}],
	        [ "Q6", {"label":"Q6","type":"text","validation":""}],
	        [ "max", {"label":"Max","type":"text","validation":""}],
	];
});

PayGradeAdapter.method('doCustomValidation', function(params) {
	try{
		if(parseFloat(params.min_salary)>parseFloat(params.max_salary)){
			return "Min Salary should be smaller than Max Salary";
		}
	}catch(e){
		
	}
	return null;
});
PayGradeAdapter.method("postRenderForm", function(id,data) {
	$("#min").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');
	$("#Q1").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');
	$("#Q2").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');
	$("#Q3").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');
	$("#mid").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');
	$("#Q4").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');
	$("#Q5").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');
	$("#Q6").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');
	$("#max").after('<div style="margin-top: -20px;margin-left: 535px;">EGP</div>');

});

PayGradeAdapter.method('getActionButtonsHtml', function(id) {
	var html = '<div style="width:110px;"><img class="tableActionButton" src="_BASE_images/edit.png" style="cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJs.edit(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/edit.png" style="display:none;cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJs.edit(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/delete.png" style="margin-left:15px;cursor:pointer;" rel="tooltip" title="Archive Employee" onclick="modJs.deleteEmployee(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/view.png" style="margin-left:15px;cursor:pointer;" rel="tooltip" title="View" onclick="modJs.viewGrade(_id_);return false;"></img></div>';
	html = html.replace(/_id_/g,id);
	html = html.replace(/_BASE_/g,this.baseUrl);
	return html;
});

PayGradeAdapter.method('viewGrade', function(id) {
	$.post(this.moduleRelativeURL, {'a': 'ca', 'req': id , 'mod': 'admin_jobs', 'sa': 'getGradeDetails'}, function (data) {
	$("#PayGrades").html(data);
	})
});
/**
 * SubPayGradeAdapter
 */

function PaySubGradeAdapter(endPoint) {
	this.initAdapter(endPoint);
}

PaySubGradeAdapter.inherits(AdapterBase);



PaySubGradeAdapter.method('getDataMapping', function() {
	return [
		"id",
	];
});

PaySubGradeAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" ,"bVisible":false},
	];
});

PaySubGradeAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden"}],
		[ "paygrade_id", {"label":"Parent Grade","type":"select2","remote-source":["PayGrades","id","code"]}],
		[ "code", {"label":"Code","type":"text","required":true}],
		[ "gross_salary", {"label":"Gross Salary","type":"text","required":true,"validation":"float"}],
	];
});

PaySubGradeAdapter.method('doCustomValidation', function(params) {
	try{
		if(parseFloat(params.min_salary)>parseFloat(params.max_salary)){
			return "Min Salary should be smaller than Max Salary";
		}
	}catch(e){

	}
	return null;
});


/**
 * EmploymentStatusAdapter
 */

function EmploymentStatusAdapter(endPoint) {
	this.initAdapter(endPoint);
}

EmploymentStatusAdapter.inherits(AdapterBase);



EmploymentStatusAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	        "description"
	];
});

EmploymentStatusAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" },
			{ "sTitle": "Name" },
			{ "sTitle": "Description"}
	];
});

EmploymentStatusAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "name", {"label":"Employment Status","type":"text"}],
	        [ "description",  {"label":"Description","type":"textarea","validation":""}]
	];
});
/**
 * JobTitlesNamesAdapter
 */

function JobTitlesNamesAdapter(endPoint) {
	this.initAdapter(endPoint);
}

JobTitlesNamesAdapter.inherits(AdapterBase);

JobTitlesNamesAdapter.method('getDataMapping', function() {
	return [
		"id",
		"name",
	];
});

JobTitlesNamesAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" },
		{ "sTitle": "Name" },
	];
});

JobTitlesNamesAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden"}],
		[ "name", {"label":"Job Title","type":"text"}],
	];
});

