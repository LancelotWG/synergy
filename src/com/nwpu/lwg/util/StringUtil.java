package com.nwpu.lwg.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
/**
 * 字符串工具类
 * @author Li Yongqiang
 */
public class StringUtil {
	public static Random random = new Random();
	/**
	 * 获取当前时间字符�?
	 * @return 当前时间字符�?
	 */
	public static String getStringTime(){
		Date date = new Date();//获取当前系统时间
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSSS");//设置格式化格�?
		return sdf.format(date);//返回格式化后的时�?
	}
	/**
	 * 生成订单�?
	 * @return 订单�?
	 */
	public static String createOrderId(){
		StringBuffer sb = new StringBuffer();//定义字符串对�?
		sb.append(getStringTime());//向字符串对象中添加当前系统时�?
		for (int i = 0; i < 3; i++) {//随机生成3位数
			sb.append(random.nextInt(9));//将随机生成的数字添加到字符串对象�?
		}
		return sb.toString();//返回字符�?
	}
	/**
	 * 验证字符串的有效�?
	 * @param s 验证字符�?
	 * @return 是否有效的布尔�??
	 */
	public static boolean validateString(String s){
		if(s != null && s.trim().length() > 0){//如果字符串不为空返回true
			return true;
		}
		return false;//字符串为空返回false
	}
	/**
	 * 验证浮点对象的有效�??
	 * @param f 浮点对象
	 * @return 是否有效的布尔�??
	 */
	public static boolean validateFloat(Float f){
		try {
			if(f != null && f > 0){
				return true;
			}
		} catch (Exception e) {}
		return false;
	}
}
