/**
 * Author: Thilina Hasantha
 */

function SubProfileEnabledAdapterBase(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

SubProfileEnabledAdapterBase.inherits(AdapterBase);

SubProfileEnabledAdapterBase.method('isSubProfileTable', function() {
    if(this.user.user_level == "Admin"){
        return false;
    }else{
        return true;
    }

});

function EmployeeAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
    this.fieldNameMap = {};
    this.hiddenFields = {};
    this.tableFields = {};
    this.formOnlyFields = {};
    this.customFields = [];
}

EmployeeAdapter.inherits(SubProfileEnabledAdapterBase);

EmployeeAdapter.method('setFieldNameMap', function(fields) {
    var field;
    for(var i=0;i<fields.length;i++){
        field = fields[i];
        this.fieldNameMap[field.name] = field;
        if(field.display == "Hidden"){
            this.hiddenFields[field.name] = field;
        }else{
            if(field.display == "Table and Form"){
                this.tableFields[field.name] = field;
            }else{
                this.formOnlyFields[field.name] = field;
            }

        }
    }
});

EmployeeAdapter.method('getCustomTableParams', function() {
    var that = this;
    var dataTableParams = {
        "aoColumnDefs": [
            {
                "fnRender": function(data, cell){
                    return that.preProcessRemoteTableData(data, cell, 1)
                } ,
                "aTargets": [1]
            },
            {
                "fnRender": that.getActionButtons,
                "aTargets": [that.getDataMapping().length]
            }
        ]
    };
    return dataTableParams;
});

EmployeeAdapter.method('preProcessRemoteTableData', function(data, cell, id) {
    if(id == 1){
        var tmp = '<img src="_img_" class="img-circle" style="width:45px;height: 45px;" alt="User Image">';
        return tmp.replace('_img_',cell);
    }
    var tmp = '<img src="_img_" class="img-circle" style="width:45px;height: 45px;" alt="User Image">';
    return tmp.replace('_img_',cell);
});

EmployeeAdapter.method('getTableHTMLTemplate', function() {
    return '<div class="box-body table-responsive"><table cellpadding="0" cellspacing="0" border="0" class="table table-striped" id="grid"></table></div>';
});


EmployeeAdapter.method('setCustomFields', function(fields) {
    var field, parsed;
    for(var i=0;i<fields.length;i++){
        field = fields[i];
        if(field.display != "Hidden" && field.data != "" && field.data != undefined){
            try{
                parsed = JSON.parse(field.data);
                if(parsed == undefined || parsed == null){
                    continue;
                }else if(parsed.length != 2){
                    continue;
                }else if(parsed[1].type == undefined || parsed[1].type == null){
                    continue;
                }
                this.customFields.push(parsed);
            }catch(e){

            }
        }
    }
});

EmployeeAdapter.method('getTableFields', function() {
    var tableFields = [
        "id",
        "image",
        "employee_id",
        "first_name",
        "last_name",
        "mobile_phone",
        "department",
        "gender",
        "supervisor",
    ];
    return tableFields;
});

EmployeeAdapter.method('getDataMapping', function() {
    var tableFields = this.getTableFields();

    var newTableFields = [];
    for(var i=0;i<tableFields.length;i++){
        if((this.hiddenFields[tableFields[i]] == undefined || this.hiddenFields[tableFields[i]] == null )&&
            (this.formOnlyFields[tableFields[i]] == undefined || this.formOnlyFields[tableFields[i]] == null )){
            newTableFields.push(tableFields[i]);
        }
    }
    return newTableFields;
});

EmployeeAdapter.method('getHeaders', function() {
    var tableFields = this.getTableFields();
    var headers =  [
        { "sTitle": "ID","bVisible":false },
        { "sTitle": "" ,"bSortable":false}
    ];
    var title = "";

    for(var i=0;i<tableFields.length;i++){
        if((this.hiddenFields[tableFields[i]] == undefined || this.hiddenFields[tableFields[i]] == null )&&
            (this.formOnlyFields[tableFields[i]] == undefined || this.formOnlyFields[tableFields[i]] == null )){
            if(this.fieldNameMap[tableFields[i]] != undefined && this.fieldNameMap[tableFields[i]] != null){
                title = this.fieldNameMap[tableFields[i]].textMapped;
                if(title == undefined || title == null || title == ""){
                    headers.push({ "sTitle": title,"bSortable":false});
                }else{
                    headers.push({ "sTitle": title});
                }

            }

        }
    }

    return headers;
});

