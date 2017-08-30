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
import org.dom4j.Node;
import org.dom4j.XPath;
import org.dom4j.io.SAXReader;

import com.nwpu.lwg.util.constant.XMLConstants;

public class XSDReader {
	private Map<String, XSDElement> map = new HashMap<String, XSDElement>();

	/**
	 * 
	 * ����XSD���������ݽڵ�����б�
	 * 
	 * 
	 * 
	 * @param xsd
	 * 
	 * @return
	 * 
	 * @throws Exception
	 * 
	 */

	public Map<String, XSDElement> paserXSD(String xsd) throws Exception {

		SAXReader saxReader = new SAXReader();

		// ByteArrayInputStream byteArrayInputStream = new
		// ByteArrayInputStream(xsd.getBytes(BaseConstants.XM LENCODING));
		Map<String, String> map = new HashMap<String, String>();
		map.put("xs", XMLConstants.NAMESPACEADDRESS);
		File file = new File(xsd);
		saxReader.getDocumentFactory().setXPathNamespaceURIs(map);
		Document doc = saxReader.read(file);

		Element element = doc.getRootElement();

		String basePath = null;
		Element dataElement = null;
		String elementPath = null;

		elementPath = "//" + getXSDDefaultNamespace() + "element";

		if ("".equals(XMLConstants.MESSAGE)) {
			dataElement = element;
			List<Element> elementNodes = element.elements("element");
			for (Iterator<Element> iterator = elementNodes.iterator(); iterator
					.hasNext();) {
				Element element2 = (Element) iterator.next();
				paseData(element2, elementPath, "//");
			}
		} else {
			basePath = "//" + getXSDDefaultNamespace() + "element[@name=\""
					+ XMLConstants.MESSAGE + "\"]";
			dataElement = (Element) element.selectSingleNode(basePath);
			paseData(dataElement, elementPath, "//");
		}

		return this.map;

	}

	/**
	 * 
	 * ת��XSD�����ݽڵ㣬����XSDNode����
	 * 
	 * 
	 * 
	 * @param element
	 * 
	 * @param xPath
	 * 
	 * @param xsdPath
	 * 
	 * @param unboundedXpath
	 * 
	 */

	private String getXSDDefaultNamespace() {
		if ("".equals(XMLConstants.XSD_DEFAULT_NAMESPACE)) {
			return "";
		} else {
			return XMLConstants.XSD_DEFAULT_NAMESPACE + ":";
		}
	}

	public XSDElement paseData(Element element, String xsdPath,String XPath) {

		if (element == null)
			return new XSDElement();

		// ��ȡ�ڵ�name����
		String nodeName = element.attributeValue("name");

		if (nodeName == null) {
			nodeName = element.attributeValue("ref");
		}

		// ��װ��һ��elementԪ�ص�XPath

		String currentXsdPath = xsdPath + "[@name=\"" + nodeName + "\"]" + "/"
				+ getXSDDefaultNamespace()

				+ "complexType/" + getXSDDefaultNamespace() + "sequence/"
				+ getXSDDefaultNamespace()

				+ "element";

		// ���Ҹýڵ������е�elementԪ��

		List<Node> elementNodes = element.selectNodes(currentXsdPath);
		XSDElement xsdNode = getXSDElement(nodeName);

		if (elementNodes != null && elementNodes.size() > 0) {// ������滹��element,˵������Ҷ��

			Iterator<Node> nodes = elementNodes.iterator();

			while (nodes.hasNext()) {

				Element ele = (Element) nodes.next();

				XSDElement xsdChild = paseData(ele, currentXsdPath, XPath);

				xsdNode.addElement(xsdChild.getName(), xsdChild);
			}

		} // ��elementΪҶ��

		Node annotationText = element.selectSingleNode(xsdPath + "[@name=\""
				+ nodeName + "\"]/" + getXSDDefaultNamespace() + "annotation/"
				+ getXSDDefaultNamespace() + "documentation");
		

		if (annotationText != null)
			xsdNode.getAnnotation().setDocunmentText(
					annotationText.getText().trim());

		Element annotationLabel = (Element) element.selectSingleNode(xsdPath
				+ "[@name=\"" + nodeName + "\"]/" + getXSDDefaultNamespace()
				+ "annotation/" + getXSDDefaultNamespace() + "appInfo/"
				+ getXSDDefaultNamespace() + "meta.element");

		if (annotationLabel != null)
			xsdNode.getAnnotation().setDocumentLabel(
					annotationLabel.attributeValue("label"));

		List<Node> attributes = element.selectNodes(xsdPath + "[@name=\""
				+ nodeName + "\"]/" + getXSDDefaultNamespace() + "complexType/"
				+ getXSDDefaultNamespace() + "attribute");

		if (attributes != null && attributes.size() > 0) {// ������滹��element,˵������Ҷ��

			Iterator<Node> nodes = attributes.iterator();

			while (nodes.hasNext()) {

				Element attribute = (Element) nodes.next();

				String attributeName = attribute.attributeValue("name");
				String text = "";
				String label = "";
				Node attributeText = attribute.selectSingleNode(getXSDDefaultNamespace() + "annotation/"
						+ getXSDDefaultNamespace() + "documentation");

				if (attributeText != null)
					text = attributeText.getText().trim();

				Element attributeLabel = (Element) attribute
						.selectSingleNode(getXSDDefaultNamespace()
								+ "annotation/" + getXSDDefaultNamespace()
								+ "appInfo/" + getXSDDefaultNamespace()
								+ "meta.attribute");

				if (attributeLabel != null)
					label = attributeLabel.attributeValue("label");

				XMLAttribute XSDAttribute = new XMLAttribute();

				XSDAttribute.setName(attributeName);
				XSDAttribute.setDocunmentText(text);
				XSDAttribute.setDocumentLabel(label);

				xsdNode.addAttribute(attributeName, XSDAttribute);
			}

		}

		return xsdNode;

	}

	private XSDElement getXSDElement(String name) {
		Iterator iter = map.entrySet().iterator();
		while (iter.hasNext()) {
			Map.Entry entry = (Map.Entry) iter.next();
			String oldName = (String) entry.getKey();
			XSDElement val = (XSDElement) entry.getValue();
			if (name.equals(oldName)) {
				return val;
			}
		}
		XSDElement addElement = new XSDElement();
		addElement.setName(name);
		map.put(name, addElement);
		return addElement;
	}

	public static void main(String[] args) {

		try {
			String realPath = XSDReader.class.getResource("/").getPath();
			XSDReader xsdReader = new XSDReader();

			Map<String, XSDElement> nodes = xsdReader.paserXSD("RmConfig.cxsd");

			Iterator iter = nodes.entrySet().iterator();
			while (iter.hasNext()) {
				Map.Entry entry = (Map.Entry) iter.next();
				String key = (String) entry.getKey();
				XSDElement val = (XSDElement) entry.getValue();
				System.out.println(key);
			}
			int a = 1;
		} catch (Exception ex) {

			ex.printStackTrace();

		}

	}
}
