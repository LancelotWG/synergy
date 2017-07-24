
function getRemoteUrl(flag){
    if(flag) return "../";
    //如果将Editor分布式部署在其他电脑上，可以采用下面的方式，从配置文件settings.properties中读取cse所在电脑的主机名与端口号
    //但此时Editor与cse的一些交互将编程跨域访问，例如上传就是一个跨域访问，使用Iframe进行JSONP跨域访问尚未测试成功，不能使用
    return dojo.xhrGet({
        url:"jsp/getProperties.jsp?method=get&remoteUrl=true",
        handleAs:"text",
        load:function(data){
            return data;
        },
        error: function(error){
            alert("从配置文件中读取远程主机名与端口号失败!\n"+error.description);
            dijit.byId("uploadDlg").onCancel();
        }
    });
}
function uploadProcessFile(id){
    var str;
    if(dijit.byId(id))
        str = dijit.byId(id).get("value");
    else
        str = id;
    var json = {};
    var array = [];
    dojo.forEach(getAllParallels(process),function(parallel){
        var obj = {};
        obj[parallel.name] = parallel.serializeLines();
        array.push(obj);
    });
    json["lines"] = array;
    var options = startStyle=="new" ? {
    			  creator:creator,
            createdTime:new Date().toLocaleString(),
            objectModelId:objectModelId} : {workflowId:workflowId};
    var defer = getRemoteUrl(true);
    function prepareXhrArgs(remoteUrl){
        var url = remoteUrl ? remoteUrl : "";
        return {
            url: url + "cse/" +  (startStyle=="new" ? "uploadProcessFile.jsp" : "editWorkflow.jsp"),
            handleAs: "text",
            content: dojo.mixin({
                name:process.name,
                description:process.description,
                fileContent:str,
                view:process.node.outerHTML,
                lines:dojo.toJson(json)
            },options),
            load: function(data){
//                dojo.publish("uploadMessageTopic",
//                    [ "上传成功"]
//                );
                alert("上传成功");
                var workflowId = dojo.trim(data).substring(4);
                dijit.byId("uploadDlg").onCancel();
                window.location = url + "cse/showWorkflow.jsp?workflowId=" + workflowId;
            },
            error: function(error){
                alert("上传失败!\n"+error.description);
                dijit.byId("uploadDlg").onCancel();
            }
        };
    }
    return dojo.when(defer,function(data){
//        var iframe = dojo.require("dojo.request.iframe");
//        iframe.post((data?dojo.trim(data):"")+"cse/portals/PSMPortal/uploadProcessFile.jsp",{
//            data:dojo.mixin({
//                name:process.name,
//                description:process.description,
//                fileContent:str,
//                view:process.node.outerHTML,
//                lines:dojo.toJson(json)
//            },options),
//            timeout:5000,
//            preventCache:true
//        }).then(function(){
//                dojo.publish("uploadMessageTopic",
//                    [ "上传成功"]
//                );
//            },function(err){
//                alert("上传失败!"+err.description);
//            });
        dojo.xhrPost(prepareXhrArgs(dojo.trim(data)));
    });
}
/**
 * 调用xsltTransform.jsp来处理流程文件的格式转换
 * @param type：用来缓存返回的流程内容的dijit部件的id，或者一个对象的引用（打开其他类型的流程文件时使用了这种方法来得到返回值）
 * @param dom:流程对象树DOM，需要进行预处理，可以为null
 * @param methodName：XSL文件的名字，同时也是预处理类BeforeXslt中对应的方法名
 * @param id：可选的，一个DOM元素的id，如果提供了此值，会将此DOM元素的innerText属性填充为流程文件的内容
 * @return {*}:返回一个dojo.Deferred对象
 */
function xsltTransfer(type,dom,methodName,id){
    //如果methodName不存在说明不需要模板转换，直接返回true
    if(!methodName) return true;
    var defer = dom ? reconnectSource(methodName,dom) : true;
    return dojo.when(defer,function(){
        return dojo.xhrGet({
            url:"jsp/xsltTransfrom.jsp?XML="+tempProcessFileUrl+"&XSL=xml/"+methodName+".xsl&PMA=GoodBye",
            handleAs:"text",
            load: function(data){
                var index = data.indexOf("<");
                tempProcessFileUrl = dojo.trim(data.substring(0,index));
                var content = data.substring(index);
                //如果type是一个dijit部件的id,那么就将转换后的内容放在该dijit部件的value属性中去
                //否则，就直接将转换后的内容放在type参数中
                if(dojo.isString(type)&&dijit.byId(type))
                    dijit.byId(type).set("value",content);
                else if(dojo.isObject(type)&&"content" in type) type.content = content;
                if(id)
                    dojo.byId(id).innerText = content;
                return content;
            },
            error: function(error){
                alert(error.description);
            }
        });
    });
}
function upload(){
    var type;
    var typeSelect = dijit.byId("fileFormat");
    var options = typeSelect.options;
    for(var i=0;i<options.length;i++){
        if(options[i].selected){
            switch(i){
                case 0:
                    type = "uploadAsCSEEditor";break;
                case 1:
                    type = "uploadAsUengine";break;
                default:
                    type = "uploadAsTemplate";
            }
            break;
        }
    }
    var defer2 = loadContentDeferred("uploadForm","uploadAsCSEEditor");
    defer2.then(function(){
        var dom = dijit.byId("uploadForm").sourceDom;
        var cache = {content:""};
        var defer = xsltTransfer(cache,dom,type=="uploadAsUengine"?"toUengine":(type=="uploadAsCSEEditor"?"toCSEEditor":""));
        dojo.when(defer,function(){
            uploadProcessFile(cache.content)
        });
    });
}