EmployeeAdapter.method('getFormFields', function() {

    var newFields = [];
    var tempField, title;
    var compArray = [["Elementary Proficiency","Elementary Proficiency"],
		["Limited Working Proficiency","Limited Working Proficiency"],
		["Professional Working Proficiency","Professional Working Proficiency"],
		["Full Professional Proficiency","Full Professional Proficiency"],
		["Native or Bilingual Proficiency","Native or Bilingual Proficiency"]];
    var fields = [
            [ "id", {"label":"ID","type":"hidden","validation":""}],
	        [ "employee_id", {"label":"Employee Number","type":"text","validation":""}],
	        [ "first_name", {"label":"First Name","type":"text","validation":""}],
	        [ "middle_name", {"label":"Middle Name","type":"text","validation":"none"}],
	        [ "last_name", {"label":"Last Name","type":"text","validation":""}],
	        [ "nationality", {"label":"Nationality","type":"select2","remote-source":["Nationality","id","name"]}],
	        [ "birthday", {"label":"Date of Birth","type":"date","validation":""}],
	        [ "gender", {"label":"Gender","type":"select","source":[["Male","Male"],["Female","Female"]]}],
	        [ "marital_status", {"label":"Marital Status","type":"select","source":[["Married","Married"],["Single","Single"],["Divorced","Divorced"],["Widowed","Widowed"],["Other","Other"]]}],
			[ "military_status", {"label":"Military Status","type":"select","source":[["Completed","Completed"],["NotApplied","Not Applied"],["Exempted","Exempted"]]}],
			[ "id_number", {"label":"ID Number","type":"text", "required":true }],
			[ "id_expdate", {"label":"ID Expire Date","type":"date", "required":true }],
			[ "postal_code", {"label":"Postal/Zip Code","type":"text","validation":"none"}],
			[ "home_phone", {"label":"Home Phone","type":"text","validation":"none"}],
			[ "mobile_phone", {"label":"Mobile Phone","type":"text","validation":"none"}],
			[ "work_phone", {"label":"Work Phone","type":"text","validation":"none"}],
			[ "work_email", {"label":"Work Email","type":"text","validation":"emailOrEmpty"}],
			[ "address1", {"label":"Address Line 1","type":"text","validation":"none"}],
			[ "address2", {"label":"Address Line 2","type":"text","validation":"none"}],
			[ "city", {"label":"City","type":"text","validation":"none"}],
			[ "country", {"label":"Country","type":"select2","remote-source":["Country","code","name"]}],
			[ "province", {"label":"Province","type":"select2","allow-null":true,"null-label":'None',"remote-source":["Province","id","name"]}],
            [ "private_email", {"label":"Private Email","type":"text","validation":"emailOrEmpty"}],
			[ "car_owner", {"label":"Car Owner?","type":"select","validation":"","source":[["Yes","Yes"],["No","No"]]}],
			[ "driving_license", {"label":"Driving License No","type":"text","validation":"none","name":"dl"}],
			[ "driving_license_exp_date", {"label":"License Exp Date","type":"date","validation":"none"}],
			[ "bank_account", {"label":"Bank Account Number","type":"text","validation":"none"}],
			[ "bank", {"label":"Bank","type":"select","validation":"none","remote-source":["Banks","id","name"]}],
			[ "bank_branch", {"label":"Bank Branch","type":"select","validation":"none"}],
			[ "contract_startdate", {"label":"Contract Signature Date","type":"date","require":true}],
			[ "contract_enddate", {"label":"Contract End Date","type":"date","require":true}],
	        [ "employment_status", {"label":"Employment Status","type":"select2","remote-source":["EmploymentStatus","id","name"]}],
			[ "job_title", {"label":"Job Title","type":"select2","remote-source":["JobTitles","id","name"]}],
	        [ "pay_grade", {"label":"Pay Grade Level","type":"select2","allow-null":true,"source":[["min","Min"],["Q1","Q1"],["Q2","Q2"],["Q3","Q3"],["mid","Mid"],["Q4","Q4"],["Q5","Q5"],["Q6","Q6"],["max","Max"]]}],
	        [ "salary", {"label":"Salary","type":"text"}],
	        [ "gross_salary", {"label":"Salary","type":"text"}],
	        [ "total_salaries", {"label":"Total","type":"text"}],
	        [ "joined_date", {"label":"Joined Date","type":"date","validation":""}],
	        [ "department", {"label":"Department","type":"select2","remote-source":["CompanyStructure","id","title"]}],
	        [ "supervisor", {"label":"Supervisor","type":"select2","allow-null":true,"remote-source":["Employee","id","first_name+last_name"]}],
            [ "notes", {"label":"Notes","type":"datagroup",
            "form":[
                [ "note", {"label":"Note","type":"textarea","validation":""}]
            ],
            "html":'<div id="#_id_#" class="panel panel-default"><div class="panel-body">#_delete_##_edit_#<span style="color:#999;font-size:13px;font-weight:bold">Note</span><hr/>#_note_#</div></div>',
            "validation":"none",
            "sort-function":function (a,b){
                var t1 = Date.parse(a.date).getTime();
                var t2 = Date.parse(b.date).getTime();

                return (t1<t2);

            },
            "custom-validate-function":function (data){
                var res = {};
                res['valid'] = true;
                data['date'] = new Date().toString('d-MMM-yyyy hh:mm tt');
                res['params'] = data;
                return res;
            }

        }]
    ];

    for(var i=0;i<this.customFields.length;i++){
        fields.push(this.customFields[i]);
    }

    for(var i=0;i<fields.length;i++){
        tempField = fields[i];
        if(this.hiddenFields[tempField[0]] == undefined || this.hiddenFields[tempField[0]] == null ){
            if(this.fieldNameMap[tempField[0]] != undefined && this.fieldNameMap[tempField[0]] != null){
                title = this.fieldNameMap[tempField[0]].textMapped;
                tempField[1]['label'] = title;
            }
            newFields.push(tempField);
        }
    }

    return newFields;

});


EmployeeAdapter.method('getFilters', function() {
    return [
        [ "job_title", {"label":"Job Title","type":"select2","allow-null":true,"null-label":"All Job Titles","remote-source":["JobTitles","id","name"]}],
        [ "department", {"label":"Department","type":"select2","allow-null":true,"null-label":"All Departments","remote-source":["CompanyStructure","id","title"]}],
        [ "supervisor", {"label":"Supervisor","type":"select2","allow-null":true,"null-label":"Anyone","remote-source":["Employee","id","first_name+last_name"]}]
    ];
});

EmployeeAdapter.method('getActionButtonsHtml', function(id) {
    var html = '<div style="width:110px;"><img class="tableActionButton" src="_BASE_images/user.png" style="cursor:pointer;" rel="tooltip" title="Login as this Employee" onclick="modJs.setAdminProfile(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/view.png" style="cursor:pointer;margin-left:15px;" rel="tooltip" title="View" onclick="modJs.view(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/edit.png" style="display:none;cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJs.edit(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/delete.png" style="margin-left:15px;cursor:pointer;" rel="tooltip" title="Terminate Employee" onclick="modJs.deleteEmployee(_id_);return false;"></img></div>';
    html = html.replace(/_id_/g,id);
    html = html.replace(/_BASE_/g,this.baseUrl);
    return html;
});

EmployeeAdapter.method('getHelpLink', function () {
    return 'http://blog.icehrm.com/?page_id=69';
});

EmployeeAdapter.method('postRenderForm', function(callBackData) {
    $("#field_salary").hide();
    $("#field_gross_salary").hide();
    $("#field_total_salaries").hide();
    $("#field_bank_branch").hide();
    if(!$("#id").val()){
        $("select").prepend("<option value=''>Please select an option</option>").val('');
        $(".select2-offscreen").select2("val", "");
    }
    $("label[for='pay_grade']").text("Pay Grade Level*");

});

EmployeeAdapter.method('getBankBaranches',function(){
    var bank = $("#bank").val();
    $.post(this.moduleRelativeURL, {'a': 'ca', 'req': bank , 'mod': 'admin_employees', 'sa': 'getBankBaranches'}, function (data) {
        $("#bank_branch").html(data);
        $("#field_bank_branch").show();
    })
});

EmployeeAdapter.method('getSalaryByGrade',function(jobtitleid,grade){
    var object = {"jobtitle":jobtitleid,"grade":grade};
    var reqJson = JSON.stringify(object);
    var callBackData = []
    callBackData['callBackData'] = [];
    callBackData['callBackSuccess'] = 'getSalaryByGradeSuccessCallBack';
    callBackData['callBackFail'] = 'getSalaryByGradeFailCallBack';
    this.customAction('getSalaryByGrade','admin_employees',reqJson,callBackData);
});

EmployeeAdapter.method('getSalaryByGradeSuccessCallBack', function(callBackData) {
    $("#salary").attr('value',callBackData[0]);
    $("#gross_salary").attr('value',callBackData[1]);
    $("#total_salaries").attr('value',callBackData[2]);
});
EmployeeAdapter.method('saveSuccessItemCallback', function(data) {
    this.lastSavedEmployee = data;
    if(this.currentId == null){
       /* $('#createUserModel').modal('show');*/
    }

});

EmployeeAdapter.method('closeCreateUser', function() {
    $('#createUserModel').modal('hide');
});

EmployeeAdapter.method('createUser', function() {
    var data = {};
    data['employee'] = this.lastSavedEmployee.id;
    data['user_level'] = "Employee";
    data['email'] = this.lastSavedEmployee.work_email;
    data['username'] = this.lastSavedEmployee.work_email.split("@")[0];
    var url = this.getCustomUrl('?g=admin&n=users&m=admin_Admin&action=new&object='+Base64.encodeURI(JSON.stringify(data)));
    top.location.href = url;
});

