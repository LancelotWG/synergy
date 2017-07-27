package com.nwpu.lwg.util.action.transmission;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import com.nwpu.lwg.util.constant.XMLConstants;

public class XSDReader {
	private List<XSDNode> list = new ArrayList<XSDNode>();

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

	public List<XSDNode> paserXSD(String xsd) throws Exception {

		SAXReader saxReader = new SAXReader();

		// ByteArrayInputStream byteArrayInputStream = new
		// ByteArrayInputStream(xsd.getBytes(BaseConstants.XM LENCODING));

		Document doc = saxReader.read(xsd);

		Element element = doc.getRootElement();

		String basePath = null;
		Element dataElement = null;
		if ("".equals(XMLConstants.XSD_DEFAULT_NAMESPACE)) {
			if ("".equals(XMLConstants.MESSAGE)) {
				dataElement = element;
			} else {
				basePath = "//element[@name=\"" + XMLConstants.MESSAGE + "\"]";
				dataElement = (Element) element.selectSingleNode(basePath);
			}
		} else {
			basePath = "//" + XMLConstants.XSD_DEFAULT_NAMESPACE + ":element[@name=\"" + XMLConstants.MESSAGE + "\"]";
			dataElement = (Element) element.selectSingleNode(basePath);
		}

		String elementPath = null;
		if ("".equals(XMLConstants.XSD_DEFAULT_NAMESPACE)) {
			elementPath = "//element";
		} else {
			elementPath = "//" + XMLConstants.XSD_DEFAULT_NAMESPACE + ":element";
		}

		paseData(dataElement, "//", elementPath, "//");

		return list;

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

	public void paseData(Element element, String xPath, String xsdPath, String unboundedXpath) {

		if (element == null)
			return;

		// ��ȡ�ڵ�name����
		String nodeName = element.attributeValue("name");

		// ��װxml�ĵ��нڵ��XPath

		xPath += nodeName;

		unboundedXpath += nodeName;

		// ���ж�ڵ���������
		String maxOccurs = element.attributeValue("maxOccurs");

		if (maxOccurs != null && !"1".equals(maxOccurs) && !("//" + XMLConstants.MESSAGE + "").equals(xPath)) {// �ڵ�����ж��

			unboundedXpath += XMLConstants.XSD_UNBOUNDED;

		}

		// ��װ��һ��elementԪ�ص�XPath

		String currentXsdPath = xsdPath + "[@name=\"" + nodeName + "\"]" + "/" + XMLConstants.XSD_DEFAULT_NAMESPACE

				+ ":complexType/" + XMLConstants.XSD_DEFAULT_NAMESPACE + ":sequence/"
				+ XMLConstants.XSD_DEFAULT_NAMESPACE

				+ ":element";

		// ���Ҹýڵ������е�elementԪ��

		List<Node> elementNodes = element.selectNodes(currentXsdPath);

		if (elementNodes != null && elementNodes.size() > 0) {// ������滹��element,˵������Ҷ��

			Iterator<Node> nodes = elementNodes.iterator();

			while (nodes.hasNext()) {

				if (!xPath.endsWith("/")) {

					xPath += "/";

					unboundedXpath += "/";

				}

				Element ele = (Element) nodes.next();

				paseData(ele, xPath, currentXsdPath, unboundedXpath);

			}

		} else { // ��elementΪҶ��

			XSDNode xsdNode = new XSDNode();

			// ��ȡע�ͽڵ�

			String annotation = "";

			Node annotationNode = element

					.selectSingleNode(xsdPath + "[@name=\"" + nodeName + "\"]/" + XMLConstants.XSD_DEFAULT_NAMESPACE

							+ ":annotation/" + XMLConstants.XSD_DEFAULT_NAMESPACE + ":documentation");

			if (annotationNode != null)

				annotation = annotationNode.getText();

			// ��ȡ�ڵ���������

			String nodeType = "";

			Attribute type = element.attribute("type");

			if (type != null) {

				nodeType = type.getText();

			} else {

				String spath = xsdPath + "[@name=\"" + nodeName + "\"]/" + XMLConstants.XSD_DEFAULT_NAMESPACE
						+ ":simpleType/"

						+ XMLConstants.XSD_DEFAULT_NAMESPACE + ":restriction";

				Element typeNode = (Element) element.selectSingleNode(spath);

				if (typeNode != null) {

					Attribute base = typeNode.attribute("base");

					if (base != null)

						nodeType = base.getText();

				}

			}

			xsdNode.setName(nodeName);

			xsdNode.setXPath(xPath);

			xsdNode.setAnnotation(annotation);

			xsdNode.setType(nodeType);

			xsdNode.setUnboundedXpath(unboundedXpath);

			list.add(xsdNode);

		}

	}

	public static void main(String[] args) {

		try {
			String realPath = XSDReader.class.getResource("/").getPath();
			XSDReader xsdReader = new XSDReader();

			List<XSDNode> nodes = xsdReader.paserXSD(realPath + "/feature.xsd");

			for (XSDNode node : nodes) {
				System.out.println(node.getUnboundedXpath());
			}

		} catch (Exception ex) {

			ex.printStackTrace();

		}

	}
}
