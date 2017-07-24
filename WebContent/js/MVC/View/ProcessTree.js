/**
 * @author LancelotWG
 * 流程树类
 */
dojo.declare("ProcessTree",dojo.Stateful,{
    //
    treeMaxID:0,
    //
    treeData:{identifier: 'id', items: []},
    //
    treeStore:null,
    //
    treeModel:null,
    //
    tree:null,
    lockedList:null,
    constructor: function(){
        this.treeStore = new dojo.data.ItemFileWriteStore({
            data:this.treeData,
            jsId:"treeStore"
        });
    },
    onCreate: function(){

        this.treeModel = new js.TreeStoreModel({
            store:this.treeStore,
            labelAttr:"name",
            query:{"id":"0"}
        });
        this.tree = new js.Tree({
            model:this.treeModel,
            openOnClick:true,
            betweenThreshold:5,
            dndController: "dijit.tree.dndSource"
        },"outline_tree").placeAt(dojo.byId("outline"));
        dojo.style(this.tree.domNode,{width:"100%",height:"100%",border:"none"});
        var rootNode = this.tree._getRootOrFirstNode();
        process.treeEditor = new InplaceEditor({isNeedSetLoc:false,treeNode:rootNode, width:"*", style:"width: *;"},rootNode.labelNode);
        //模块提示条
        var comp = reg.getComponentByName(rootNode.label);
        var showTooltip = function(e) {
            var msg = "流程名："+comp.name;
            if(comp.keyHolder[0] != null){
                msg += "<br/>" + "编辑者："+comp.keyHolder[0];
            }
            if(comp.locked){
                if(comp.keyHolder[0] != userName){
                    msg += "<br/>" + "主流程已被"+ comp.keyHolder[0] + "锁定";
                }
            }
            if(singleTreeTooltip){
                dijit.showTooltip(msg, e.target);
                singleTreeTooltip = false;
            }
        };
        var hideTooltip = function(e) {
            dijit.hideTooltip(e.target);
            singleTreeTooltip = true;
        };
        dojo.connect(rootNode.domNode, "mouseover", showTooltip);
        dojo.connect(rootNode.domNode, "mouseout", hideTooltip);
        //模块提示条
    }/*,
    isLocked:function(){
        this.tree.getIconClass();
    }*/
    /*createTooltip:function(){

    }*/
});