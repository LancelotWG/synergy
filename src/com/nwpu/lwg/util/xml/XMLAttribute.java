package com.nwpu.lwg.util.xml;

public class XMLAttribute {

	//������
	private String name;
	
	//����ֵ
	private String value = "";

	// �ĵ���
	private String documentLabel;
	
	// �ĵ��ı�
	private String docunmentText;
	
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDocumentLabel() {
		return documentLabel;
	}

	public void setDocumentLabel(String documentLabel) {
		this.documentLabel = documentLabel;
	}

	public String getDocunmentText() {
		return docunmentText;
	}

	public void setDocunmentText(String docunmentText) {
		this.docunmentText = docunmentText;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
