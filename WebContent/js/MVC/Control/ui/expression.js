function addCondition(){	
	var left_operand_type = dijit.byId("left_operand_type").get("value");
	var left_operand = dijit.byId("left_operand").get("value");
	var operator = dijit.byId("operatorSelect").get("value");
	var right_operand_type = dijit.byId("right_operand_type").get("value");
	var right_operand;
	if(right_operand_type=="type_direct"){
		switch(dijit.byId("right_operand").get("value")){
			case "dijit.form.ValidationTextBox":
				right_operand_type = "string";
				break;
			case "dijit.form.RadioButton":			
				right_operand_type = "boolean";
				break;
			case "dijit.form.NumberTextBox":
				right_operand_type = "int";
				break;
			case "dijit.form.DateTextBox":
				right_operand_type = "date";
				break;
			case "dojox.form.FileInputAuto":
				right_operand_type = "org.uengine.contexts.FileContext";
				break;
			default:
		}
		right_operand = dijit.byId("directValueWidget").get("value");
	}else right_operand = dijit.byId("right_operand").get("value");
	var expression = left_operand + operator + right_operand;
	var name =  dijit.byId("expression_name").get("value");
	
	var returnId = addOrEdit(exp_store,{
		name:name,
		content:expression,
		left_type:left_operand_type,
		left:left_operand,
		operator:operator,
		right_type:right_operand_type,
		right:right_operand,
		valid:"有效"},exp_maxID,"expDlg");
	if(returnId) exp_maxID = returnId;
	//refresh the grid
	dijit.byId('exp_grid').setStore(exp_store);
	
	dijit.byId("ifConditionForm").reset();
}

function fillOperandTypeSelect(type,which){
	var options = [{label:'&nbsp;',value:'',selected:true}];
	if(which=="right")
		options.push({label:"直接值",value:"type_direct"});
	switch(type){
		case "type_pv":
			options.push({label:"流程变量",value:type});			
			break;
		case "type_role":
			options.push({label:"角色",value:type});	
			break;
		case "type_duration":
			options.push({label:"任务持续时间",value:type});	
			break;
		case "type_expression":
			options.push({label:"表达式",value:type});	
			break;		
		default:
			options.push({label:"流程变量",value:"type_pv"});	
			options.push({label:"角色",value:"type_role"});	
			options.push({label:"任务持续时间",value:"type_duration"});	
			options.push({label:"表达式",value:"type_expression"});
	}
	dijit.byId(which+"_operand_type").options = options;
	//刷新
	dijit.byId(which+"_operand_type")._loadChildren(true);
}
function leftOperandTypeChanged(newValue){
	//限制左操作数Select的选项
	fillOperandSelect(newValue,"left");
	//限制右操作数类型Select的选项
	fillOperandTypeSelect(newValue,"right");
}
function rightOperandTypeChanged(newValue){
	fillOperandSelect(newValue,"right");
//	fillOperandTypeSelect(newValue,"left");
}
function fillOperandSelect(type,which){
	var options = [{label:'&nbsp;',value:''}];
	switch(type){
		case "type_pv":
			dojo.forEach(pvs_store._getItemsArray(),function(pv){
				var option = {label:pv.name[0],value:pv.name[0]};
				options.push(option);
			});
			break;
		case "type_role":
			dojo.forEach(roles_store._getItemsArray(),function(role){
				var option = {label:role.name[0],value:role.name[0]};
				options.push(option);
			});
			break;
		case "type_duration":
			dojo.forEach(getAllChildTask(process),function(item){
				var option = {label:item+".duration",value:item};
				options.push(option);
			});
			break;
		case "type_expression":
			dojo.forEach(exp_store._getItemsArray(),function(exp){
				var option = {label:exp.content[0],value:exp.content[0]};
				options.push(option);
			});
			break;
		case "type_direct":
			options.push({label:"String",value:"dijit.form.ValidationTextBox"});
			options.push({label:"YesOrNo",value:"dijit.form.RadioButton"});
			options.push({label:"Number",value:"dijit.form.NumberTextBox"});
			options.push({label:"Date",value:"dijit.form.DateTextBox"});
			options.push({label:"File",value:"dojox.form.FileInputAuto"});
			break;
		default:
	}
	dijit.byId(which+"_operand").options = options;
	//刷新
	dijit.byId(which+"_operand")._loadChildren(true);
}
function leftOperandChanged(newValue){
	var type = dijit.byId("left_operand_type").get("value");
	var options = [{label:'&nbsp;',value:''}];
	switch(type){
		case "type_pv":
			options.push({label:"==",value:"=="});
			options.push({label:"!=",value:"!="});
			options.push({label:"&gt;",value:">"});
			options.push({label:"&lt;",value:"<"});
			options.push({label:"&gt;=",value:">="});
			options.push({label:"&lt;=",value:"<="});
			options.push({label:"contains",value:"contains"});
			options.push({label:"not contains",value:"not contains"});
			break;
		case "type_role":
			options.push({label:"==",value:"=="});
			options.push({label:"!=",value:"!="});
			options.push({label:"contains",value:"contains"});
			options.push({label:"not contains",value:"not contains"});
			break;
		case "type_duration":
			options.push({label:"==",value:"=="});
			options.push({label:"!=",value:"!="});
			options.push({label:"&gt;",value:">"});
			options.push({label:"&lt;",value:"<"});
			options.push({label:"&gt;=",value:">="});
			options.push({label:"&lt;=",value:"<="});
			options.push({label:"contains",value:"contains"});
			options.push({label:"not contains",value:"not contains"});
			break;
		case "type_expression":
			options.push({label:"&&",value:"&&"});
			options.push({label:"||",value:"||"});
			break;
	}
	dijit.byId("operatorSelect").options = options;
	dijit.byId("operatorSelect")._loadChildren(true);
}
function rightOperandChanged(newValue){
	var type = dijit.byId("right_operand_type").get("value");	
	var td = dojo.byId("dynamicTD");
	var widget = dijit.byId("directValueWidget");
	if(widget)
		widget.destroyRecursive(false);
	if(type!="type_direct"){
		if(td.style.display=="block") td.style.display = "none";
		return;
	} 
	switch(newValue){
		case "dijit.form.ValidationTextBox":
			td.style.display = "block";
			new dijit.form.ValidationTextBox({required:true,id:"directValueWidget"}).placeAt(td);
			break;
		case "dijit.form.RadioButton":			
			td.style.display = "block";
			new js.RadioGroup({id:"directValueWidget",labels:['Yes','No'],values:[true,false],parentNode:td});
			break;
		case "dijit.form.NumberTextBox":
			td.style.display = "block";
			new dijit.form.NumberTextBox({id:"directValueWidget"}).placeAt(td);
			break;
		case "dijit.form.DateTextBox":
			td.style.display = "block";
			new dijit.form.DateTextBox({id:"directValueWidget"}).placeAt(td);
			break;
		case "dojox.form.FileInputAuto":
			td.style.display = "block";
			new dijit.form.ValidationTextBox({required:true,type:"file",id:"directValueWidget"}).placeAt(td);
			break;
		default:
			td.style.display = "none";
	}
}
