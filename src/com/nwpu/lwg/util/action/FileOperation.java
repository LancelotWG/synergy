package com.nwpu.lwg.util.action;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public final class FileOperation {
	public static boolean checkFileExist(String basePath, String projectName){
		String path = basePath + PathUtil.groupData + projectName + "\\";
		projectName += ".data";
		File file = new File(path + projectName);
		if(!file.exists()){
			return false;
		}
		return true;
	}
	public static String loadFile(String basePath, String projectName){
		String path = basePath + PathUtil.groupData + projectName + "\\";
		projectName += ".data";
		String result = "";
		File file = new File(path + projectName);
		if (!file.exists()) {
			return "";
		}
		FileReader fr = null;
		BufferedReader reader = null;
		try {
			fr = new FileReader(file);
			reader = new BufferedReader(fr);
			String s = "";
			while ((s = reader.readLine()) != null) {
				result += s;
				System.out.println(s);
			}				
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		if (fr != null)
			try {
				fr.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		if (reader != null)
			try {
				reader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		return result;
	}
	
	public static String loadFile(File file){
		String result = "";
		if (!file.exists()) {
			return "";
		}
		FileReader fr = null;
		BufferedReader reader = null;
		try {
			fr = new FileReader(file);
			reader = new BufferedReader(fr);
			String s = "";
			while ((s = reader.readLine()) != null) {
				result += s;
				System.out.println(s);
			}				
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		if (fr != null)
			try {
				fr.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		if (reader != null)
			try {
				reader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		return result;
	}
	
	public static void deleteFile(String basePath, String projectName){
		String path = basePath + PathUtil.groupData + projectName + "\\";
		projectName += ".data";
		File file = new File(path + projectName);
		if(file.exists()){
			file.delete();
		}
	}
}
