/**
 * @author LancelotWG
 * 时间配置类
 */
dojo.declare("TimeConfigureGrid",dojo.Stateful,{
    timeConfigureStore_layout:null,
    //
    timeConfigureStoreLocked_layout:null,
    //
    timeConfigureStore_hb:null,
    //
    timeConfigureStore:null,
    //
    grid:null,
    constructor: function(){
    },
    buildGridLayout:function(){
        var formatData = function(value){
            for(var i = 0;i < os.timeConfigure.length;i++){
                if(os.timeConfigure[i].time == value)
                    return os.timeConfigure[i].time;
            }
            /*var w = new dijit.form.FilteringSelect({
             store:dojo.data.ItemFileWriteStore(
             {
             data:{
             identifier:'id',
             label:'id',
             items:[
             {id:0},
             {id:1},
             {id:2}
             ]
             }
             }
             ),
             searchAttr:'id'
             });
             w._destroyOnRemove = true;
             return w;*/
        };
        var store = [];
        for(var i = 0;i < os.timeConfigure.length;i++){
            store.push({id:os.timeConfigure[i].time});
        }
        var timeStore = new dojo.store.Memory({data:store});
        this.timeConfigureStore_layout = [
            {name: "模块名称", field: "name", width: "35%"},
            {name: "时间片(单位：ms)", width: "65%", field: "configureTime", styles: "text-align: center;",formatter:formatData,
                editable:true,
                type:dojox.grid.cells._Widget,
                widgetClass:dijit.form.FilteringSelect,
                widgetProps:{
                    store:timeStore,
                    searchAttr:'id',
                    scrollOnFocus:true
                }
            }
        ];
    },
    rebuildGridLayout:function(){
        this.buildGridLayout();
        this.grid.setStructure(this.timeConfigureStore_layout);
    },
    onCreate: function(){
        this.timeConfigureStore_hb = {identifier:'id',items: []};
        this.timeConfigureStore = new dojo.data.ItemFileWriteStore({data: this.timeConfigureStore_hb});
        this.timeConfigureStoreLocked_layout = [
            {name: "模块名称", field: "name", width: "35%"},
            {name: "时间片(单位：ms)", width: "65%", field: "configureTime", styles: "text-align: center;"}
        ];
        this.buildGridLayout();
        this.grid = new dojox.grid.EnhancedGrid({
            plugins: {nestedSorting: true},
            clientSort: false,
            id:'timeGrid',
            store:this.timeConfigureStore,
            structure: this.timeConfigureStore_layout
        },"timeconfigure_grid");
        var showTooltip = function(e) {
            var msg = "注意：排序功能仅供快速查找模块，不会影响模块的执行顺序！";
            dijit.showTooltip(msg, e.cellNode);
        };
        var hideTooltip = function(e) {
            dijit.hideTooltip(e.cellNode);
        };
        var pass = this;
        var applyCellEdit = function(inValue, inRowIndex, inFieldIndex){
            console.log("值："+inValue+"  Row:"+inRowIndex+"  Field:"+inFieldIndex);
            var compName = pass.timeConfigureStore_hb.items[inRowIndex].name;
            console.log("   "+compName);
            var childrens = process.children;
            for(var i=0;i<childrens.length;i++){
                var children = childrens[i];
                if(children.name == compName){
                    var oldValue = children.configureTime;
                    children.setConfigureTime(inValue);
                    //时间配置消息
                    children.sendNetMsg(NetMsgUtil.prototype.msgChange,["timeConfigure",oldValue]);
                }
            }
        };
        //修正dojo的Bug
        var doStartEdit = function(inCell, inRowIndex){
            if(!inCell.widget){
                inCell.formatNode(inCell.getEditNode(inRowIndex),this.getItem(inRowIndex).configureTime,inRowIndex);
            }
        };
        dojo.connect(this.grid, "onHeaderCellMouseOver", showTooltip);
        dojo.connect(this.grid, "onHeaderCellMouseOut", hideTooltip);
        dojo.connect(this.grid, "onApplyCellEdit", applyCellEdit);
        dojo.connect(this.grid, "doStartEdit", doStartEdit);
        this.grid.startup();
    },
    isLocked:function(){
        //流程锁定
        if(process.locked){
            if(this.grid.structure == this.timeConfigureStoreLocked_layout)
                return;
            this.grid.setStructure(this.timeConfigureStoreLocked_layout);
            //this.grid.structure = this.timeConfigureStoreLocked_layout;
            /*//空延时，grid的setStructure需要准备时间
            for(var i = 0;i<100;i++){
                for(var j = 0;j<100;j++){
                    //console.log("延时");
                }
            }*/
            timeConfigureGridFreshen = true;
        }else{
            if(this.grid.structure == this.timeConfigureStore_layout)
                return;
            this.grid.setStructure(this.timeConfigureStore_layout);
            //this.grid.structure = this.timeConfigureStore_layout;
            /*//空延时，grid的setStructure需要准备时间
            for(var i = 0;i<100;i++){
                for(var j = 0;j<100;j++){
                    //console.log("延时");
                }
            }*/
            timeConfigureGridFreshen = true;
        }
        /*process.validate();
        this.grid.update();
        process.validate();*/
        //流程锁定
    },
    addStoreItem:function(item){
        this.timeConfigureStore.newItem(item);
    },
    clearStore:function(){
        this.timeConfigureStore_hb = {identifier:'id',items: []};
        this.timeConfigureStore = new dojo.data.ItemFileWriteStore({data: timeConfigureGrid.timeConfigureStore_hb});
    },
    freshenGrid:function(){
        this.grid.setStore(this.timeConfigureStore);
        this.grid.update();
    }
});