EmployeeAdapter.method('deleteEmployee', function(id) {

    if (confirm('Are you sure you want to archive this employee? Data for this employee will be saved to an archive table. But you will not be able to covert the archived employee data into a normal employee.')) {
        //Archive
    } else {
        return;
    }

    var params = {};
    params['id'] = id;
    var reqJson = JSON.stringify(params);
    var callBackData = [];
    callBackData['callBackData'] = [];
    callBackData['callBackSuccess'] = 'deleteEmployeeSuccessCallback';
    callBackData['callBackFail'] = 'deleteEmployeeFailCallback';

    this.customAction('deleteEmployee','admin_employees',reqJson,callBackData);
});

EmployeeAdapter.method('changeProvince', function(country) {
    var table='Province';
    $.post(this.moduleRelativeURL,{'a':'loadSub','t': table  ,'sm':null , 'subSet':'country','subSetValue':country.val()},function(data){
        if(data.status == "SUCCESS"){
            modJs.changeSelect2Options('province',data);
        }else{
            var select2 = $("select#"+table);
            select2.find('option').remove();
            options ="<option value='NULL'>None</option>";
            select2.html(options);
        }
    },"JSON");
});

EmployeeAdapter.method('deleteEmployeeSuccessCallback', function(callBackData) {
    this.showMessage("Delete Success","Employee deleted.");
    this.get([]);
});


EmployeeAdapter.method('deleteEmployeeFailCallback', function(callBackData) {
    this.showMessage("Error occured while deleting Employee", callBackData);
});


EmployeeAdapter.method('terminateEmployee', function(id) {

    if (confirm('Are you sure you want to terminate this employee contract? You will still be able to access all details of this employee.')) {
        //Terminate
    } else {
        return;
    }

    var params = {};
    params['id'] = id;
    var reqJson = JSON.stringify(params);
    var callBackData = [];
    callBackData['callBackData'] = [];
    callBackData['callBackSuccess'] = 'terminateEmployeeSuccessCallback';
    callBackData['callBackFail'] = 'terminateEmployeeFailCallback';
    this.customAction('terminateEmployee','admin_employees',reqJson,callBackData);
});


EmployeeAdapter.method('terminateEmployeeSuccessCallback', function(callBackData) {
    this.showMessage("Success","Employee contract terminated. You can find terminated employee information under Terminated Employees menu.");
    this.get([]);
});


EmployeeAdapter.method('terminateEmployeeFailCallback', function(callBackData) {
    this.showMessage("Error occured while terminating Employee", callBackData);
});


EmployeeAdapter.method('activateEmployee', function(id) {

    if (confirm('Are you sure you want to re-activate this employee contract?')) {
        //Terminate
    } else {
        return;
    }

    var params = {};
    params['id'] = id;
    var reqJson = JSON.stringify(params);
    var callBackData = [];
    callBackData['callBackData'] = [];
    callBackData['callBackSuccess'] = 'activateEmployeeSuccessCallback';
    callBackData['callBackFail'] = 'activateEmployeeFailCallback';

    this.customAction('activateEmployee','admin_employees',reqJson,callBackData);
});


EmployeeAdapter.method('activateEmployeeSuccessCallback', function(callBackData) {
    this.showMessage("Success","Employee contract re-activated.");
    this.get([]);
});


EmployeeAdapter.method('activateEmployeeFailCallback', function(callBackData) {
    this.showMessage("Error occured while activating Employee", callBackData);
});


EmployeeAdapter.method('view', function(id) {
    var that = this;
    this.currentId = id;
    var sourceMappingJson = JSON.stringify(this.getSourceMapping());
    var object = {"id":id, "map":sourceMappingJson};
    var reqJson = JSON.stringify(object);

    var callBackData = [];
    callBackData['callBackData'] = [];
    callBackData['callBackSuccess'] = 'renderEmployee';
    callBackData['callBackFail'] = 'viewFailCallBack';
    this.customAction('get','modules_employees',reqJson,callBackData);
});

EmployeeAdapter.method('getEmergencyContacts', function(id) {
var object = {"id":id};
var reqJson = JSON.stringify(object);
var callBackData = [];
callBackData['callBackData'] = [];
callBackData['callBackSuccess'] = 'getEmergencyContactsCallBack';
callBackData['callBackFail'] = 'modEmployeeDeleteProfileImageCallBack';
this.customAction('getEmergencyContacts','modules_employees',reqJson,callBackData);
});

EmployeeAdapter.method('getEmergencyContactsCallBack', function(data) {
});

EmployeeAdapter.method('viewFailCallBack', function(callBackData) {
    this.showMessage("Error","Error Occured while retriving candidate");
});

EmployeeAdapter.method('getEmergencyContacts', function(id) {
    var object = {"id":id};
    var reqJson = JSON.stringify(object);
    $.get(this.moduleRelativeURL, {'a': 'ca', 'req': id , 'mod': 'admin_employees', 'sa': 'getEmergencyContacts'}, function (callBackData) {
        console.log(callBackData);
        $("#EmergencyContact").html(callBackData);
    })
});

EmployeeAdapter.method('getDepentants', function(id) {
    var object = {"id":id};
    var reqJson = JSON.stringify(object);
    $.get(this.moduleRelativeURL, {'a': 'ca', 'req': id , 'mod': 'admin_employees', 'sa': 'getDepentants'}, function (callBackData) {
        console.log(callBackData);
        $("#Dependants").html(callBackData);
    })
});
EmployeeAdapter.method('getDoucments', function(id) {
    var object = {"id":id};
    var reqJson = JSON.stringify(object);
    $.get(this.moduleRelativeURL, {'a': 'ca', 'req': id , 'mod': 'admin_employees', 'sa': 'getDoucments'}, function (callBackData) {
        console.log(callBackData);
        $("#Doucments").html(callBackData);
    })
});

