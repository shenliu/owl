package com.dfjq.pojo.owl.servlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.charset.Charset;

public class SaveGraphServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html; charset=utf-8");
        request.setCharacterEncoding("utf-8");
        //PrintWriter out = response.getWriter();

        String fileName = request.getParameter("file_name");
        String fileType = request.getParameter("file_type");
        String xml = request.getParameter("xml");
        xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml;

        String path = getServletContext().getRealPath("/file");
        File FileDir = new File(path);
        if (!FileDir.exists()) {
            FileDir.mkdirs();
        }

        String fullFileName = fileName + "." + fileType;

        BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(
                        new FileOutputStream(path + File.pathSeparator + fullFileName), Charset.forName("utf-8")));
        bw.write(xml);
        bw.flush();
        bw.close();

        doDownload(request, response, path + File.pathSeparator + fullFileName, fullFileName);

        //out.println("");
        //out.flush();
        //out.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    private void doDownload(HttpServletRequest req, HttpServletResponse resp,
                            String filename, String original_filename)
            throws IOException {
        File f = new File(filename);
        BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(resp.getOutputStream(), Charset.forName("utf-8")));
        ServletContext context = getServletConfig().getServletContext();
        String mimeType = context.getMimeType(filename);

        resp.setContentType((mimeType != null) ? mimeType + ";charset=utf-8" : "application/x-msdownload;charset=utf-8");
        resp.setContentLength((int) f.length());
        original_filename = new String(original_filename.getBytes("utf-8"), "iso-8859-1");
        resp.setHeader("Content-Disposition", "attachment;filename=\"" + original_filename + "\"");

        BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream(f), Charset.forName("utf-8")));
        String line;
        while (((line = br.readLine()) != null)) {
            bw.write(line);
        }
        bw.flush();
        br.close();
        bw.close();
    }
}
