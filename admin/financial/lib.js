/**
 * Author: Ahmed Hagag
 */

function TaxesAdapter(endPoint) {
	this.initAdapter(endPoint);
}

TaxesAdapter.inherits(AdapterBase);


TaxesAdapter.method('getDataMapping', function() {
	return [
	        "id",
	        "name",
	        "value",
	];
});

TaxesAdapter.method('getHeaders', function() {
	return [
			{ "sTitle": "ID" },
			{ "sTitle": "Factor Name" },
			{ "sTitle": "Factor Value" }
	];
});

TaxesAdapter.method('getFormFields', function() {
	return [
	        [ "id", {"label":"ID","type":"hidden","validation":""}],
	        [ "name", {"label":"Factor Name","type":"text","require":true}],
	        [ "value", {"label":"Factor Value","type":"text","require":true}],
	    ];
});

/**
 * Author: Ahmed Hagag
 */

function TaxesSegmentsAdapter(endPoint) {
	this.initAdapter(endPoint);
}

TaxesSegmentsAdapter.inherits(AdapterBase);


TaxesSegmentsAdapter.method('getDataMapping', function() {
	return [
		"id",
		"name",
		"min_salary",
		"max_salary"
	];
});

TaxesSegmentsAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" },
		{ "sTitle": "Segment Name" },
		{ "sTitle": "Minimum Salary" },
		{ "sTitle": "Maximum Salary" }
	];
});

TaxesSegmentsAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden","validation":""}],
		[ "name", {"label":"Segment Name","type":"text","require":true}],
		[ "min_salary", {"label":"Minimum Salary","type":"text","require":true,"validation":"postiveNumber"}],
		[ "max_salary", {"label":"Maximum Salary","type":"text","require":true,"validation":"postiveNumber"}],
	];
});

/**
 * Author: Ahmed Hagag
 */
function BanksAdapter(endPoint) {
	this.initAdapter(endPoint);
}

BanksAdapter.inherits(AdapterBase);


BanksAdapter.method('getDataMapping', function() {
	return [
		"id",
		"name",
	];
});

BanksAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" },
		{ "sTitle": "Bank Name" },
	];
});

BanksAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden","validation":""}],
		[ "name", {"label":"Bank Name","type":"text","require":true}],
	];
});

/**
 * Author: Ahmed Hagag
 */

function BanksBranchesAdapter(endPoint) {
	this.initAdapter(endPoint);
}

BanksBranchesAdapter.inherits(AdapterBase);


BanksBranchesAdapter.method('getDataMapping', function() {
	return [
		"id",
		"bank",
		"name",
	];
});

BanksBranchesAdapter.method('getHeaders', function() {
	return [
		{ "sTitle": "ID" },
		{ "sTitle": "Bank" },
		{ "sTitle": "Branch Name" },
	];
});

BanksBranchesAdapter.method('getFormFields', function() {
	return [
		[ "id", {"label":"ID","type":"hidden","validation":""}],
		[ "name", {"label":"Branch Name","type":"text","require":true}],
		[ "bank", {"label":"Bank Name","type":"select","require":true,"remote-source":["Banks","id","name"]}],
	];
});