EmployeeAdapter.method('renderEmployee', function(data) {

   var title;
    var fields = this.getFormFields();
    var currentEmpId = data[1];
    var currentId = data[1];
    var userEmpId = data[2];
    data = data[0];
    this.currentEmployee = data;
    var html = this.getCustomTemplate('myDetails.html');

      for(var i=0;i<fields.length;i++) {
        if(this.fieldNameMap[fields[i][0]] != undefined && this.fieldNameMap[fields[i][0]] != null){
            title = this.fieldNameMap[fields[i][0]].textMapped;
            html = html.replace("#_label_"+fields[i][0]+"_#",title);
        }
    }

    html = html.replace(/#_.+_#/i,"");
    html = html.replace(/_id_/g,data.id);

    $("#"+this.getTableName()).html(html);

    for(var i=0;i<fields.length;i++) {
        $("#"+this.getTableName()+" #" + fields[i][0]).html(data[fields[i][0]]);
        $("#"+this.getTableName()+" #" + fields[i][0]+"_Name").html(data[fields[i][0]+"_Name"]);
    }

    var subordinates = "";
    for(var i=0;i<data.subordinates.length;i++){
        if(data.subordinates[i].first_name != undefined && data.subordinates[i].first_name != null){
            subordinates += data.subordinates[i].first_name+" ";
        }
        +data.subordinates[i].middle_name
        if(data.subordinates[i].middle_name != undefined && data.subordinates[i].middle_name != null && data.subordinates[i].middle_name != ""){
            subordinates += data.subordinates[i].middle_name+" ";
        }

        if(data.subordinates[i].last_name != undefined && data.subordinates[i].last_name != null && data.subordinates[i].last_name != ""){
            subordinates += data.subordinates[i].last_name;
        }
        subordinates += "<br/>";
    }

    $("#"+this.getTableName()+" #subordinates").html(subordinates);


    $("#"+this.getTableName()+" #name").html(data.first_name + " " + data.last_name);
    this.currentUserId = data.id;

    $("#"+this.getTableName()+" #profile_image_"+data.id).attr('src',data.image);



    this.cancel();

    this.getEmergencyContacts(data.id);
    this.getDepentants(data.id);
    this.getDoucments(data.id);



    modJs = this;
    modJs.subModJsList = new Array();



    modJs.subModJsList['tabEmployeeSkillSubTab'] = new EmployeeSubSkillsAdapter('EmployeeSkill','EmployeeSkillSubTab',{"employee":data.id});
    modJs.subModJsList['tabEmployeeSkillSubTab'].parent = this;

    modJs.subModJsList['tabEmployeeEducationSubTab'] = new EmployeeSubEducationAdapter('EmployeeEducation','EmployeeEducationSubTab',{"employee":data.id});
    modJs.subModJsList['tabEmployeeEducationSubTab'].parent = this;

    modJs.subModJsList['tabEmployeeCertificationSubTab'] = new EmployeeSubCertificationAdapter('EmployeeCertification','EmployeeCertificationSubTab',{"employee":data.id});
    modJs.subModJsList['tabEmployeeCertificationSubTab'].parent = this;

    modJs.subModJsList['tabEmployeeLanguageSubTab'] = new EmployeeSubLanguageAdapter('EmployeeLanguage','EmployeeLanguageSubTab',{"employee":data.id});
    modJs.subModJsList['tabEmployeeLanguageSubTab'].parent = this;

    modJs.subModJsList['tabEmployeeEmergencyContacts'] = new EmployeeEmergencyContactsAdapter('EmergencyContacts','tabEmployeeEmergencyContacts',{"employee":data.id});
    modJs.subModJsList['tabEmployeeEmergencyContacts'].parent = this;

    for (var prop in modJs.subModJsList) {
        if(modJs.subModJsList.hasOwnProperty(prop)){
            modJs.subModJsList[prop].setPermissions(this.permissions);
            modJs.subModJsList[prop].setFieldTemplates(this.fieldTemplates);
            modJs.subModJsList[prop].setTemplates(this.templates);
            modJs.subModJsList[prop].setCustomTemplates(this.customTemplates);
            modJs.subModJsList[prop].setEmailTemplates(this.emailTemplates);
            modJs.subModJsList[prop].setUser(this.user);
            modJs.subModJsList[prop].initFieldMasterData();
            modJs.subModJsList[prop].setBaseUrl(this.baseUrl);
            modJs.subModJsList[prop].setCurrentProfile(this.currentProfile);
            modJs.subModJsList[prop].setInstanceId(this.instanceId);
            modJs.subModJsList[prop].setGoogleAnalytics(ga);
            modJs.subModJsList[prop].setNoJSONRequests(this.noJSONRequests);
        }
    }

    modJs.subModJsList['tabEmployeeSkillSubTab'].setShowFormOnPopup(true);
    modJs.subModJsList['tabEmployeeSkillSubTab'].setShowAddNew(false);
    modJs.subModJsList['tabEmployeeSkillSubTab'].setShowCancel(false);
    modJs.subModJsList['tabEmployeeSkillSubTab'].get([]);

    modJs.subModJsList['tabEmployeeEducationSubTab'].setShowFormOnPopup(true);
    modJs.subModJsList['tabEmployeeEducationSubTab'].setShowAddNew(false);
    modJs.subModJsList['tabEmployeeEducationSubTab'].setShowCancel(false);
    modJs.subModJsList['tabEmployeeEducationSubTab'].get([]);

    modJs.subModJsList['tabEmployeeCertificationSubTab'].setShowFormOnPopup(true);
    modJs.subModJsList['tabEmployeeCertificationSubTab'].setShowAddNew(false);
    modJs.subModJsList['tabEmployeeCertificationSubTab'].setShowCancel(false);
    modJs.subModJsList['tabEmployeeCertificationSubTab'].get([]);

    modJs.subModJsList['tabEmployeeLanguageSubTab'].setShowFormOnPopup(true);
    modJs.subModJsList['tabEmployeeLanguageSubTab'].setShowAddNew(false);
    modJs.subModJsList['tabEmployeeLanguageSubTab'].setShowCancel(false);
    modJs.subModJsList['tabEmployeeLanguageSubTab'].get([]);

    modJs.subModJsList['tabEmployeeEmergencyContacts'].setShowFormOnPopup(true);
    modJs.subModJsList['tabEmployeeEmergencyContacts'].setShowAddNew(false);
    modJs.subModJsList['tabEmployeeEmergencyContacts'].setShowCancel(false);
    modJs.subModJsList['tabEmployeeEmergencyContacts'].get([]);

   $('#subModTab a').off().on('click',function (e) {
        e.preventDefault();
        $(this).tab('show');
    });


});

EmployeeAdapter.method('deleteProfileImage', function(empId) {
    var that = this;

    var req = {"id":empId};
    var reqJson = JSON.stringify(req);

    var callBackData = [];
    callBackData['callBackData'] = [];
    callBackData['callBackSuccess'] = 'modEmployeeDeleteProfileImageCallBack';
    callBackData['callBackFail'] = 'modEmployeeDeleteProfileImageCallBack';

    this.customAction('deleteProfileImage','modules_employees',reqJson,callBackData);
});

EmployeeAdapter.method('modEmployeeDeleteProfileImageCallBack', function(data) {
    //top.location.href = top.location.href;
});


/*
 * Terminated Employee
 */

function TerminatedEmployeesAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

TerminatedEmployeesAdapter.inherits(EmployeeAdapter);



TerminatedEmployeesAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        ];
});

TerminatedEmployeesAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" },
        { "sTitle": "Employee" },
        ];
});

