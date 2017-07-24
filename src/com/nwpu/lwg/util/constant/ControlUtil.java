package com.nwpu.lwg.util.constant;

public interface ControlUtil {
	//客户端数据传输方式
	public enum ClientTransmissionType {
		context, file
	};
	// 客户端文件类型
	public enum ClientType {
		data, cfg
	};
	// 服务器端文件格式
	public enum ServerType {
		data, cfg, codeResource, codeHead
	};

	// 工程运行模式
	public enum OperationModel {
		user, group
	};

	// 组件类别
	public enum ElementType {
		BUS, RM, CL, IO, OS
	};

	//主键类别
	public final static String ComponentRM = "RM";
	public final static String ComponentCL = "CL";
	public final static String ComponentIO = "IO";
	//xml文件类别
	public enum CFGType {
		BUS, OSVersion, OSTimeConfigure, componentModel, componentLogic, componentData, normal
	};
	/*
	 * //xml文件类别 public final int OSVersion = 1; public final int
	 * OSTimeConfigure = 2; public final int componentModel = 3; public final
	 * int componentLogic = 4; public final int componentData = 5; //组件类别 public
	 * final int BUS = 0; public final int RM = 1; public final int CL = 2;
	 * public final int IO = 3; public final int OS = 4; //工程运行模式 public final
	 * int modelUser = 0; public final int modelGroup = 1; //上传源格式 public final
	 * int content = 0; public final int file = 1; //保存文件类型 public final int
	 * data = 0; public final int cfg = 1;
	 */
}
