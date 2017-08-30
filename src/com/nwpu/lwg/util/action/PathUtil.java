package com.nwpu.lwg.util.action;

import java.io.File;

import com.nwpu.lwg.util.constant.ControlUtil;

public class PathUtil {
	public static String resourceJson = "resource\\json\\";
	public static String resourceXML = "resource\\xml\\";
	public static String resourceTemplate = "resource\\xml\\template\\";
	public static String resourceHTML = "resource\\html\\";
	public static String resourceImage = "resource\\image\\";
	public static String resourceApp = "resource\\app\\";
	public static String userXML = "upload\\userdata\\xml\\";
	public static String userData = "upload\\userdata\\data\\";
	public static String userCode = "upload\\userdata\\code\\";
	public static String groupXML = "upload\\groupdata\\xml\\";
	public static String groupCode = "upload\\groupdata\\code\\";
	public static String groupData = "upload\\groupdata\\data\\";
	public static String output = "output\\";
	public static String temp = "temp\\";
	public static String[] component = { "CL\\", "IO\\", "RM\\" };
	public static String[] dataConfigXSDForward = { "Cl", "IO", "Rm" };
	public static String[] dataConfigForward = { "cl", "io", "rm" };
	public static String os = "OS\\";
	public static String bus = "BUS\\";
	public static String logic = "logic\\";
	public static String model = "model\\";
	/*public static String[] modelConfigName = {"CL_MOD.cfg","IO_MOD.cfg","RM_MOD.cfg"};*/
	public static String logicFile = "_LOGIC.cfg";
	public static String modelFile = "_MOD.cfg";
	
	public static String dataConfigXSD = "Config.cxsd";
	public static String dataConfig = ".cfg";
	
	private PathUtil() {

	}

	private static String getBasePath(String base, ControlUtil.OperationModel operationModel, String name,
			String processName, boolean isTemp) {
		name = name + "\\";
		processName = processName + "\\";
		String offset = null;
		switch (operationModel) {
		case user:
			offset = userXML;
			break;
		case group:
			offset = groupXML;
			break;
		default:
			break;
		}
		if (isTemp) {
			return base + offset + name + processName + temp;
		} else {
			return base + offset + name + processName + output;
		}
	}

	private static String getBaseDataPath(String base, ControlUtil.OperationModel operationModel, String name) {
		name = name + "\\";
		String offset = null;
		switch (operationModel) {
		case user:
			offset = userData;
			break;
		case group:
			offset = groupData;
			break;
		default:
			break;
		}
		return base + offset + name;

	}
	
	private static String getBaseCodePath(String base, ControlUtil.OperationModel operationModel, String name) {
		name = name + "\\";
		String offset = null;
		switch (operationModel) {
		case user:
			offset = userCode;
			break;
		case group:
			offset = groupCode;
			break;
		default:
			break;
		}
		return base + offset + name;

	}

	private static String getBaseTemplatePath(String base, String templateName) {
		templateName = templateName + "\\";
		String offset = resourceTemplate;
		return base + offset + templateName;
	}

	private static String getComponentPath(ControlUtil.ElementType elementType) {
		String model = null;
		switch (elementType) {
		case BUS:
			model = bus;
			break;
		case CL:
			model = component[0];
			break;
		case OS:
			model = os;
			break;
		case IO:
			model = component[1];
			break;
		case RM:
			model = component[2];
		default:
			break;
		}
		return model;
	}

	public static String getPath(String base, ControlUtil.OperationModel operationModel, String name,
			String processName, ControlUtil.ElementType elementType) {
		String basePath = getBasePath(base, operationModel, name, processName, false);
		String offsetPath = getComponentPath(elementType);
		String PATH = basePath + offsetPath;
		File path;
		path = new File(PATH);
		if (!path.exists())
			path.mkdirs();
		return PATH;
	}

	public static String getTempPath(String base, ControlUtil.OperationModel operationModel, String name,
			String processName, ControlUtil.ElementType elementType) {
		String basePath = getBasePath(base, operationModel, name, processName, true);
		String offsetPath = getComponentPath(elementType);
		String PATH = basePath + offsetPath;
		File path;
		path = new File(PATH);
		if (!path.exists())
			path.mkdirs();
		return PATH;
	}

	public static String getCodePath(String base, ControlUtil.OperationModel operationModel, String name) {
		String PATH = getBaseCodePath(base, operationModel, name);
		File path;
		path = new File(PATH);
		if (!path.exists())
			path.mkdirs();
		return PATH;
	}
	
	public static String getDataPath(String base, ControlUtil.OperationModel operationModel, String name) {
		String PATH = getBaseDataPath(base, operationModel, name);
		File path;
		path = new File(PATH);
		if (!path.exists())
			path.mkdirs();
		return PATH;
	}

	public static String getTemplatePath(String base, String templateName, ControlUtil.ElementType elementType) {
		String basePath = getBaseTemplatePath(base, templateName);
		String offsetPath = getComponentPath(elementType);
		String PATH = basePath + offsetPath;
		File path;
		path = new File(PATH);
		if (!path.exists())
			path.mkdirs();
		return PATH;
	}
	
	public static String getTemplateModelPath(String base, String templateName, ControlUtil.ElementType elementType,String version){
		String PATH = getTemplatePath(base, templateName, elementType);
		return PATH + version + "\\";
	}
	
	public static String getTemplateSubModelPath(String base, String templateName, ControlUtil.ElementType elementType,String version){
		String PATH = getTemplatePath(base, templateName, elementType);
		return PATH + version + "\\" + "model\\";
	}
}