/*TerminatedEmployeeAdapter.method('getFormFields', function() {
    return [
                [ "id", {"label":"ID","type":"hidden","validation":""}],
                [ "note", {"label":"Note","type":"textarea","validation":""}][ "employee_id", {"label":"Employee Number","type":"text","validation":""}],
                [ "first_name", {"label":"First Name","type":"text","validation":""}],
                [ "middle_name", {"label":"Middle Name","type":"text","validation":"none"}],
                [ "last_name", {"label":"Last Name","type":"text","validation":""}],
                [ "nationality", {"label":"Nationality","type":"select2","remote-source":["Nationality","id","name"]}],
                [ "birthday", {"label":"Date of Birth","type":"date","validation":""}],
                [ "gender", {"label":"Gender","type":"select","source":[["Male","Male"],["Female","Female"]]}],
                [ "marital_status", {"label":"Marital Status","type":"select","source":[["Married","Married"],["Single","Single"],["Divorced","Divorced"],["Widowed","Widowed"],["Other","Other"]]}],
                [ "ssn_num", {"label":"SSN/NRIC","type":"text","validation":"none"}],
                [ "nic_num", {"label":"NIC","type":"text","validation":"none"}],
                [ "other_id", {"label":"Other ID","type":"text","validation":"none"}],
                [ "driving_license", {"label":"Driving License No","type":"text","validation":"none"}],
                /*[ "driving_license_exp_date", {"label":"License Exp Date","type":"date","validation":"none"}],
                [ "employment_status", {"label":"Employment Status","type":"select2","remote-source":["EmploymentStatus","id","name"]}],
                [ "job_title", {"label":"Job Title","type":"select2","remote-source":["JobTitles","id","name"]}],
                [ "pay_grade", {"label":"Pay Grade","type":"select2","allow-null":true,"remote-source":["PayGrade","id","name"]}],
                [ "work_station_id", {"label":"Work Station Id","type":"text","validation":"none"}],
                [ "address1", {"label":"Address Line 1","type":"text","validation":"none"}],
                [ "address2", {"label":"Address Line 2","type":"text","validation":"none"}],
                [ "city", {"label":"City","type":"text","validation":"none"}],
                [ "country", {"label":"Country","type":"select2","remote-source":["Country","code","name"]}],
                [ "province", {"label":"Province","type":"select2","allow-null":true,"remote-source":["Province","id","name"]}],
                [ "postal_code", {"label":"Postal/Zip Code","type":"text","validation":"none"}],
                [ "home_phone", {"label":"Home Phone","type":"text","validation":"none"}],
                [ "mobile_phone", {"label":"Mobile Phone","type":"text","validation":"none"}],
                [ "work_phone", {"label":"Work Phone","type":"text","validation":"none"}],
                [ "work_email", {"label":"Work Email","type":"text","validation":"emailOrEmpty"}],
                [ "private_email", {"label":"Private Email","type":"text","validation":"emailOrEmpty"}],
                [ "joined_date", {"label":"Joined Date","type":"date","validation":""}],
                [ "confirmation_date", {"label":"Confirmation Date","type":"date","validation":"none"}],
                [ "termination_date", {"label":"Termination Date","type":"date","validation":"none"}],
                [ "department", {"label":"Department","type":"select2","remote-source":["CompanyStructure","id","title"]}],
                [ "supervisor", {"label":"Supervisor","type":"select2","allow-null":true,"remote-source":["Employee","id","first_name+last_name"]}],
                [ "notes", {"label":"Notes","type":"datagroup",
                    "form":[
            ],
            "html":'<div id="#_id_#" class="panel panel-default"><div class="panel-body">#_delete_##_edit_#<span style="color:#999;font-size:13px;font-weight:bold">Date: #_date_#</span><hr/>#_note_#</div></div>',
            "validation":"none",
            "sort-function":function (a,b){
                var t1 = Date.parse(a.date).getTime();
                var t2 = Date.parse(b.date).getTime();

                return (t1<t2);

            },
            "custom-validate-function":function (data){
                var res = {};
                res['valid'] = true;
                data['date'] = new Date().toString('d-MMM-yyyy hh:mm tt');
                res['params'] = data;
                return res;
            }

        }]
    ];
});*/
TerminatedEmployeesAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden","validation":""}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employees","id","first_name+last_name"]}],
    ]
});
TerminatedEmployeesAdapter.method('getFilters', function() {
    return [
         ];
});
TerminatedEmployeesAdapter.method('getActionButtonsHtml', function(id) {
    var html = '<div style="width:110px;"><img class="tableActionButton" src="_BASE_images/edit.png" style="cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJs.edit(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/edit.png" style="display:none;cursor:pointer;margin-left:15px;" rel="tooltip" title="Edit" onclick="modJs.edit(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/delete.png" style="margin-left:15px;cursor:pointer;" rel="tooltip" title="Archive Employee" onclick="modJs.deleteEmployee(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/redo.png" style="margin-left:15px;cursor:pointer;" rel="tooltip" title="Restore Employee" onclick="modJs.activateEmployee(_id_);return false;"></img></div>';
    html = html.replace(/_id_/g,id);
    html = html.replace(/_BASE_/g,this.baseUrl);
    return html;
});

TerminatedEmployeesAdapter.method('download', function(id) {
    var params = {'t':'ArchivedEmployee','sa':'downloadArchivedEmployee','mod':'admin=employees'};
    params['req'] = JSON.stringify({'id':id});
    var downloadUrl = modJs.getCustomActionUrl("ca",params);
    window.open(downloadUrl, '_blank');
});


/*
 * Archived Employee
 */

function ArchivedEmployeeAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

ArchivedEmployeeAdapter.inherits(SubProfileEnabledAdapterBase);



ArchivedEmployeeAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee_id",
        "first_name",
        "last_name",
        "work_email",
        "department",
        "gender",
        "supervisor"
    ];
});

ArchivedEmployeeAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" },
        { "sTitle": "Employee Number" },
        { "sTitle": "First Name" },
        { "sTitle": "Last Name"},
        { "sTitle": "Work Email"},
        { "sTitle": "Department"},
        { "sTitle": "Gender"},
        { "sTitle": "Supervisor"}
    ];
});

ArchivedEmployeeAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden","validation":""}],
        [ "employee_id", {"label":"Employee Number","type":"text","validation":""}],
        [ "first_name", {"label":"First Name","type":"text","validation":""}],
        [ "middle_name", {"label":"Middle Name","type":"text","validation":"none"}],
        [ "last_name", {"label":"Last Name","type":"text","validation":""}],
        [ "gender", {"label":"Gender","type":"select","source":[["Male","Male"],["Female","Female"]]}],
        [ "ssn_num", {"label":"SSN/NRIC","type":"text","validation":"none"}],
        [ "nic_num", {"label":"NIC","type":"text","validation":"none"}],
        [ "other_id", {"label":"Other ID","type":"text","validation":"none"}],
        [ "driving_license", {"label":"Driving License No","type":"text","validation":"none"}],
        [ "department", {"label":"Department","type":"select2","remote-source":["CompanyStructure","id","title"]}],
        [ "supervisor", {"label":"Supervisor","type":"select2","allow-null":true,"remote-source":["Employee","id","first_name+last_name"]}]
    ];
});

ArchivedEmployeeAdapter.method('getFilters', function() {
    return [
        [ "job_title", {"label":"Job Title","type":"select2","allow-null":true,"null-label":"All Job Titles","remote-source":["JobTitles","id","name"]}],
        [ "department", {"label":"Department","type":"select2","allow-null":true,"null-label":"All Departments","remote-source":["CompanyStructure","id","title"]}],
        [ "supervisor", {"label":"Supervisor","type":"select2","allow-null":true,"null-label":"Anyone","remote-source":["Employee","id","first_name+last_name"]}]
    ];
});

ArchivedEmployeeAdapter.method('getActionButtonsHtml', function(id) {

    var html = '<div style="width:110px;"><img class="tableActionButton" src="_BASE_images/download.png" style="cursor:pointer;" rel="tooltip" title="Download Archived Data" onclick="modJs.download(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/delete.png" style="margin-left:15px;cursor:pointer;" rel="tooltip" title="Remove Archived Data" onclick="modJs.deleteRow(_id_);return false;"></img></div>';
    html = html.replace(/_id_/g,id);
    html = html.replace(/_BASE_/g,this.baseUrl);
    return html;
});

