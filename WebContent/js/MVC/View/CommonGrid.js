dojo.declare("CommonGrid",null,{
	id:"",
	store:null,
	layout:null,
	parentNode:null,
	names:[],
	fields:[],
	widths:[],
	constructor:function(args){
		if(args)
			dojo.safeMixin(this,args);
		//反向关联store与grid，使能够根据store查询使用它的grid	
		this.store.linkedGrid = this.id;	
		this.layout = [];
		var records = [];
		for(var i=0;i<this.fields.length;i++){
			var name = this.names[i] ? this.names[i] : this.fields[i];
			var width = this.widths[i] ? this.widths[i] : '100px';
			var obj = {'name':name,'field':this.fields[i],'width':width};
			dojo.mixin(obj,{'styles':"text-align: center;"});
			records.push(obj);
		}
		this.layout.push(records);
		var gridPanel = dojo.create("div",{},this.parentNode,null);
		var grid = dijit.byId(this.id);
		var owner = dijit.byId("propsDialog").connectedComp.name;
		if(!grid){
			var grid = new js.Grid({
		        id: this.id,
				//使用构造函数创建实例不能使用store的jsId,使用markup创建实例应该使用jsId
		        store: this.store,
		        structure: this.layout,
				autoWidth:true,
				escapeHTMLInData:false,
//				autoHeight:true, autoHeight会使表格中只有一行时，内容显示不出来，不使用此属性
//				initialWidth:"500px",
				rowSelector:"20px"},
		    gridPanel);
			grid.startup();
			if(this.id=="dm_grid"||this.id=="cpv_grid") grid.filter({owner: owner});
		}	
	}
});