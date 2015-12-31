function SubordinateAdapter(endPoint,tab,filter,orderBy) {
    this.initAdapter(endPoint,tab,filter,orderBy);
    this.fieldNameMap = {};
    this.hiddenFields = {};
    this.tableFields = {};
    this.formOnlyFields = {};
    this.customFields = [];
}

SubordinateAdapter.inherits(AdapterBase);

SubordinateAdapter.method('setFieldNameMap', function(fields) {
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

SubordinateAdapter.method('setCustomFields', function(fields) {
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

SubordinateAdapter.method('getTableFields', function() {
    var tableFields = [
        "id",
        "employee_id",
        "first_name",
        "last_name",
        "mobile_phone",
        "department",
        "gender",
        "supervisor"
    ];
    return tableFields;
});

SubordinateAdapter.method('getDataMapping', function() {
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

SubordinateAdapter.method('getHeaders', function() {
    var tableFields = this.getTableFields();
    var headers =  [
        { "sTitle": "ID","bVisible":false }
    ];
    var title = "";

    for(var i=0;i<tableFields.length;i++){
        if((this.hiddenFields[tableFields[i]] == undefined || this.hiddenFields[tableFields[i]] == null )&&
            (this.formOnlyFields[tableFields[i]] == undefined || this.formOnlyFields[tableFields[i]] == null )){
            if(this.fieldNameMap[tableFields[i]] != undefined && this.fieldNameMap[tableFields[i]] != null){
                title = this.fieldNameMap[tableFields[i]].textMapped;
                headers.push({ "sTitle": title});
            }

        }
    }

    return headers;
});

SubordinateAdapter.method('getFormFields', function() {

    var newFields = [];
    var tempField, title;
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
        [ "ssn_num", {"label":"SSN/NRIC","type":"text","validation":"none"}],
        [ "nic_num", {"label":"NIC","type":"text","validation":"none"}],
        [ "other_id", {"label":"Other ID","type":"text","validation":"none"}],
        [ "driving_license", {"label":"Driving License No","type":"text","validation":"none"}],
        [ "employment_status", {"label":"Employment Status","type":"select2","remote-source":["EmploymentStatus","id","name"]}],
        [ "job_title", {"label":"Job Title","type":"select2","remote-source":["JobTitles","id","name"]}],
        [ "pay_grade", {"label":"Pay Grade","type":"select2","allow-null":true,"remote-source":["PayGrades","id","name"]}],
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
                [ "note", {"label":"Note","type":"textarea","validation":""}]
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

SubordinateAdapter.method('getFilters', function() {
    return [
        [ "job_title", {"label":"Job Title","type":"select2","allow-null":true,"null-label":"All Job Titles","remote-source":["JobTitle","id","name"]}],
        [ "department", {"label":"Department","type":"select2","allow-null":true,"null-label":"All Departments","remote-source":["CompanyStructure","id","title"]}],
        [ "supervisor", {"label":"Supervisor","type":"select2","allow-null":true,"null-label":"Anyone","remote-source":["Employee","id","first_name+last_name"]}]
    ];
});

SubordinateAdapter.method('getActionButtonsHtml', function(id) {
    var html = '<div style="width:110px;"><img class="tableActionButton" src="_BASE_images/user.png" style="cursor:pointer;" rel="tooltip" title="Login as this Employee" onclick="modJs.setAdminProfile(_id_);return false;"></img><img class="tableActionButton" src="_BASE_images/view.png" style="cursor:pointer;margin-left:15px;" rel="tooltip" title="View" onclick="modJs.view(_id_);return false;"></img></div>';
    html = html.replace(/_id_/g,id);
    html = html.replace(/_BASE_/g,this.baseUrl);
    return html;
});

SubordinateAdapter.method('getHelpLink', function () {
    return 'http://blog.icehrm.com/?page_id=69';
});


SubordinateAdapter.method('view', function(id) {

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


SubordinateAdapter.method('viewFailCallBack', function(callBackData) {
    this.showMessage("Error","Error Occured while retriving candidate");
});

SubordinateAdapter.method('renderEmployee', function(data) {
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

    $('#subModTab a').off().on('click',function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
});


SubordinateAdapter.method('deleteProfileImage', function(empId) {
    var that = this;

    var req = {"id":empId};
    var reqJson = JSON.stringify(req);

    var callBackData = [];
    callBackData['callBackData'] = [];
    callBackData['callBackSuccess'] = 'modEmployeeDeleteProfileImageCallBack';
    callBackData['callBackFail'] = 'modEmployeeDeleteProfileImageCallBack';

    this.customAction('deleteProfileImage','modules_employees',reqJson,callBackData);
});

SubordinateAdapter.method('modEmployeeDeleteProfileImageCallBack', function(data) {
    //top.location.href = top.location.href;
});