ArchivedEmployeeAdapter.method('download', function(id) {

    var params = {'t':'ArchivedEmployee','sa':'downloadArchivedEmployee','mod':'admin=employees'};
    params['req'] = JSON.stringify({'id':id});
    var downloadUrl = modJs.getCustomActionUrl("ca",params);
    window.open(downloadUrl, '_blank');
});


/*
 * ==========================================================
 */


function EmployeeSkillAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeSkillAdapter.inherits(SubProfileEnabledAdapterBase);



EmployeeSkillAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "skill_id",
        "details"
    ];
});

EmployeeSkillAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" ,"bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Skill" },
        { "sTitle": "Details"}
    ];
});

EmployeeSkillAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
        [ "skill_id", {"label":"Skill","type":"select2","allow-null":true,"remote-source":["Skill","id","name"]}],
        [ "details",  {"label":"Details","type":"textarea","validation":""}]
    ];
});


EmployeeSkillAdapter.method('getFilters', function() {
    return [
        [ "employee", {"label":"Employee","type":"select2","allow-null":true,"null-label":"All Employees","remote-source":["Employee","id","first_name+last_name"]}],
        [ "skill_id", {"label":"Skill","type":"select2","allow-null":true,"null-label":"All Skills","remote-source":["Skill","id","name"]}]

    ];
});


/**
 * EmployeeEducationAdapter
 */

function EmployeeEducationAdapter (endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeEducationAdapter.inherits(SubProfileEnabledAdapterBase);



EmployeeEducationAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "education_id",
        "institute",
        "date_start",
        "date_end"
    ];
});

EmployeeEducationAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID", "bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Qualification" },
        { "sTitle": "Institute"},
        { "sTitle": "Start Date"},
        { "sTitle": "Completed On"},
    ];
});

EmployeeEducationAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
        [ "education_id", {"label":"Qualification","type":"select2","allow-null":false,"remote-source":["Education","id","name"]}],
        [ "institute",  {"label":"Institute","type":"text","validation":""}],
        [ "date_start", {"label":"Start Date","type":"date","validation":"none"}],
        [ "date_end", {"label":"Completed On","type":"date","validation":"none"}]
    ];
});


EmployeeEducationAdapter.method('getFilters', function() {
    return [
        [ "employee", {"label":"Employee","type":"select2","allow-null":true,"null-label":"All Employees","remote-source":["Employee","id","first_name+last_name"]}],
        [ "education_id", {"label":"Qualification","type":"select2","allow-null":true,"null-label":"All Qualifications","remote-source":["Education","id","name"]}]

    ];
});


/**
 * EmployeeCertificationAdapter
 */

function EmployeeCertificationAdapter (endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeCertificationAdapter.inherits(SubProfileEnabledAdapterBase);



EmployeeCertificationAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "certification_id",
        "institute",
        "date_start",
        "date_end"
    ];
});

EmployeeCertificationAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID","bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Certification" },
        { "sTitle": "Institute"},
        { "sTitle": "Granted On"},
        { "sTitle": "Valid Thru"}
    ];
});

EmployeeCertificationAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
        [ "certification_id", {"label":"Certification","type":"select2","allow-null":false,"remote-source":["Certification","id","name"]}],
        [ "institute",  {"label":"Institute","type":"text","validation":""}],
        [ "date_start", {"label":"Granted On","type":"date","validation":"none"}],
        [ "date_end", {"label":"Valid Thru","type":"date","validation":"none"}]
    ];
});


EmployeeCertificationAdapter.method('getFilters', function() {
    return [
        [ "employee", {"label":"Employee","type":"select2","allow-null":true,"null-label":"All Employees","remote-source":["Employee","id","first_name+last_name"]}],
        [ "certification_id", {"label":"Certification","type":"select2","allow-null":true,"null-label":"All Certifications","remote-source":["Certification","id","name"]}]

    ];
});



/**
 * EmployeeLanguageAdapter
 */

function EmployeeLanguageAdapter (endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeLanguageAdapter.inherits(SubProfileEnabledAdapterBase);



EmployeeLanguageAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "language_id",
        "reading",
        "speaking",
        "writing",
        "understanding"
    ];
});

EmployeeLanguageAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID", "bVisible":false },
        { "sTitle": "Employee" },
        { "sTitle": "Language" },
        { "sTitle": "Reading"},
        { "sTitle": "Speaking"},
        { "sTitle": "Writing"},
        { "sTitle": "Understanding"}
    ];
});

EmployeeLanguageAdapter.method('getFormFields', function() {

    var compArray = [["Elementary Proficiency","Elementary Proficiency"],
        ["Limited Working Proficiency","Limited Working Proficiency"],
        ["Professional Working Proficiency","Professional Working Proficiency"],
        ["Full Professional Proficiency","Full Professional Proficiency"],
        ["Native or Bilingual Proficiency","Native or Bilingual Proficiency"]];

    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
        [ "language_id", {"label":"Language","type":"select2","allow-null":false,"remote-source":["Language","id","name"]}],
        [ "reading", {"label":"Reading","type":"select","source":compArray}],
        [ "speaking", {"label":"Speaking","type":"select","source":compArray}],
        [ "writing", {"label":"Writing","type":"select","source":compArray}],
        [ "understanding", {"label":"Understanding","type":"select","source":compArray}]
    ];
});


EmployeeLanguageAdapter.method('getFilters', function() {
    return [
        [ "employee", {"label":"Employee","type":"select2","allow-null":true,"null-label":"All Employees","remote-source":["Employee","id","first_name+last_name"]}],
        [ "language_id", {"label":"Language","type":"select2","allow-null":true,"null-label":"All Languages","remote-source":["Language","id","name"]}]

    ];
});


/**
 * EmployeeDependentAdapter
 */


function EmployeeDependentAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeDependentAdapter.inherits(SubProfileEnabledAdapterBase);



EmployeeDependentAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "name",
        "relationship",
        "dob",
        "id_number"
    ];
});

EmployeeDependentAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" ,"bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Name" },
        { "sTitle": "Relationship"},
        { "sTitle": "Date of Birth"},
        { "sTitle": "Id Number"}
    ];
});

EmployeeDependentAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
        [ "name", {"label":"Name","type":"text","validation":""}],
        [ "relationship", {"label":"Relationship","type":"select","source":[["Child","Child"],["Spouse","Spouse"],["Parent","Parent"],["Other","Other"]]}],
        [ "dob", {"label":"Date of Birth","type":"date","validation":""}],
        [ "id_number", {"label":"Id Number","type":"text","validation":"none"}]
    ];
});

EmployeeDependentAdapter.method('getFilters', function() {
    return [
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}]

    ];
});

/*
 * EmergencyContactAdapter
 */


function EmergencyContactAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmergencyContactAdapter.inherits(SubProfileEnabledAdapterBase);



EmergencyContactAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "name",
        "relationship",
        "home_phone",
        "work_phone",
        "mobile_phone"
    ];
});

EmergencyContactAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" ,"bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Name" },
        { "sTitle": "Relationship"},
        { "sTitle": "Home Phone"},
        { "sTitle": "Work Phone"},
        { "sTitle": "Mobile Phone"}
    ];
});

EmergencyContactAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
        [ "name", {"label":"Name","type":"text","validation":""}],
        [ "relationship", {"label":"Relationship","type":"text","validation":"none"}],
        [ "home_phone", {"label":"Home Phone","type":"text","validation":"none"}],
        [ "work_phone", {"label":"Work Phone","type":"text","validation":"none"}],
        [ "mobile_phone", {"label":"Mobile Phone","type":"text","validation":"none"}]
    ];
});

EmergencyContactAdapter.method('getFilters', function() {
    return [
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}]

    ];
});

function SubEmergencyContactAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

SubEmergencyContactAdapter.inherits(SubProfileEnabledAdapterBase);



SubEmergencyContactAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "name",
        "relationship",
        "home_phone",
        "work_phone",
        "mobile_phone"
    ];
});

SubEmergencyContactAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" ,"bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Name" },
        { "sTitle": "Relationship"},
        { "sTitle": "Home Phone"},
        { "sTitle": "Work Phone"},
        { "sTitle": "Mobile Phone"}
    ];
});

SubEmergencyContactAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
        [ "name", {"label":"Name","type":"text","validation":""}],
        [ "relationship", {"label":"Relationship","type":"text","validation":"none"}],
        [ "home_phone", {"label":"Home Phone","type":"text","validation":"none"}],
        [ "work_phone", {"label":"Work Phone","type":"text","validation":"none"}],
        [ "mobile_phone", {"label":"Mobile Phone","type":"text","validation":"none"}]
    ];
});

SubEmergencyContactAdapter.method('getFilters', function() {
    return [
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}]

    ];
});

/*
 * EmployeeImmigrationAdapter
 */


function EmployeeImmigrationAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeImmigrationAdapter.inherits(SubProfileEnabledAdapterBase);



EmployeeImmigrationAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "document",
        "doc_number",
        "issued",
        "expiry",
        "status",
        "details"
    ];
});

EmployeeImmigrationAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" ,"bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Document","sClass": "columnMain"},
        { "sTitle": "Number"},
        { "sTitle": "Issued Date"},
        { "sTitle": "Expiry Date"},
        { "sTitle": "Status"},
        { "sTitle": "Details"}
    ];
});

EmployeeImmigrationAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}],
        [ "document", {"label":"Document","type":"select2","source":[["Passport","Passport"],["Visa","Visa"]]}],
        [ "doc_number", {"label":"Number","type":"text","validation":""}],
        [ "issued", {"label":"Issued Date","type":"date","validation":""}],
        [ "expiry", {"label":"Expiry Date","type":"date","validation":""}],
        [ "status", {"label":"Status","type":"text","validation":"none"}],
        [ "details", {"label":"Details","type":"textarea","validation":"none"}]
    ];
});

EmployeeImmigrationAdapter.method('getFilters', function() {
    return [
        [ "employee", {"label":"Employee","type":"select2","remote-source":["Employee","id","first_name+last_name"]}]

    ];
});




/**
 * @class EmployeeSubSkillsAdapter
 * @param endPoint
 * @param tab
 * @param filter
 * @param orderBy
 * @returns
 */


function EmployeeSubSkillsAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeSubSkillsAdapter.inherits(SubAdapterBase);



EmployeeSubSkillsAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "skill_id",
        "details"
    ];
});

EmployeeSubSkillsAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" ,"bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Skill" },
        { "sTitle": "Details"}
    ];
});

EmployeeSubSkillsAdapter.method('getFormFields', function() {

    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"hidden"}],
        [ "skill_id", {"label":"Skill","type":"select2","allow-null":true,"remote-source":["Skills","id","name"]}],
        [ "details",  {"label":"Details","type":"textarea","validation":""}]
    ];
});


EmployeeSubSkillsAdapter.method('forceInjectValuesBeforeSave', function(params) {
    params['employee'] = this.parent.currentId;
    return params;
});

EmployeeSubSkillsAdapter.method('getSubHeaderTitle', function() {
    var addBtn = '<button class="btn btn-small btn-success" onclick="modJs.subModJsList[\'tab'+this.tab+'\'].renderForm();" style="margin-right:10px;"><i class="fa fa-plus"></i></button>';
    return addBtn + "Skills";
});

EmployeeSubSkillsAdapter.method('getSubItemHtml', function(item, itemDelete, itemEdit) {
    var itemHtml = $('<a href="#" class="list-group-item"><h5 class="list-group-item-heading" style="font-weight:bold;">'+item[2]+itemDelete+itemEdit+'</h5><p class="list-group-item-text">'+nl2br(item[3])+'</p></a>');
    return itemHtml;
});

/**
 * @class EmployeeSubEducationAdapter
 * @param endPoint
 * @param tab
 * @param filter
 * @param orderBy
 * @returns
 */


function EmployeeSubEducationAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeSubEducationAdapter.inherits(SubAdapterBase);



EmployeeSubEducationAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "education_id",
        "institute",
        "date_start",
        "date_end"
    ];
});

EmployeeSubEducationAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID", "bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Qualification" },
        { "sTitle": "Institute"},
        { "sTitle": "Start Date"},
        { "sTitle": "Completed On"},
    ];
});

EmployeeSubEducationAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"hidden"}],
        [ "education_id", {"label":"Qualification","type":"select2","allow-null":false,"remote-source":["Education","id","name"]}],
        [ "institute",  {"label":"Institute","type":"text","validation":""}],
        [ "date_start", {"label":"Start Date","type":"date","validation":"none"}],
        [ "date_end", {"label":"Completed On","type":"date","validation":"none"}]
    ];
});


EmployeeSubEducationAdapter.method('forceInjectValuesBeforeSave', function(params) {
    params['employee'] = this.parent.currentId;
    return params;
});

EmployeeSubEducationAdapter.method('getSubHeaderTitle', function() {
    var addBtn = '<button class="btn btn-small btn-success" onclick="modJs.subModJsList[\'tab'+this.tab+'\'].renderForm();" style="margin-right:10px;"><i class="fa fa-plus"></i></button>';
    return addBtn + "Education";
});

EmployeeSubEducationAdapter.method('getSubItemHtml', function(item, itemDelete, itemEdit) {
    var start = "";
    try{
        stat = Date.parse(item[4]).toString('MMM d, yyyy');
    }catch(e){}

    var end = "";
    try{
        end = Date.parse(item[5]).toString('MMM d, yyyy');
    }catch(e){}
    //var itemHtml = $('<a href="#" class="list-group-item"><h5 class="list-group-item-heading" style="font-weight:bold;">'+item[2]+itemDelete+itemEdit+'</h5><p class="list-group-item-text">'+nl2br(item[3])+'</p></a>');
    var itemHtml = $('<a href="#" class="list-group-item"><h5 class="list-group-item-heading" style="font-weight:bold;">'+item[2]+itemDelete+itemEdit+'</h5><p class="list-group-item-text"><i class="fa fa-calendar"></i> Start: <b>'+start+'</b></p><p class="list-group-item-text">'+'<i class="fa fa-calendar"></i> Completed: <b>'+end+'</b></p><p class="list-group-item-text">'+'<i class="fa fa-building-o"></i> Institute: <b>'+item[3]+'</b></p></a>');
    return itemHtml;
});


