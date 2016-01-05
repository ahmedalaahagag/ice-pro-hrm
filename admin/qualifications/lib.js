/**
 * Author: Ahmed Alaa Hagag
 */


/**
 * SkillAdapter
 */

function SkillAdapter(endPoint) {
	this.initAdapter(endPoint);
}

SkillAdapter.inherits(AdapterBase);

SkillAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	];
});

SkillAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID","bVisible":false },
			{ "sTitle": "Name" },
	];
});

SkillAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "name", {"label":"Name","type":"text"}],
	];
});

SkillAdapter.method('getHelpLink', function () {
	return 'http://blog.icehrm.com/?page_id=83';
});



/**
 * EducationAdapter
 */

function EducationAdapter(endPoint) {
	this.initAdapter(endPoint);
}

EducationAdapter.inherits(AdapterBase);



EducationAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	];
});

EducationAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID","bVisible":false },
			{ "sTitle": "Name" },
	];
});

EducationAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "name", {"label":"Name","type":"text"}],
	];
});


/**
 * InstitutionsAdapter
 */

function InstitutionsAdapter(endPoint) {
	this.initAdapter(endPoint);
}

InstitutionsAdapter.inherits(AdapterBase);



InstitutionsAdapter.method('getDataMapping', function() {
	return [
		"id",
		"name",
	];
});

InstitutionsAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID","bVisible":false },
		{ "sTitle": "Name" },
	];
});

InstitutionsAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden"}],
		[ "name", {"label":"Name","type":"text"}],
	];
});





/**
 * CertificationAdapter
 */

function CertificationAdapter(endPoint) {
	this.initAdapter(endPoint);
}

CertificationAdapter.inherits(AdapterBase);



CertificationAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	];
});

CertificationAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Name" },
	];
});

CertificationAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "name", {"label":"Name","type":"text"}],
	];
});



/**
 * LanguageAdapter
 */

function LanguageAdapter(endPoint) {
	this.initAdapter(endPoint);
}

LanguageAdapter.inherits(AdapterBase);



LanguageAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	];
});

LanguageAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" ,"bVisible":false},
			{ "sTitle": "Name" },
	];
});

LanguageAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden"}],
	        [ "name", {"label":"Name","type":"text"}],
	];
});


/**
 * DutiesAdapter
 */

function DutiesAdapter(endPoint) {
	this.initAdapter(endPoint);
}

DutiesAdapter.inherits(AdapterBase);

DutiesAdapter.method('getDataMapping', function() {
	return [
		"id",
		"name"
	];
});

DutiesAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID","bVisible":false },
		{ "sTitle": "Name" },
	];
});

DutiesAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden"}],
		[ "name", {"label":"Name","type":"text"}],
		[ "type", {"label":"Type","type":"select","source":[["1","General Duties"],["2","Strategic Duties"],["3","Technical Duties"]]}],
		[ "description", {"label":"Description","type":"textarea",validation:"none"}]
	];
});

DutiesAdapter.method('getHelpLink', function () {
});
