/**
 * Created with JetBrains WebStorm.
 * User: wanshujia
 * Date: 13-1-9
 * Time: 下午8:22
 * To change this template use File | Settings | File Templates.
 */

var Bool2 = dojo.declare("js.ui.Bool", dojox.grid.cells.Bool, {
    partChecked:[],
    formatEditing: function(inDatum, inRowIndex){
            return '<input class="dojoxGridInput" type="checkbox"' + (inDatum ? ' checked="checked"' : '') + ' style="width: auto" />';
    },
    doclick: function(e){
        this.inherited(arguments);
        if(e.target.tagName == 'INPUT'){
            var item = this.grid.getItem(e.rowIndex);
            if(item['children']){
                updateChildren(item.children,item.selected[0]);
            }
        }
    }
});
Bool2.markupFactory = function(node, cell){
    dojox.grid.cells.Bool.markupFactory(node, cell);
};
function updateChildren(children,select){
    if(!dojo.isArray(children)) return;
    dojo.forEach(children,function(child){
        if(child['children']){
            updateChildren(child['children'],select);
        }
        metadata_store.setValue(child,"selected",select);
    });
}
function getSelectedMetaItems(filtCategory){
    if(filtCategory){
        return dojo.filter(metadata_store._getItemsArray({deep:true}),function(item){
            if(item&&item.selected&&item.selected[0]&&!item.children) return true;
        });
    }else{
        return dojo.filter(metadata_store._getItemsArray({deep:true}),function(item){
            if(item&&item.selected&&item.selected[0]) return true;
        });
    }
}
function showSelected(){
    hideMetaBorder(2);
    showMetaBorder(1);
    //由于DataGrid控件的setQuery方法对于TreeGrid存在BUG，故采用两个Store互相更换的方式来切换显示
    var grid = dijit.byId("metadata_grid");
    var items = getSelectedMetaItems(true);
    var newItems = [];
    dojo.forEach(items,function(item){
        newItems.push(cloneItem(item,metadata_store));
    });
    var store = new ItemFileWriteStore({data:{identifier:"name",items:newItems}});
    store.onSet = function(item,attr,oldValue,newValue){
        if(oldValue == newValue) return;
        if(attr=="selected"){
//            if(!metadata_store.changes) metadata_store.changes = [];
//            var theItem;
//            dojo.forEach(metadata_store.changes,function(keyValue){
//                if(keyValue.key == item) theItem = keyValue;
//            });
//            if(theItem)
//                theItem.value = newValue;
//            else                        //此处key不能传递对象(item)，应该传字符串(name)
//                metadata_store.changes.push({key:this.getValue(item,"name"),value:newValue});
            var name = store.getIdentity(item);
            metadata_store.fetchItemByIdentity({identity:name,onItem:function(item){
                metadata_store.setValue(item,"selected",newValue);
            }})
        }
    }
    //dojo.aspect.before会多次调用回调函数？
//    dojo.aspect.before(dojo.global,"showAll",function(){
//       store.fetch({query:{name:"*"},onItem:function(item){
//           var newValue = item.selected[0];
//           metadata_store.fetchItemByIdentity({identity:item.name[0],onItem:function(item2){
//               var oldValue = item2.selected[0];
//               if(newValue!=oldValue){
////                   metadata_store.setValue(item2,"selected",newValue);
//                   if(!metadata_store.changes) metadata_store.changes = [];
//                   metadata_store.changes.push({key:item2,value:newValue});
//               }
//           }});
//       }});
//    });
    grid.setStore(store);
}
function showAll(){
    hideMetaBorder(1);
    showMetaBorder(2);
    var grid = dijit.byId("metadata_grid");
//    if(metadata_store.changes){
//        dojo.forEach(metadata_store.changes,function(keyValue){
//            metadata_store.fetchItemByIdentity({identity:keyValue.key,onItem:function(item){
//                var oldValue = metadata_store.getValue(item,"name");
//                if(oldValue != keyValue.value)
//                    metadata_store.setValue(item,"selected",keyValue.value);
//            }});
//        });
//        metadata_store.changes = undefined;
//    }
    grid.setStore(metadata_store);
}

function cloneItem(item,store){
    var newItem = {};
    dojo.forEach(store.getAttributes(item),function(attribute){
        if(attribute != "parent")
        newItem[attribute] = store.getValue(item,attribute);
    });
    return newItem;
}
function expandGrid(grid,itemId){
    if(!grid) return;
    if(!itemId) return;
    grid.store.fetchItemByIdentity({
        identity:itemId,
        onItem:function(item){
            if(item){
                var treeUrl;
                if(treeUrl = grid.store.getValue(item,"treeUrl")){
                    var ancestor = treeUrl.split("/");
                    dojo.forEach(ancestor,function(pItem){
                        grid.expand(pItem);
                    })
                }
            }
        }
    })
}
function scrollToItem(grid,item){
    if(typeof item === "string"){
        grid.store.fetchItemByIdentity({
            identity:item,
            onItem:function(item){
                scrollToItem(grid,item);
            }
        })
    }
    var index = grid.getItemIndex(item);
    if(index!=-1)grid.scrollToRow(index);
}