/**
 * @class EmployeeSubCertificationAdapter
 * @param endPoint
 * @param tab
 * @param filter
 * @param orderBy
 * @returns
 */

function EmployeeSubCertificationAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeSubCertificationAdapter.inherits(SubAdapterBase);



EmployeeSubCertificationAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "certification_id",
        "institute",
        "date_start",
        "date_end"
    ];
});


EmployeeSubCertificationAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID","bVisible":false},
        { "sTitle": "Employee" },
        { "sTitle": "Certification" },
        { "sTitle": "Institute"},
        { "sTitle": "Granted On"},
        { "sTitle": "Valid Thru"}
    ];
});

EmployeeSubCertificationAdapter.method('getFormFields', function() {
    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"hidden"}],
        [ "certification_id", {"label":"Certification","type":"select2","allow-null":false,"remote-source":["Certification","id","name"]}],
        [ "institute",  {"label":"Institute","type":"text","validation":""}],
        [ "date_start", {"label":"Granted On","type":"date","validation":"none"}],
        [ "date_end", {"label":"Valid Thru","type":"date","validation":"none"}]
    ];
});


EmployeeSubCertificationAdapter.method('forceInjectValuesBeforeSave', function(params) {
    params['employee'] = this.parent.currentId;
    return params;
});

EmployeeSubCertificationAdapter.method('getSubHeaderTitle', function() {
    var addBtn = '<button class="btn btn-small btn-success" onclick="modJs.subModJsList[\'tab'+this.tab+'\'].renderForm();" style="margin-right:10px;"><i class="fa fa-plus"></i></button>';
    return addBtn + "Certifications";
});

EmployeeSubCertificationAdapter.method('getSubItemHtml', function(item, itemDelete, itemEdit) {
    var start = "";
    try{
        stat = Date.parse(item[4]).toString('MMM d, yyyy');
    }catch(e){}

    var end = "";
    try{
        end = Date.parse(item[5]).toString('MMM d, yyyy');
    }catch(e){}
    var itemHtml = $('<a href="#" class="list-group-item"><h5 class="list-group-item-heading" style="font-weight:bold;">'+item[2]+itemDelete+itemEdit+'</h5><p class="list-group-item-text"><i class="fa fa-calendar"></i> Granted On: <b>'+start+'</b></p><p class="list-group-item-text">'+'<i class="fa fa-calendar"></i> Valid Thru: <b>'+end+'</b></p><p class="list-group-item-text">'+'<i class="fa fa-building-o"></i> Institute: <b>'+item[3]+'</b></p></a>');
    return itemHtml;
});




/**
 * @class EmployeeSubLanguageAdapter
 * @param endPoint
 * @param tab
 * @param filter
 * @param orderBy
 * @returns
 */

function EmployeeSubLanguageAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeSubLanguageAdapter.inherits(SubAdapterBase);



EmployeeSubLanguageAdapter.method('getDataMapping', function() {
    return [
        "id",
        "employee",
        "language_id",
        "reading",
        "speaking",
        "writing",
        "understanding"
    ];
});

EmployeeSubLanguageAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID", "bVisible":false },
        { "sTitle": "Employee" },
        { "sTitle": "Language" },
        { "sTitle": "Reading"},
        { "sTitle": "Speaking"},
        { "sTitle": "Writing"},
        { "sTitle": "Understanding"}
    ];
});

EmployeeSubLanguageAdapter.method('getFormFields', function() {
    var compArray = [["Elementary Proficiency","Elementary Proficiency"],
        ["Limited Working Proficiency","Limited Working Proficiency"],
        ["Professional Working Proficiency","Professional Working Proficiency"],
        ["Full Professional Proficiency","Full Professional Proficiency"],
        ["Native or Bilingual Proficiency","Native or Bilingual Proficiency"]];

    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"hidden"}],
        [ "language_id", {"label":"Language","type":"select2","allow-null":false,"remote-source":["Language","id","name"]}],
        [ "reading", {"label":"Reading","type":"select","source":compArray}],
        [ "speaking", {"label":"Speaking","type":"select","source":compArray}],
        [ "writing", {"label":"Writing","type":"select","source":compArray}],
        [ "understanding", {"label":"Understanding","type":"select","source":compArray}]
    ];
});


EmployeeSubLanguageAdapter.method('forceInjectValuesBeforeSave', function(params) {
    params['employee'] = this.parent.currentId;
    return params;
});

EmployeeSubLanguageAdapter.method('getSubHeaderTitle', function() {
    var addBtn = '<button class="btn btn-small btn-success" onclick="modJs.subModJsList[\'tab'+this.tab+'\'].renderForm();" style="margin-right:10px;"><i class="fa fa-plus"></i></button>';
    return addBtn + "Languages";
});

EmployeeSubLanguageAdapter.method('getSubItemHtml', function(item, itemDelete, itemEdit) {
    var itemHtml = $('<a href="#" class="list-group-item"><h5 class="list-group-item-heading" style="font-weight:bold;">'+item[2]+itemDelete+itemEdit+'</h5><p class="list-group-item-text"><i class="fa fa-asterisk"></i> Reading: <b>'+item[3]+'</b></p><p class="list-group-item-text">'+'<i class="fa fa-asterisk"></i> Speaking: <b>'+ item[4] +'</b></p><p class="list-group-item-text">'+'<i class="fa fa-asterisk"></i> Writing: <b>'+item[5]+'</b></p><p class="list-group-item-text">'+'<i class="fa fa-asterisk"></i> Understanding: <b>'+item[6]+'</b></p></a>');
    return itemHtml;
});


function EmployeeEmergencyContactsAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
}

EmployeeEmergencyContactsAdapter.inherits(SubAdapterBase);



EmployeeEmergencyContactsAdapter.method('getDataMapping', function() {
    return [
        "id",
        "name",
        "home_phone",
        "work_phone",
        "mobile_phone"
    ];
});

EmployeeEmergencyContactsAdapter.method('getHeaders', function() {
    return [
        { "sTitle": "ID" ,"bVisible":false},
        { "sTitle": "Name" },
        { "sTitle": "Home Phone" },
        { "sTitle": "Work Phone" },
        { "sTitle": "Mobile Phone" }
    ];
});

EmployeeEmergencyContactsAdapter.method('getFormFields', function() {

    return [
        [ "id", {"label":"ID","type":"hidden"}],
        [ "employee", {"label":"Employee","type":"hidden"}],
        [ "skill_id", {"label":"Skill","type":"select2","allow-null":true,"remote-source":["Skills","id","name"]}],
        [ "details",  {"label":"Details","type":"textarea","validation":""}]
    ];
});


EmployeeEmergencyContactsAdapter.method('forceInjectValuesBeforeSave', function(params) {
    params['employee'] = this.parent.currentId;
    return params;
});




