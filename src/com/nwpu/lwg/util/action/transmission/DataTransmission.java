package com.nwpu.lwg.util.action.transmission;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.InputSource;

import com.nwpu.lwg.action.user.UserAction;
import com.nwpu.lwg.util.constant.ControlUtil;
import com.nwpu.lwg.util.constant.SeparatorUtil;

public class DataTransmission {
	final static Logger log = LoggerFactory.getLogger(UserAction.class);
	
	private DataTransmission() {

	}

	public static void upload(HttpServletRequest request, HttpServletResponse response, String directory,
			String fileName, ControlUtil.ClientTransmissionType clientTransmissionType, ControlUtil.ServerType serverType) {

		switch (clientTransmissionType) {
		case context:
			switch (serverType) {
			case data:
				String dataFileContent = request.getParameter("data");
				System.out.println(dataFileContent);
				File dataFlie = new File(directory + fileName  + ".data");
				if (dataFlie.exists()) {
					dataFlie.delete();
				} else {
					try {
						dataFlie.createNewFile();
					} catch (IOException e) {
						// TODO 自动生成的 catch 块
						e.printStackTrace();
					}
				}
				//byte bytes[] = new byte[512];
				//bytes = dataFileContent.getBytes();
				//int length = dataFileContent.length();
				FileOutputStream fos = null;
				try {
					fos = new FileOutputStream(dataFlie);
				} catch (FileNotFoundException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
				try {
					//fos.write(bytes, 0, length);
					fos.write(dataFileContent.getBytes());
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
				try {
					fos.close();
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
				break;
			case cfg:
				String fileContext = request.getParameter("content");
				System.out.println(fileContext);
				FileParser.context2Cfg(fileContext, fileName, directory);
				break;
			case codeResource:
				String dataFileContent1 = request.getParameter("resource");
				System.out.println(dataFileContent1);
				File dataFlie1 = new File(directory + fileName  + ".c");
				if (dataFlie1.exists()) {
					dataFlie1.delete();
				} else {
					try {
						dataFlie1.createNewFile();
					} catch (IOException e) {
						// TODO 自动生成的 catch 块
						e.printStackTrace();
					}
				}
				byte bytes1[] = new byte[512];
				//bytes1 = dataFileContent1.getBytes();
				//int length1 = dataFileContent1.length();
				FileOutputStream fos1 = null;
				try {
					fos1 = new FileOutputStream(dataFlie1);
				} catch (FileNotFoundException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
				try {
					//fos1.write(bytes1, 0, length1);
					fos1.write(dataFileContent1.getBytes());
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
				try {
					fos1.close();
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
				break;
			case codeHead:
				
				break;
			default:
				break;
			}
			break;
		case file:
			switch (serverType) {
			case data:
				//保留
				break;
			case cfg:
				File tempBus = new File(directory);
				String contentLengthHeader = request.getHeader("Content-Length");
				Long expectedFileSize = StringUtils.isBlank(contentLengthHeader) ? null
						: Long.valueOf(Long.parseLong(contentLengthHeader));
				try {
					response.setContentType("text/plain");
					response.setStatus(200);
					if (ServletFileUpload.isMultipartContent(request)) {
						RequestUploadFileParser requestParser = RequestUploadFileParser.getInstance(request,
								new MultipartUploadFileParser(request, tempBus, request.getServletContext()));
						doWriteTempFileForPostRequest(requestParser, tempBus);
						String fileName1 = requestParser.getFilename();
						response.setCharacterEncoding("utf-8");
						writeResponse(response.getWriter(), null, fileName1);
					} else {
						RequestUploadFileParser requestParser = RequestUploadFileParser.getInstance(request, null);
						writeToTempFile(request.getInputStream(), new File(tempBus, requestParser.getFilename()),
								expectedFileSize);
						writeResponse(response.getWriter(), null,requestParser.getFilename());
					}
				} catch (Exception e) {
					log.error("Problem handling upload request", e);
					try {
						writeResponse(response.getWriter(), e.getMessage());
					} catch (IOException e1) {
						// TODO 自动生成的 catch 块
						e1.printStackTrace();
					}
				}
				break;
			default:
				break;
			}
			break;
		}
	}
	
	public  static void closeWriter(HttpServletResponse response){
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		out.flush();
		out.close();
	}

	public static void download(HttpServletRequest request, HttpServletResponse response, String directory,String fileName,
			ControlUtil.ClientTransmissionType clientTransmissionType,ControlUtil.ClientType clientType, ControlUtil.ServerType serverType,ControlUtil.CFGType cfgType) {	
		switch (clientTransmissionType) {
		case context:
			PrintWriter out = null;
				try {
					out = response.getWriter();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			switch (serverType) {		
			case data:
				File file = new File(directory + fileName);
				if (!file.exists()) {
					return;
				}
				FileReader fr = null;
				BufferedReader reader = null;
				try {
					fr = new FileReader(file);
					reader = new BufferedReader(fr);
					String s = "";
					while ((s = reader.readLine()) != null) {
						out.print(s);
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
				break;
			case cfg:
				switch (clientType) {
				case cfg:
					File file1 = new File(directory + fileName);
					if (!file1.exists()) {
						return;
					}
					FileReader fr1 = null;
					BufferedReader reader1 = null;
					try {
						fr1 = new FileReader(file1);
						reader1 = new BufferedReader(fr1);
						String s = "";
						while ((s = reader1.readLine()) != null) {
							s = s + "\n";
							out.print(s);
							System.out.println(s);
						}				
					} catch (FileNotFoundException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					}
					if (fr1 != null)
						try {
							fr1.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					if (reader1 != null)
						try {
							reader1.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					break;
				case data:
					String data = FileParser.cfg2Data(cfgType, fileName, directory);
					out.print(data);
					System.out.println(data);
					break;
				default:
					break;
				}
				
				break;
			default:
				break;
			}
			break;
		case file:
			response.setContentType("application/unknown");
			response.addHeader("Content-disposition", "attachment;filename=" + fileName);
			switch (serverType) {
			case data:
					//保留
				break;
			case cfg:
				try {
					File f = new File(directory + fileName);
					int fSize = (int) f.length();
					FileInputStream fis = new FileInputStream(f);
					PrintWriter pw = response.getWriter();
					int c = -1;
					while ((c = fis.read()) != -1) {
						pw.print((char) c);
					}
					fis.close();
					pw.flush();
					pw.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
				break;
			case codeResource:
				try {
					File f = new File(directory + fileName);
					int fSize = (int) f.length();
					FileInputStream fis = new FileInputStream(f);
					PrintWriter pw = response.getWriter();
					int c = -1;
					while ((c = fis.read()) != -1) {
						pw.print((char) c);
					}
					fis.close();
					pw.flush();
					pw.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
				break;
			case codeHead:
				break;
			default:
				break;
			}
			break;
		}
	}
	
	public static void loadContent(HttpServletRequest request, HttpServletResponse response, String directory){
		String data = "";
		File configureFile = new File(directory);
		if (configureFile.isDirectory()) {
			File[] configureFiles = configureFile.listFiles();
			for (int i = 0; i < configureFiles.length; i++) {
				if (configureFiles[i].isFile()) {
					data = data + SeparatorUtil.content + configureFiles[i].getName();
				}else if(configureFiles[i].isDirectory()){
					data = data + SeparatorUtil.content + configureFiles[i].getName();
				}
			}
		}
		System.out.println(data);
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		out.print(data);
		out.flush();
		out.close();
	}
	
	private static void doWriteTempFileForPostRequest(RequestUploadFileParser requestParser, File temp) throws Exception {
		writeToTempFile(requestParser.getUploadItem().getInputStream(), new File(temp, requestParser.getFilename()),
				null);
	}

	private static File writeToTempFile(InputStream in, File out, Long expectedFileSize) throws IOException {
		FileOutputStream fos = null;
		File file;
		try {
			fos = new FileOutputStream(out);
			IOUtils.copy(in, fos);
			if (expectedFileSize != null) {
				Long bytesWrittenToDisk = Long.valueOf(out.length());
				if (!expectedFileSize.equals(bytesWrittenToDisk)) {
					log.warn("Expected file {} to be {} bytes; file on disk is {} bytes",
							new Object[] { out.getAbsolutePath(), expectedFileSize, Integer.valueOf(1) });
					throw new IOException(
							String.format("Unexpected file size mismatch. Actual bytes %s. Expected bytes %s.",
									new Object[] { bytesWrittenToDisk, expectedFileSize }));
				}
			}
			file = out;
		} catch (Exception e) {
			throw new IOException(e);
		}
		IOUtils.closeQuietly(fos);
		return file;
	}

	private static void writeResponse(PrintWriter writer, String failureReason, String body) {
		if (failureReason == null)
			writer.print((new StringBuilder("{\"success\": true,\"body\": \"")).append(body).append("\"}").toString());
		else
			writer.print((new StringBuilder("{\"error\": \"")).append(failureReason).append("\"}").toString());
	}

	private static void writeResponse(PrintWriter writer, String failureReason) {
		if (failureReason == null)
			writer.print("{\"success\": true}");
		else
			writer.print((new StringBuilder("{\"error\": \"")).append(failureReason).append("\"}").toString());
	}

}
