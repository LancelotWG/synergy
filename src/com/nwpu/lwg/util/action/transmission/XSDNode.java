package com.nwpu.lwg.util.action.transmission;

public class XSDNode {
	// 节点名称
	private String name;

	// 节点XPath
	private String xPath;

	// 节点描述
	private String annotation;

	// 节点类型
	private String type;

	// 业务用路径,描述路径中的unbound节点
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
