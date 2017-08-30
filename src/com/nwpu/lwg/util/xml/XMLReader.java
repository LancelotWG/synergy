package com.nwpu.lwg.util.xml;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class XMLReader {
	
	private static final String JSON_FITERINGSELECT_STR_1 = "{identifier:\"id\",label: \"name\", items:";
	private static final String JSON_FITERINGSELECT_STR_2 = "}";
	
	public Map<String, XSDElement> map = new HashMap<String, XSDElement>();
	public List<XMLElement> list = new ArrayList<XMLElement>();
	private XMLElement root;
	
	public XMLElement parserXML(String XMLPath) throws Exception {
		// 创建SAXReader对象
		SAXReader reader = new SAXReader();
		// 读取文件 转换成Document
		Document document = reader.read(new File(XMLPath));
		// 获取根节点元素对象
		Element root = document.getRootElement().element("root");
		// 遍历
		this.root = listNodes(root);
		//xmlChild.setParent("null");
		this.list.add(this.root);
		return this.root;
	}
	
	// 遍历当前节点下的所有节点
	public XMLElement listNodes(Element node) {
		XMLElement xmlNode = new XMLElement();
		
		String name = node.getName();
		String text = "";
		String label = "";
		XSDAnnotation xsdAnnotation = map.get(name).getAnnotation();
		if(xsdAnnotation != null){
			text = xsdAnnotation.getDocunmentText();
			label =  xsdAnnotation.getDocumentLabel();
			if(label == null || label.equals("")){
				xmlNode.setName(name);
			}else{
				xmlNode.setName(label);
			}
		}else{
			xmlNode.setName(name);
		}
		xmlNode.setId(name);
		//System.out.println("当前节点的名称：" + name);
		// 首先获取当前节点的所有属性节点
		List<Attribute> list = node.attributes();
		// 遍历属性节点
		for (Attribute attribute : list) {
			XMLAttribute xmlAttribute = new XMLAttribute();

			String attributeName = attribute.getName();
			String attributeVaule = attribute.getValue();
			String attributeText = "";
			String attributeLabel = "";
			XMLAttribute xsdAttribute = map.get(name).getAttribute(attributeName);
			if(xsdAttribute != null){
				attributeText = xsdAttribute.getDocunmentText();
				attributeLabel =  xsdAttribute.getDocumentLabel();
			}
			
			xmlAttribute.setName(attributeName);
			xmlAttribute.setDocunmentText(attributeText);
			xmlAttribute.setDocumentLabel(attributeLabel);
			xmlAttribute.setValue(attributeVaule);

			xmlNode.addAttribute(attributeName, xmlAttribute);
		}
		// 如果当前节点内容不为空，则输出
		if (!(node.getTextTrim().equals(""))) {
			xmlNode.setXMLText(node.getText());
		}
		// 同时迭代当前节点下面的所有子节点
		// 使用递归
		Iterator<Element> iterator = node.elementIterator();
		while (iterator.hasNext()) {
			Element e = iterator.next();
			XMLElement xmlChild = listNodes(e);
			xmlChild.setParent(name);
			this.list.add(xmlChild);
			xmlNode.addElement(e.getName(), xmlChild);
			xmlNode.addChildren(xmlChild);
		}
		return xmlNode;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try {
			String realPath = XSDReader.class.getResource("/").getPath();
			XMLReader xmlReader = new XMLReader();
			XSDReader xsdReader = new XSDReader();
			Map<String, XSDElement> nodes = xsdReader.paserXSD("RmConfig.cxsd");
			xmlReader.map = nodes;
			XMLElement xmlElement = xmlReader.parserXML("rm.cfg");
			List<XMLElement> list = xmlReader.list;
			List<XMLElement> list2 = xmlElement.getChildren();
			JSONArray jsonObject = JSONArray.fromObject(xmlElement.getChildren());	
			JSONArray jsonArray = JSONArray.fromObject(list);	
			String json = jsonArray.toString();
			
			//System.out.println(json);
			//System.out.println(jsonObject);
			System.out.println(jsonArray);
			//xmlReader.showJson();
			int a = 1;
		} catch (Exception ex) {

			ex.printStackTrace();

		}

	}

	/*public String showJson() {
		List jsonList = new ArrayList();
		List rootList = new ArrayList();
		Map rootMap = new HashMap<String, Object>();
		rootMap.put("type", "root");
		rootMap.put("id", "objectId");
		rootMap.put("name", "A");
		String childStr = "[{_reference:1}]";
		rootMap.put("children", childStr);
		rootList.add(rootMap);

		Map rootMap1 = new HashMap<String, Object>();
		rootMap1.put("parentId", "");
		rootMap1.put("type", "child");
		rootMap1.put("name", "b-1");
		rootMap1.put("id", "2");
		jsonList.add(rootMap1);

		Map rootMap2 = new HashMap<String, Object>();
		rootMap2.put("parentId", "1");
		rootMap2.put("type", "child");
		rootMap2.put("name", "b-2");
		rootMap2.put("id", "7");
		jsonList.add(rootMap2);
		Map rootMap3 = new HashMap<String, Object>();
		rootMap3.put("parentId", "1");
		rootMap3.put("type", "child");
		rootMap3.put("name", "b-3");
		rootMap3.put("id", "4");
		jsonList.add(rootMap3);
		Map rootMap4 = new HashMap<String, Object>();
		rootMap4.put("parentId", "361");
		rootMap4.put("type", "child");
		rootMap4.put("name", "b-4");
		rootMap4.put("id", "6");
		jsonList.add(rootMap4);

		Map rootMap8 = new HashMap<String, Object>();
		rootMap8.put("parentId", "0");
		rootMap8.put("type", "parent");
		rootMap8.put("ispage", "0");
		rootMap8.put("name", "B");

		rootMap8.put("id", "1");
		String childStr1 = "[{_reference:2},{_reference:7},{_reference:4},{_reference:6}]";
		rootMap8.put("children", childStr1);
		jsonList.add(rootMap8);
		JSONArray jsonArray = JSONArray.fromObject(jsonList);
		JSONArray rootJsonArray = JSONArray.fromObject(rootList);
		String json = jsonArray.toString();
		String rootJson = rootJsonArray.toString();
		try {
			json = json.replace("\"\\[", "\\[");
			json = json.replace("\\]\"", "\\]");
			rootJson = rootJson.replace("\"\\[", "\\[");
			rootJson = rootJson.replace("\\]\"", "\\]");
			if (!"[]".equals(json)) {
				json = json.substring(0, json.length() - 1);
				json = this.JSON_FITERINGSELECT_STR_1 + json;
				rootJson = rootJson.substring(1, rootJson.length() - 1);
				json = json + "," + rootJson;
			} else {
				json = this.JSON_FITERINGSELECT_STR_1 + "[";
				rootJson = rootJson.substring(1, rootJson.length() - 1);
				json = json + rootJson;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		json = json + "]" + this.JSON_FITERINGSELECT_STR_2;
		try {
			json = json.replaceAll("\"\\[", "\\[");
			json = json.replaceAll("\\]\"", "\\]");
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("json========" + json);
		return json;
	}*/
		 
}
