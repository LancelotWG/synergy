package com.nwpu.lwg.util.xml;

import java.util.HashMap;
import java.util.Map;

public class XSDElement extends Element {
	
	// 节点描述
	private XSDAnnotation annotation = new XSDAnnotation();
	
	// 子节点
	private Map<String, XSDElement> elements = new HashMap<>();
	
	public XSDAnnotation getAnnotation() {

		return annotation;

	}
	
	public Map<String, XSDElement> getElements() {
		return elements;
	}

	public void setElements(Map<String, XSDElement> elements) {
		this.elements = elements;
	}
	
	public XSDElement getElement(String name) {
		return elements.get(name);
	}

	public void addElement(String name, XSDElement element) {
		this.elements.put(name, element);
	}
}
