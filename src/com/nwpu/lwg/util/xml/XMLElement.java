package com.nwpu.lwg.util.xml;

import java.util.HashMap;
import java.util.Map;

public class XMLElement extends Element {
	private String XMLText = "";

	// вс╫з╣Ц
	private Map<String, XMLElement> elements = new HashMap<>();

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

	public String getXMLText() {
		return XMLText;
	}

	public void setXMLText(String xMLText) {
		XMLText = xMLText;
	}
}
