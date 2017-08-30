package com.nwpu.lwg.util.xml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class XMLElement extends Element {
	private String XMLText = "";

	// 子节点
	private Map<String, XMLElement> elements = new LinkedHashMap<>();
	private List<XMLElement> children = new ArrayList<XMLElement>();
	
	//父节点
	private String parent = "";
	
	//id
	private String id = "";

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<XMLElement> getChildren() {
		return children;
	}

	public void setChildren(List<XMLElement> children) {
		this.children = children;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Map<String, XMLElement> getElements() {
		return elements;
	}

	public void setElements(Map<String, XMLElement> elements) {
		this.elements = elements;
	}

	public XMLElement getElement(String name) {
		return elements.get(name);
	}

	public void addElement(String name, XMLElement element) {
		this.elements.put(name, element);
	}

	public void addChildren(XMLElement element) {
		this.children.add(element);
	}
	
	public String getXMLText() {
		return XMLText;
	}

	public void setXMLText(String xMLText) {
		XMLText = xMLText;
	}
}
