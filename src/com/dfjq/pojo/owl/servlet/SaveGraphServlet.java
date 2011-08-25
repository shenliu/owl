package com.dfjq.pojo.owl.servlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

public class SaveGraphServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html; charset=utf-8");
        request.setCharacterEncoding("utf-8");
        //PrintWriter out = response.getWriter();

        String fileName = request.getParameter("file_name");
        String fileType = request.getParameter("file_type");
        String xml = request.getParameter("xml");
        System.out.println(xml);

        String path = getServletContext().getRealPath("/file");
        File FileDir = new File(path);
        if (!FileDir.exists()) {
            FileDir.mkdirs();
        }

        String fullFileName = fileName + "." + fileType;

        BufferedWriter bw = new BufferedWriter(new FileWriter(path + "/" + fullFileName));
        bw.write(xml);
        bw.flush();
        bw.close();

        doDownload(request, response, path + "/" + fullFileName, fullFileName);

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
        int length, BUF_SIZE = 1024;
        ServletOutputStream op = resp.getOutputStream();
        ServletContext context = getServletConfig().getServletContext();
        String mimeType = context.getMimeType(filename);

        resp.setContentType((mimeType != null) ? mimeType + ";charset=utf-8" : "application/x-msdownload;charset=utf-8");
        resp.setContentLength((int) f.length());
        original_filename = new String(original_filename.getBytes("utf-8"), "iso-8859-1");
        resp.setHeader("Content-Disposition", "attachment;filename=\"" + original_filename + "\"");

        byte[] buf = new byte[BUF_SIZE];
        DataInputStream in = new DataInputStream(new FileInputStream(f));

        while (((length = in.read(buf)) != -1)) {
            op.write(buf, 0, length);
        }

        in.close();
        op.flush();
        op.close();
    }
}