function selectOrAdd(){
    var select = dijit.byId("metadata_select");
    if(!select) return;
    if(!select.isValid()){
        alert("未输入检索条件");
        return;
    }
    var displayedValue = select.get("value");
    var notFound = true,theItem;
    metadata_store.fetch({
        query:{name:'*'},
        queryOptions:{deep:true},
        onComplete:function(items){
            dojo.forEach(items,function(item){
                if(item.name[0]==displayedValue){
                    theItem = item;
                    notFound = false;
                }
            });
        }
    });
    if(notFound){
        var isAdd = confirm("未检测到您输入的元数据名称，是否要添加新的元数据?");
        if(isAdd) showAddMetadataDlg(displayedValue);
    }else{
        var grid = dijit.byId("metadata_grid");
        expandGrid(grid,theItem.name[0]);
        scrollToItem(grid,theItem);
        metadata_store.setValue(theItem,"selected",true);
        updateChildren(theItem.children,true);
    }
}
function addMetadata(){
    var form = dijit.byId("addMetadataForm");
    var nameWidget = dijit.byId("metadata_name");
    var metadataName = nameWidget.get("value");
    if(!metadataName){
        alert("表单信息不完整");
        nameWidget.edit();
        return;
    }else{//重名检查
        var exist = false;
        metadata_store.fetchItemByIdentity({identity:metadataName,scope:this,onItem:function(item){
            if(item){
                alert("检测到您输入的元数据名称已经存在,请详细描述以避免重复");
                exist = true;
            }
        }});
        if(exist){
            nameWidget.edit();
            return;
        }
    }
    if(!form.validate()){
        alert("表单信息不完整");
        return;
    }
//    if(form){
//        var values = form.gatherFormValues(["useStyle","metadataType","autoSelect","metaCategory_select","metadata_pinyin"]);
//        var item = {name:metadataName,dataType:values.metadataType,selected:values.autoSelect,pyName:values.metadata_pinyin + metadataName};
//        var category = values["metaCategory_select"];
//        var custom = true;
//        if(category){
//            metadata_store.fetchItemByIdentity({identity:category,onItem:function(item){
//                if(!item) return;
//                if(!metadata_store.getValue(item,"custom")) custom = false;
//            }})
//        }
//        if(values.useStyle){
////            存入数据库
//            var str;
//            var obj = {name:metadataName,dataType:item.dataType};
//            if(values.addStyle){ //添加分类
//                item.children = [];
//                item.type = "category";
//                item.custom = true;
//                str = {items:{name:category,custom:true,children:[]}};
//            }else{//添加元数据项
//                if(category){//添加元数据项必须指定目录
//                    var pObj = {name:category,custom:custom,children:[obj]};
//                    str = {items:[pObj]};
//                }
//            }
//            postMetadata(str);
//        }else{//添加分类
//            if(values.addStyle){
//                item.children = [];
//                item.type = "category";
//            }
//        }
//        item.custom = true;
//        hideMetaDlg();
//        var theItem;
//        //添加元数据到表格中
//        try {
//            if(item.addStyle) item.dataType = undefined;
//            //如果指定了所属分类
//            if(category){
//                metadata_store.fetchItemByIdentity({identity:category,scope:metadata_store,onItem:function(parentItem){
//                    if(parentItem){
//                        item.treeUrl = metadata_store.getValue(parentItem,"treeUrl")+"/"+item.name;
//                        theItem = this.newItem(item,{parent:parentItem,attribute:"children"});
//                    }
//                }});
//            }else{//如果未指定分类，就添加到根节点下
//                item.treeUrl = item.name;
//                theItem = metadata_store.newItem(item);
//            }
//        } catch (e) {
//            alert("添加元数据失败:"+ e.description);
//        }finally{
//            setTimeout(function(){
//                //滚动到新添加的元数据那一行
////                revealItem(theItem);
//                var grid = dijit.byId("metadata_grid");
//                grid.refresh();
//            },100);
//        }
//    }
    if(form){
        var values = form.gatherFormValues(["useStyle","metadataType","autoSelect","metaCategory_select","metadata_pinyin"]);
        var item = {name:metadataName,dataType:values.metadataType,selected:values.autoSelect,pyName:values.metadata_pinyin + metadataName};
        var category = values["metaCategory_select"];
        var custom = true;
        var parentItem;
        if(category == item.name){
            alert("元数据名称与所属类型名称相同");
            return;
        }
        if(category){
            metadata_store.fetchItemByIdentity({identity:category,onItem:function(findItem){
//                custom表示元数据所属的分类是否自定义，方便存入数据库
                if(!findItem) item.custom = true;
                else{
                    item.custom = false;
                    parentItem = findItem;
                }
            }})
        }
        if(values.useStyle){
//            存入数据库
            var obj = {name:metadataName,dataType:item.dataType};
            var str = {items:[{name:category,custom:item.custom,children:[obj]}]};
//            dojo.toJson(str)中括号加了引号，两个中括号的引号不一致，所以暂时这样写
            var str = "{items:[{\"name\":\" "+
                category+
                "\", \"custom\":"+
                custom+
                ", \"children\": [{\"name\": \""+
                item.name+
                "\", \"dataType\": \""+
                item.dataType+"\"}]}]}"
//            var str = '{"items":{"name":'+category+
//                '","+"custom"+":"'
//                +custom+
//                '","+"children"+":"+[{"name": ' +
//                +item.name+
//                '","+"dataType"+":"'
//                +item.dataType+
//                '"}]}}"'
            postMetadata(str);
        }
        hideMetaDlg();
        var theItem;
        //添加元数据到表格中
        try {
            item.treeUrl = category + "/" + item.name;
            if(item.custom == true){
                var customItem = {name:category,treeUrl:category,selected:false};
                parentItem = metadata_store.newItem(customItem);
                metadata_store.newItem(item,{parent:parentItem,attribute:"children"});
            }else{
//                以前用的custom是表示用户自定义的元数据，改回
                item.custom = true;
                metadata_store.newItem(item,{parent:parentItem,attribute:"children"})
            }
        }catch (e) {
            alert("添加元数据失败:"+ e.description);
        }finally{
            var grid = dijit.byId("metadata_grid");
            setTimeout(function(){
                grid.refresh();
                expandGrid(grid,item.name);
                scrollToItem(grid,item.name);
            },100);
        }
    }
}
function postMetadata(str){
    dojo.xhrPost({
        url:"../cse/service/addMetadataPara.jsp",
        handleAs:"json",
        content:{
//            metadataParas:dojo.toJson(str).replace(/"[*]"/g,"[*]")
            metadataParas:str
        },
        load:function(data){
            alert("hello")
        },
        error:function(err){
            if(confirm("向数据库中添加元数据失败："+err.description+" 请重试")){
                postMetadata(str);
            }
        }
    });
}
function hideMetaDlg(){
    var dlg = dijit.byId("addMetaDataDlg");
    return dlg.hide();
}
function showAddMetadataDlg(name){
    var dlg = dijit.byId("addMetaDataDlg");
    dlg.show();
    //初始化对话框
    dojo.connect(dlg,"onLoad",function(){
        var editor_name = dijit.byId("metadata_name");
        if(editor_name) editor_name.set("value",name);
    });
//    var form;
//    if(form = dijit.byId("addMetadataForm")){
//        form.reset();
//    }
    var editor_name = dijit.byId("metadata_name");
    if(editor_name) editor_name.set("value",name);
    var editor_pinyin = dijit.byId("metadata_pinyin");
    if(editor_pinyin) editor_pinyin.set("value","");
}
function inputChanged(e){
    var select = this;
    //将显示从拼音改为汉字
    metadata_store.fetch({query:{pyName:e},queryOptions:{deep:true},onItem:function(item){
        select.set("value",metadata_store.getValue(item,"name"));
    }});
}
function hideMetaBorder(index){
    var imgs = dojo.query("#matadata_panel img");
    if(imgs&&imgs[index])
        dojo.style(imgs[index],"border","");
}
function showMetaBorder(index){
    var imgs = dojo.query("#matadata_panel img");
    if(imgs&&imgs[index])
        dojo.style(imgs[index],"border","1px solid orange");
}

