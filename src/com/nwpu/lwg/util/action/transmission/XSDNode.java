package com.nwpu.lwg.util.action.transmission;

public class XSDNode {
	// �ڵ�����
	private String name;

	// �ڵ�XPath
	private String xPath;

	// �ڵ�����
	private String annotation;

	// �ڵ�����
	private String type;

	// ҵ����·��,����·���е�unbound�ڵ�
	private String unboundedXpath;

	private String isUnbounded;

	public String getName() {

		return name;

	}

	public void setName(String name) {

		this.name = name;

	}

	public String getXPath() {

		return xPath;

	}

	public void setXPath(String path) {

		xPath = path;

	}

	public String getAnnotation() {

		return annotation;

	}

	public void setAnnotation(String annotation) {

		this.annotation = annotation;

	}

	public String getType() {

		return type;

	}

	public void setType(String type) {

		this.type = type;

	}

	public String getUnboundedXpath() {

		return unboundedXpath;

	}

	public void setUnboundedXpath(String unboundedXpath) {

		this.unboundedXpath = unboundedXpath;

	}

	public String getIsUnbounded() {
		return isUnbounded;
	}

	public void setIsUnbounded(String isUnbounded) {
		this.isUnbounded = isUnbounded;
	}
}
