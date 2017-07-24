package com.nwpu.lwg.util.action.transmission;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.io.FilenameUtils;

public class RequestUploadFileParser {
    private static String FILENAME_PARAM = "qqfile";
    private String filename;
    private FileItem uploadItem;
    
    private RequestUploadFileParser()
    {
    	
    }

	public static RequestUploadFileParser getInstance(HttpServletRequest request, MultipartUploadFileParser multipartUploadFileParser)
        throws Exception
    {
    	RequestUploadFileParser requestParser = new RequestUploadFileParser();
        if(multipartUploadFileParser != null)
        {
            requestParser.uploadItem = multipartUploadFileParser.getFirstFile();
            requestParser.filename = FilenameUtils.getName(multipartUploadFileParser.getFirstFile().getName());
        } else
        {
            requestParser.filename = request.getParameter(FILENAME_PARAM);
        }
        return requestParser;
    }

    public String getFilename()
    {
        return filename;
    }

    public FileItem getUploadItem()
    {
        return uploadItem;
    }



}