function validateCategory(value,constraints){
    if(!value){
        var addCategory = dijit.byId("addMetaCategory");
        if(addCategory.get("value"))
            return true;
        else
            return false;
    }
    var found = false;
    metadata_store.fetchItemByIdentity({identity:value,onItem:function(item){
        if(item) found = true;
    }});
    return found;
}
function validateNotNull(value){
    if(!value)return false;
    else return true;
}
//function filterMDTreeUrl(store){
//    var items = [];
//    store.fetch({query:{children:undefined,selected:true},onItem:function(item){
//        items.push(store.getValue(item,"treeUrl"));
//    }})
//    return items;
//}
function filterMetedata(store){
    var items = dojo.filter(store._getItemsArray({deep:true}),function(item){
        if(item&&item.selected&&item.selected[0]&&!item.children) return true;
    });
    return items;
}
//当对话框显示，并切换到元数据选项卡时进行元数据的初始化，如果该组件的mdArray（默认元数据）或者userMDArray（用户自定义元数据）
//非空，就进行填充，如果都为空则填充默认store。
function initMDGrid(){
    var tabs = dijit.byId("PropsTab");
    dojo.aspect.after(tabs,"selectChild",function(page){
        if(page.id == "metadata"){
            dojo.connect(page,"onLoad",null,function(){
                initMetadataStore();
            })
        }
//        var grid;
//        setTimeout(function(){
//            if(grid = dijit.byId("metadata_grid")){
//                grid.refresh();
//            }
//        },100)
    },true)
}
function initMetadataStore(){
    var obj = dijit.byId("propsDialog").connectedComp;
    clearMetadataStore();
    if(obj.mdArray){
        fillMDdata(obj.mdArray);
//        showSelected();
//        return;
    }
    if(obj.userMDArray){
        fillMDdata(obj.userMDArray);
//        showSelected();
//        return;
    }
    var grid = dijit.byId("metadata_grid");
    if(grid.store != metadata_store){
        showSelected();
    }
//    showAll();
}
function fillMDdata(array){
    if(array){
        dojo.forEach(array,function(mdUrl){
            var name = getMDName(mdUrl);
            metadata_store.fetchItemByIdentity({identity:name,onItem:function(item){
                metadata_store.setValue(item,"selected",[true]);
            }})
        })
    }
}
function clearMetadataStore(){
    metadata_store.fetch({query:{name:"*"},queryOptions:{deep:true},onItem:function(item){
        if(item.selected&&item.selected[0]) metadata_store.setValue(item,"selected",[false]);
    }})
}

