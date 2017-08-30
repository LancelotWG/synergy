package com.nwpu.lwg.util.net;

import java.io.BufferedInputStream; 
import java.io.BufferedOutputStream; 
import java.io.File; 
import java.io.FileInputStream; 
import java.io.IOException; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.net.URLEncoder; 
 
import javax.servlet.http.HttpServletResponse; 
 
import org.apache.commons.lang3.StringUtils; 

public class DownloadUtils {
	/** 
	   * �ļ����ر��� 
	   * �ñ������������ļ����ı��뷽ʽ���Է����������ļ���ʱ������ 
	   */ 
	  private static String encoding = "GBK"; 
	   
	  /** 
	   * �ļ����� 
	   * @param response 
	   * @param filePath �ļ��ڷ������ϵ�·���������ļ��� 
	   */ 
	  public static void download(HttpServletResponse response, String filePath){ 
	    File file = new File(filePath); 
	    download(response, file, null, encoding); 
	  } 
	   
	  /** 
	   * �ļ����� 
	   * @param response 
	   * @param filePath �ļ��ڷ������ϵ�·���������ļ����� 
	   * @param fileName �ļ����ص�����������ƣ������������������ص��ļ����ƺͷ������ϵ��ļ�����һ���������øò��� 
	   */ 
	  public static void download(HttpServletResponse response, String filePath, String fileName){ 
	    File file = new File(filePath.toString()); 
	    download(response, file, fileName, encoding); 
	  } 
	   
	  /** 
	   * �ļ����� 
	   * @param response 
	   * @param filePath �ļ��ڷ������ϵ�·���������ļ����� 
	   * @param fileName �ļ����ص�����������ƣ������������������ص��ļ����ƺͷ������ϵ��ļ�����һ���������øò��� 
	   * @param encoding �ļ����Ʊ��� 
	   */ 
	  public static void download(HttpServletResponse response, String filePath, String fileName, String encoding){ 
	    File file = new File(filePath.toString()); 
	    download(response, file, fileName, encoding); 
	  } 
	   
	  /** 
	   * �ļ����� 
	   * @param response 
	   * @param file �ļ� 
	   * @param fileName �ļ����ص�����������ƣ������������������ص��ļ����ƺͷ������ϵ��ļ�����һ���������øò��� 
	   */ 
	  public static void download(HttpServletResponse response, File file) { 
	    download(response, file, null, encoding); 
	  } 
	   
	  /** 
	   * �ļ����� 
	   * @param response 
	   * @param file �ļ� 
	   * @param fileName �ļ����ص�����������ƣ������������������ص��ļ����ƺͷ������ϵ��ļ�����һ���������øò��� 
	   */ 
	  public static void download(HttpServletResponse response, File file, String fileName) { 
	    download(response, file, fileName, encoding); 
	  } 
	   
	  /** 
	   * �ļ����� 
	   * @param response 
	   * @param file �ļ� 
	   * @param fileName �ļ����ص�����������ƣ������������������ص��ļ����ƺͷ������ϵ��ļ�����һ���������øò��� 
	   * @param encoding �ļ����Ʊ��� 
	   */ 
	  public static void download(HttpServletResponse response, File file, String fileName, String encoding) { 
	    if(file == null || !file.exists() || file.isDirectory()){ 
	      return; 
	    } 
	     
	    // �����ָ���ļ����ص�����������ƣ���ʹ���ļ���Ĭ������ 
	    if (StringUtils.isBlank(fileName)) { 
	      fileName = file.getName(); 
	    } 
	 
	    try { 
	      InputStream is = new FileInputStream(file); 
	      download(response, is, fileName, encoding); 
	    } catch (IOException e) { 
	      e.printStackTrace(); 
	    } 
	  } 
	   
	  /** 
	   * �ļ����� 
	   * @param response 
	   * @param is �ļ������� 
	   * @param fileName ���ص��ļ����� 
	   * @throws IOException 
	   */ 
	  public static void download(HttpServletResponse response, InputStream is, String fileName){ 
	    download(response, is, fileName, encoding); 
	  } 
	   
	  /** 
	   * �ļ����� 
	   * @param response 
	   * @param is �ļ������� 
	   * @param fileName ���ص��ļ����� 
	   * @param encoding �����ʽ 
	   */ 
	  public static void download(HttpServletResponse response, InputStream is, String fileName, String encoding){ 
	    if(is == null || StringUtils.isBlank(fileName)){ 
	      return; 
	    } 
	     
	    BufferedInputStream bis = null; 
	    OutputStream os = null; 
	    BufferedOutputStream bos = null; 
	     
	    try{ 
	      bis = new BufferedInputStream(is); 
	      os = response.getOutputStream(); 
	      bos = new BufferedOutputStream(os); 
	      response.setContentType("application/octet-stream;charset=" + encoding); 
	      response.setCharacterEncoding(encoding); 
	      response.setHeader("Content-disposition", "attachment;filename="+ URLEncoder.encode(fileName, encoding)); 
	      byte[] buffer = new byte[1024]; 
	      int len = bis.read(buffer); 
	      while(len != -1){ 
	        bos.write(buffer, 0, len); 
	        len = bis.read(buffer); 
	      } 
	       
	      bos.flush(); 
	    }catch(IOException e){ 
	      e.printStackTrace(); 
	    }finally{ 
	      if(bis != null){ 
	        try{ 
	          bis.close(); 
	        }catch(IOException e){} 
	      } 
	       
	      if(is != null){ 
	        try{ 
	          is.close(); 
	        }catch(IOException e){} 
	      } 
	    } 
	  } 
	 
	  public static String getEncoding() { 
	    return encoding; 
	  } 
	 
	  public static void setEncoding(String encoding) { 
	    DownloadUtils.encoding = encoding; 
	  } 
}
