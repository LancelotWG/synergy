package com.nwpu.lwg.util.net;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/SR/FileServer")
public class FileServer extends HttpServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		String basePath = request.getRealPath("/");
		String path = request.getParameter("path");
		String file = request.getParameter("fileName");
		file = basePath + path + "\\" + file;
		DownloadUtils.download(response, file); 
	}

}
