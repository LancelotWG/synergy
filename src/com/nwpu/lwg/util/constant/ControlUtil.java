package com.nwpu.lwg.util.constant;

public interface ControlUtil {
	//�ͻ������ݴ��䷽ʽ
	public enum ClientTransmissionType {
		context, file
	};
	// �ͻ����ļ�����
	public enum ClientType {
		data, cfg
	};
	// ���������ļ���ʽ
	public enum ServerType {
		data, cfg, codeResource, codeHead
	};

	// ��������ģʽ
	public enum OperationModel {
		user, group
	};

	// ������
	public enum ElementType {
		BUS, RM, CL, IO, OS
	};

	//�������
	public final static String ComponentRM = "RM";
	public final static String ComponentCL = "CL";
	public final static String ComponentIO = "IO";
	//xml�ļ����
	public enum CFGType {
		BUS, OSVersion, OSTimeConfigure, componentModel, componentLogic, componentData, normal
	};
	/*
	 * //xml�ļ���� public final int OSVersion = 1; public final int
	 * OSTimeConfigure = 2; public final int componentModel = 3; public final
	 * int componentLogic = 4; public final int componentData = 5; //������ public
	 * final int BUS = 0; public final int RM = 1; public final int CL = 2;
	 * public final int IO = 3; public final int OS = 4; //��������ģʽ public final
	 * int modelUser = 0; public final int modelGroup = 1; //�ϴ�Դ��ʽ public final
	 * int content = 0; public final int file = 1; //�����ļ����� public final int
	 * data = 0; public final int cfg = 1;
	 */
}
