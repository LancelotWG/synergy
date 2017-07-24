/**
 * @author lenovo(失败的尝试，不可用！)
 */
dojo.provide("js.PropertyDialog");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojo.date.locale");
dojo.require("dojox.grid.EnhancedGrid");
dojo.require("dojox.grid.enhanced.plugins.Menu");
dojo.declare("js.PropertyDialog",dijit.Dialog,{
	owner:null,
	tabContainer:null,
	//common tab for all kinds of owner
	basicPropsTab:null,
	//special tab for Sequence.Process
	pvsTab:null,
	roleTab:null,
	//special tab for conditional structure(eg:IfElse、ForEach)
	expressionTab:null,
	//special for Component
	dataMappingTab:null,
	constructor:function(args){
		dojo.safeMixin(this,args);
		this.inherited(arguments);
	},
	createBasicPropsTab:function(title,id){
		this.basicPropsTab = new dijit.layout.ContentPane({
			tilte: title,
			id: id
		});
		if(this.owner instanceof Sequence.Process)
			this.basicPropsTab.selected = true;
		var table = dojo.create("table", {
			className: "PropsTable"
		}, this.basicPropsTab.domNode, "first");
		var props = this.owner.props;
		var trArray = new Array(props.length);
		for (var i = 0; i < props.length; i++) {
			var prop = props[i];
			var type = prop.dojoType;
			//创建行与单元格，并填充第一个单元格
			trArray[i] = dojo.create("tr", {
				height: "50"
			}, table, null);
			var lbl_td = dojo.create("td", {
				align: "right"
			}, trArray[i], null);
			var txt_td = dojo.create("td", null, trArray[i], null);
			var lbl = dojo.create("label", {
				"for": "label"
			}, lbl_td, null);
			lbl.innerHTML = prop.name;
			//填充第二个单元格
			var obj_id = this.owner.type + "_";
			var txt;
			if (type == "dijit.form.TextBox") {
				//取组件的类型加"_"加属性名的最后一个单词加"_"加一个随机数（1-1000）作为id			
				var strs = prop.name.split(":")[0].split(" ");
				obj_id += strs[strs.length - 1]
				obj_id = obj_id + "_" + random();
				
				txt = dojo.create("input", {
					dojoType: type,
					trim: true,
					type: "text",
					id: obj_id
				}, txt_td, null);
				if (prop.name == "Component Type: ") 
					dojo.attr(txt, "disabled", true);
			}
			else 
				if (type == "dijit.form.DateTextBox") {
					//取组件的类型加"_"加sdate/edate加"_"加一个随机数（1-1000）作为id	
					var s = prop.name.indexOf("Start") > -1 ? 'sdate' : 'edate';
					obj_id += s;
					obj_id = obj_id + "_" + random();
					
					txt = dojo.create("input", {
						dojoType: type,
						type: "text",
						name: obj_id,
						id: obj_id
					}, txt_td, null);
				}
				else 
					if (type == "dijit.form.Select") {
						txt = dojo.create("select", {
							dojoType: "dijit.form.Select",
							style: {
								width: "86%"
							}
						}, txt_td, null);
						var roles = process.roles;
						for (var j = 0; j < roles.length; j++) {
							var role = roles[j];
							var option = dojo.create("option", {
								value: role.value
							}, txt, null);
							option.innerText = role.key;
						}
					}
		}
	},
	createContents:function(){
		this.show();
		var root = dojo.create("div",{id:'PropsRoot'});
		tabContainer = new dijit.layout.TabContainer({id:"PropsTab"});
		if (this.owner instanceof Sequence.Process) {
			//先创建basicPropsTab
			this.createBasicPropsTab("Process Definition Properties","pdProps");
			tabContainer.addChild(this.basicPropsTab);
			//创建流程变量tab
			this.pvsTab = new dijit.layout.ContentPane({
				tilte: "Process Variable",
				id: "pvs"
			});
			var headerMenu = new dijit.Menu();
			headerMenu.addChild(new dijit.MenuItem({
				id:"addRow",
				label:"Add Row"
			}));
			var cellMenu = new dijit.Menu();
			cellMenu.addChild(new dijit.MenuItem({
				id:"removeRow",
				label:"RemoveRow"
			}));
			var layout = [[
		      {'name': 'ID', 'field': 'id','width': '60px','cellStyles': "text-align: center;",'styles': "text-align: center;"},
		      {'name': 'Name', 'field': 'name','width': '60px','cellStyles': "text-align: center;",'styles': "text-align: center;",'editable':'true'},
		      {'name': 'Type', 'field': 'type', 'width': '200px','cellStyles': "text-align: center;",'styles': "text-align: center;",'editable':'true'}
		    ]];
			var pvs_grid = new dojox.grid.EnhancedGrid({
				id:'pvs_grid',
				store:pvs_store,
				structure: layout,
				columnReordering:true,
				plugins:{menus:{headerMenu:headerMenu,cellMenu:cellMenu}}
			},'pvs');
			pvs_grid.startup();
			tabContainer.addChild(this.pvsTab);
			//创建角色tab
			this.rolesTab = new dijit.layout.ContentPane({
				tilte: "Roles",
				id: "roles"
			});
			var roles_headerMenu = new dijit.Menu();
			roles_headerMenu.addChild(new dijit.MenuItem({
				id:"roles_addRow",
				label:"Add Row"
			}));
			var roles_cellMenu = new dijit.Menu();
			roles_cellMenu.addChild(new dijit.MenuItem({
				id:"roles_removeRow",
				label:"RemoveRow"
			}));
			var layout2 = [[
		      {'name': 'ID', 'field': 'id','width': '60px','cellStyles': "text-align: center;",'styles': "text-align: center;"},
		      {'name': 'Role Name', 'field': 'name','width': '60px','cellStyles': "text-align: center;",'styles': "text-align: center;",'editable':'true'},
		      {'name': 'Associated Users', 'field': 'users', 'width': '200px','cellStyles': "text-align: center;",'styles': "text-align: center;",'editable':'true'}
		    ]];
			var roles_grid = new dojox.grid.EnhancedGrid({
				id:'roles_grid',
				store:roles_store,
				structure: layout2,
				columnReordering:true,
				plugins:{menus:{headerMenu:roles_headerMenu,cellMenu:roles_cellMenu}}
			},'roles');
			roles_grid.startup();
			tabContainer.addChild(this.rolesTab);
		}else if(this.owner instanceof Component){
			//先创建basicPropsTab
			this.createBasicPropsTab("Component Properties","compProps");
			tabContainer.addChild(this.basicPropsTab);
		}else{
			
		}
		tabContainer.startup();
		root.appendChild(tabContainer.domNode);
		// Buttton Panel		 
		var btnPanel = dojo.create("table",{id:"PropsBtnPanel"},root,'last');
		var btn_tr = dojo.create("tr",null,btnPanel,null);
		var btn_td = dojo.create("td",{align:"center",colspan:"2"},btn_tr,null);
		var ok_btn = dojo.create("input",{type:"button",value:"OK",style:{"width":"60px","height":"30px"},onclick:"javascript:this.ok_Clicked2()"},btn_td,null);
		btn_td.innerHTML += "&nbsp;&nbsp;&nbsp;";
		var cancel_btn = dojo.create("input",{type:"button",value:"Cancel",style:{"width":"60px","height":"30px"},onclick:"javascript:this.cancel_Clicked()"},btn_td,null);	
		//
		this.set("content",root.innerHTML);
		//为菜单添加动作
		try{			
			dijit.byId('addRow').onClick = addRow;
			dijit.byId('removeRow').onClick = removeRow;
			dijit.byId('role_addRow').onClick = addRow2;
			dijit.byId('role_removeRow').onClick = removeRow2;			
		}catch(e){
			return;
		}	
	},
	removeRow:function(){
		dijit.byId('pvs_grid').removeSelectedRows();
	},
	addRow:function(){
		pvs_maxID++;
		pvs_store.newItem(dojo.mixin({ id: pvs_maxID }, data_list[0]));
		//refresh the grid
		dijit.byId('pvs_grid').setStore(pvs_store);
	},
	removeRow2:function(){
		dijit.byId('roles_grid').removeSelectedRows();
	},
	addRow2:function(){
		roles_maxID++;
		roles_store.newItem(dojo.mixin({ id: roles_maxID }, roles_data_list[0]));
		//refresh the grid
		dijit.byId('roles_grid').setStore(roles_store);
	},
	ok_Clicked2: function(){
		var resultSet = this.validate2();
		//过滤出合法的属性
		var validProps = dojo.filter(resultSet, function(item){
			return item.valid == true;
		});
		//得到属性对话框当前所对应的组件对象
		var temp_pvs = new Array();
		var temp_roles = new Array();
		for (var i=0; i<validProps.length; i++) {
			var prop = validProps[i];
			var id = prop.tabId;
			if(id=="pdProps"||id=="compProps"){
				var input = prop.reason;
				var value = dojo.attr(input,"value");
				if(input.id.indexOf('Name')>-1){
						this.owner.setName(value);
				}else if(input.id.indexOf('Description')>-1){
						this.owner.setDesc(value);
				}else if(input.id.indexOf('sdate')>-1){
						this.owner.sdate = value;
				}else if(input.id.indexOf('edate')>-1){
						this.owner.edate = value;
				}else if(!input.id){
						this.owner.role = value;
				}
			}else if(id=='pvs'||id=='roles'){
				var item = prop.item;
				if(id=='pvs'){
					temp_pvs.push({key:item.name[0],value:item.type[0]});
				}else{
					temp_roles.push({key:item.name[0],value:item.users[0]});
				}
			}		
		};
		if(temp_pvs.length>0){
				process.pvs = temp_pvs;
		}
		if(temp_roles.length>0){
				process.role = temp_roles;
		}
		pvs_store.save();
		roles_store.save();
		//保存完毕，隐藏属性对话框
		cancel_Clicked();
	},
	cancel_Clicked:function(){
		this.hide();
//		this.destroy();
	},
	validate2:function(){
		var childTabs = dijit.byId("PropsTab").getChildren();
		var resultSet = new Array();
		for(var i=0;i<childTabs.length;i++){
			var tab = childTabs[i];
			var id = tab.domNode.id;
			var result;
			if(id=="pdProps"||id=="compProps"){
				result = this.validateBasicProps2(id);
			}else if(id=='pvs'||id=='roles'){
				result = this.validatePvsOrRoles2(id);
			}
			dojo.forEach(result, function(item, j){
			  	resultSet.push(item);
			});	
		}
		return resultSet;	
	},
	validatePvsOrRoles2:function(id){
		var children = dojo.byId(id).childNodes;
		var grid;
		for (var i=0; i<children.length; i++) {
			var child = children[i];
			var obj = dijit.byId(child.id);
			if(obj instanceof dojox.grid.EnhancedGrid){
				grid = obj;
				break;
			}	
		};
		if(grid == undefined) return null;	
		var store = grid.store;
		var resultSet = new Array();
		//获得所有的Items
		var items = store._getItemsArray();
		for (var i=0; i<items.length; i++) {
			var item = items[i];
			var result = null;
			//如果name不为空，检查type或users字段是否输入
			if(item.name[0]){
				try{
					var type = item.type[0];
					if(!type){
						var cellNode = grid.getCell(2).getNode(i);
						result = {valid: false,reason:cellNode,tabId:id};
					}else
						result = {valid: true,reason:cellNode,tabId:id,item:item};
				}catch(e){
					var users = item.users[0];
					if(!users){
						var cell = grid.getCell(2).getNode(i);
						result =  {valid: false,reason:cell,tabId:id};
					}else
						result =  {valid: true,reason:cell,tabId:id,item:item};			
				}
			}else{
				//如果type或users不为空，而name为空
				try{
					var type = item.type[0];
					if(type){
						var cellNode = grid.getCell(1).getNode(i);
						result = {valid: false,reason:cellNode,tabId:id};
					}
				}catch(e){
					var users = item.users[0];
					if(users){
						var cell = grid.getCell(1).getNode(i);
						result = {valid: false,reason:cell,tabId:id};
					}				
				}
			}
			//如果result!=null，说明输入不完整，如果result==null说明用户没有输入
			if(result)	resultSet.push(result);
		};
		return resultSet;
	},
	validateBasicProps2:function(id){
		var inputs = dojo.query("table tr td input",dojo.byId(id)).filter(function(item){
			return item.id!="";
		});
		if(id=="compProps"){
			var role_select = dojo.query("table table tr td input",dojo.byId(id));
			inputs.push(role_select);
		}
		var sdate,edate;
		//检查结果的数组
		var resultSet = new Array();
		for(var i=0;i<inputs.length;i++){
			var input = inputs[i];
			//保存每条属性的检查结果
			var result = null;
			if(input.type == "text"){
				var value = dojo.attr(input,"value");
				if(validateInput(value)){
					if(input.id.indexOf("sdate")>-1) sdate = {str:value,domNode:input};
					if(input.id.indexOf("edate")>-1) edate = {str:value,domNode:input};
					//end date的检查结果先不保存，需要与start date比较后才能确定其是否合法
					if(input.id.indexOf("edate")==-1)
						result = {valid:true,reason:input,tabId:id};
				} 
				else{
					result = {valid: false,reason:input,tabId:id};
				} 
			}
			if(result)
				resultSet.push(result);
		}
		//将日期字符串转换为日期对象，然后比较，如果结束日期早于开始日期，则非法
		if(sdate&&edate){
			var start = dojo.date.locale.parse(sdate.str,{selector:"date"});
			var end = dojo.date.locale.parse(edate.str,{selector:"date"});
			if(end < start)
				resultSet.push({valid: false,reason:edate.domNode,tabId:id});
			else
				resultSet.push({valid: true,reason:edate.domNode,tabId:id});
		}
		
		return resultSet;
	}
});
