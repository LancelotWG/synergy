package com.nwpu.lwg.util.action.transmission;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.FileCleanerCleanup;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MultipartUploadFileParser {
	final Logger log = LoggerFactory.getLogger(MultipartUploadFileParser.class);
	private Map params;
	private List files;
	private DiskFileItemFactory fileItemsFactory;

	public MultipartUploadFileParser(HttpServletRequest request, File repository, ServletContext context)
			throws Exception {
		params = new HashMap();
		files = new ArrayList();
		if (!repository.exists() && !repository.mkdirs())
			throw new IOException(
					(new StringBuilder("Unable to mkdirs to ")).append(repository.getAbsolutePath()).toString());
		fileItemsFactory = setupFileItemFactory(repository, context);
		ServletFileUpload upload = new ServletFileUpload(fileItemsFactory);
		List formFileItems = upload.parseRequest(request);
		parseFormFields(formFileItems);
		if (files.isEmpty()) {
			log.warn("No files were found when processing the requst. Debugging info follows.");
			writeDebugInfo(request);
			throw new FileUploadException("No files were found when processing the requst.");
		}
		if (log.isDebugEnabled())
			writeDebugInfo(request);
	}

	private DiskFileItemFactory setupFileItemFactory(File repository, ServletContext context) {
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(10240);
		factory.setRepository(repository);
		org.apache.commons.io.FileCleaningTracker pTracker = FileCleanerCleanup.getFileCleaningTracker(context);
		factory.setFileCleaningTracker(pTracker);
		return factory;
	}

	private void writeDebugInfo(HttpServletRequest request) {
		log.debug("-- POST HEADERS --");
		Object header;
		for (Iterator iterator = Collections.list(request.getHeaderNames()).iterator(); iterator.hasNext(); log
				.debug("{}: {}", header, request.getHeader(header.toString()))) {
			header = iterator.next();
		}
		log.debug("-- POST PARAMS --");
		String key;
		for (Iterator iterator1 = params.keySet().iterator(); iterator1.hasNext(); log.debug("{}: {}", key,
				params.get(key))) {
			key = (String) iterator1.next();
		}
	}

	private void parseFormFields(List items) {
		for (Iterator iterator = items.iterator(); iterator.hasNext();) {
			FileItem item = (FileItem) iterator.next();
			if (item.isFormField()) {
				String key = item.getFieldName();
				String value = item.getString();
				if (StringUtils.isNotBlank(key))
					params.put(key.toLowerCase(), StringUtils.defaultString(value));
			} else {
				files.add(item);
			}
		}
	}

	public Map getParams() {
		return params;
	}

	public List getFiles() {
		if (files.isEmpty())
			throw new RuntimeException("No FileItems exist.");
		else
			return files;
	}

	public FileItem getFirstFile() {
		if (files.isEmpty())
			throw new RuntimeException("No FileItems exist.");
		else
			return (FileItem) files.iterator().next();
	}
}