//元数据加载时，将拼音与名称相加，以方便同时支持中英文过滤
function mixinNameTopyName(items){
    dojo.forEach(items,function(item){
        item.pyName += item.name;
        if(item.children){
            if(!item.children.length) item.children = [item.children];
            mixinNameTopyName(item.children);
        }
    })
}
//在元数据加载时，根据item的children属性找回各自的parent，并将item的type设置为category，以区别元数据分类和元数据，但是在findTreeUrl时又会被销毁（因为store混乱）
function findParent(item){
    if(!item.length) item = [item];
    for(var i=0;i<item.length;i++){
        if(item[i].children){
            item[i].type = "category";
            var children = item[i].children;
            if(!children.length) children = [children];
            for(var j=0;j<children.length;j++)
            {
                children[j].parent = item[i];
                findParent(children[j]);
            }
        }
    }
}
//找到元数据的树路径，并将其赋给treeUrl属性，saveStore时treeUrl将被保存到mdArray。
function findTreeUrl(item){
    for(var i=0;i<item.length;i++){
        item[i].treeUrl = item[i].name;
        if(item[i].parent){
            item[i].treeUrl = item[i].parent.treeUrl + "/" +  item[i].treeUrl;
            item[i].parent = undefined;
        }
        if(item[i].children){
           findTreeUrl(item[i].children);
        }
    }
}
//根据元数据的treeUrl找到其名称
function getMDName(mdUrl){
    var names = mdUrl.split("/");
    var l = names.length;
    var name = names[l-1];
    return name;
}

//查找并返回选中的元数据，mdArray为默认元数据，userMDArray为自定义元数据。
function findMDArrays(){
    var arrays = {
        mdArray : [],
        userMDArray : []
    }
    metadata_store.fetch({query:{selected:true},queryOptions:{deep:true},onItem:function(item){
        if(!metadata_store.hasAttribute(item,"children")){
            if(metadata_store.getValue(item,"custom")){
                arrays.userMDArray.push(metadata_store.getValue(item,"treeUrl"));
            }else{
                arrays.mdArray.push(metadata_store.getValue(item,"treeUrl"));
            }
        }
    }})
    return arrays;
}
//function createMDDom(obj){
//    if(obj.mdArray){
//        dojo.forEach(obj.mdArray,function(){
//            var names = mdUrl.split("/");
//            dojo.forEach(names,function(){
//
//            })
//        })
//    }
//}
//function handleCategory(){
//    var metaCategory_select = dojo.byId("metaCategory_select");
//    var metadata_type = dojo.byId("metadata_type");
//    var checked = this.checked;
//    if(checked){
//        dojo.style(metadata_type.parentNode.parentNode,"display","none");
//        dojo.style(metaCategory_select.parentNode.parentNode.parentNode.parentNode,"display","none");
//    }else{
//        dojo.style(metadata_type.parentNode.parentNode,"display","block");
//        dojo.style(metaCategory_select.parentNode.parentNode.parentNode.parentNode,"display","block");
//    }
//}