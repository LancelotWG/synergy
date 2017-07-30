package com.nwpu.lwg.util.action.transmission;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.util.Iterator;
import java.util.List;

import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.xml.sax.InputSource;

import com.nwpu.lwg.util.constant.ControlUtil;
import com.nwpu.lwg.util.constant.SeparatorUtil;

public class FileParser {
	private FileParser(){
		
	}
	
	public static File context2Cfg(String data,String fileName,String directory){
		StringReader reader = new StringReader(data);
		InputSource source = new InputSource(reader);
		SAXBuilder sb = new SAXBuilder();
		FileOutputStream stream = null;
		try {
			Document doc = sb.build(source);
			Format format = Format.getPrettyFormat();
			format.setEncoding("gb2312");
			// format.setOmitDeclaration(true);
			XMLOutputter XMLOut = new XMLOutputter(format);
			// 如果文件不存在，会自动创建文件
			stream = new FileOutputStream(directory + fileName + ".cfg");
			XMLOut.output(doc, stream);
			// XMLOut.output(doc, response.getOutputStream());
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JDOMException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (stream != null)
				try {
					stream.close();
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
		}
		return null;
	}
	
	public static String cfg2Data(ControlUtil.CFGType CFGType,String fileName,String directory){
		String data = "";		
		File busConfigure = new File(directory + fileName);
			SAXReader saxReader = new SAXReader();
			org.dom4j.Document document = null;
			try {
				document = saxReader.read(busConfigure);
			} catch (DocumentException e) {
				// TODO 自动生成的 catch 块
				e.printStackTrace();
			}
			Element configElement = document.getRootElement();
			Element rootElement = configElement.element("root");
			Element modelConfigElements = null;
		switch (CFGType) {
		case BUS:		
			List<Element> elements = rootElement.elements();
			for (Iterator iterator = elements.iterator(); iterator.hasNext();) {
				Element element = (Element) iterator.next();
				String elementName = element.getName();
				List<Element> dataElements = element.elements();
				data = data + SeparatorUtil.busItem + elementName;
				for (Iterator iterator1 = dataElements.iterator(); iterator1.hasNext();) {
					Element element1 = (Element) iterator1.next();
					data = data + SeparatorUtil.busDataID + element1.attributeValue("DATA_ID");
					data = data + SeparatorUtil.busDataType + element1.attributeValue("DATA_TYPE");
				}
			}		
			break;
		case OSVersion:

			break;
		case OSTimeConfigure:

			break;
		case componentData:
			modelConfigElements = rootElement.element("Model_Config");
			Element fromDataElement = modelConfigElements.element("From_Data");
			List<Element> dataElements = fromDataElement.elements();
			data = data + SeparatorUtil.componentItem + "from";
			for (Iterator iterator = dataElements.iterator(); iterator.hasNext();) {
				Element element = (Element) iterator.next();
				data = data + SeparatorUtil.componentDataName + element.attributeValue("Data_Name");
				data = data + SeparatorUtil.componentDataType + element.attributeValue("Data_Type");	
			}
			Element toDataElement = modelConfigElements.element("To_Data");
			dataElements = toDataElement.elements();
			data = data + SeparatorUtil.componentItem + "to";
			for (Iterator iterator = dataElements.iterator(); iterator.hasNext();) {
				Element element = (Element) iterator.next();
				data = data + SeparatorUtil.componentDataName + element.attributeValue("Data_Name");
				data = data + SeparatorUtil.componentDataType + element.attributeValue("Data_Type");	
			}	
			break;
		case componentModel:
			modelConfigElements = rootElement.element("Model_Config");
			List<Element> subModelElements = modelConfigElements.elements("Sub_Model");
			data = data + SeparatorUtil.componentItem + "model";
			for (Iterator iterator = subModelElements.iterator(); iterator.hasNext();) {
				Element element = (Element) iterator.next();
				data = data + SeparatorUtil.componentModel + element.attributeValue("Sub_Model_Name");	
			}
			break;
		case componentLogic:

			break;
		default:
			break;
		}
		return data;
	}
	
	
}
