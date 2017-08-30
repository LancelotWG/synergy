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
	 * 解析XSD，返回数据节点对象列表
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
	 * 转换XSD的数据节点，生成XSDNode对象
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

		// 获取节点name属性
		String nodeName = element.attributeValue("name");

		if (nodeName == null) {
			nodeName = element.attributeValue("ref");
		}

		// 组装下一个element元素的XPath

		String currentXsdPath = xsdPath + "[@name=\"" + nodeName + "\"]" + "/"
				+ getXSDDefaultNamespace()

				+ "complexType/" + getXSDDefaultNamespace() + "sequence/"
				+ getXSDDefaultNamespace()

				+ "element";

		// 查找该节点下所有的element元素

		List<Node> elementNodes = element.selectNodes(currentXsdPath);
		XSDElement xsdNode = getXSDElement(nodeName);

		if (elementNodes != null && elementNodes.size() > 0) {// 如果下面还有element,说明不是叶子

			Iterator<Node> nodes = elementNodes.iterator();

			while (nodes.hasNext()) {

				Element ele = (Element) nodes.next();

				XSDElement xsdChild = paseData(ele, currentXsdPath, XPath);

				xsdNode.addElement(xsdChild.getName(), xsdChild);
			}

		} // 该element为叶子

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

		if (attributes != null && attributes.size() > 0) {// 如果下面还有element,说明不是叶子

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
