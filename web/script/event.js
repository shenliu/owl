function owl_add_event() {
    var web = starfish.web;
    var menu_file = $("menu_file");

    // 新建
    _add(_get("tb_new"), function() {
        var bounds = owl_constant.graph.getGraphBounds();
        if (bounds.width == 0 && bounds.height == 0) {
            return false;
        }

        var html = [];
        html.push('<form action="" method="POST" id="newForm">');
        html.push('     <div>');
        html.push('         <span>' + i18n("edit_newGraph") + '</span>');
        html.push('     </div>');
        html.push('     <div>');
        html.push('         <button type="button" onclick="owl_newGraph()">' + i18n("ok") + '</button>');
        html.push('         <button type="button" onclick="starfish.toolkit.dialog.cancel()">' + i18n("cancel") + '</button>');
        html.push('     </div>');
        html.push('</form>');

        owl_showOverlay();
        dialog(400, 210, html.join(""), null, null, false);
    });

    // 打开
    _add(_get("tb_open"), function() {
        var html = [];
        html.push('<div class="owl_tabs">');
        html.push('    <ul class="owl_menu">');
        html.push('        <li class="owl_menu_item first_menu" onmouseover="mouseOver(event)" onmouseout="mouseOut(event)" onclick="mouseClick(event)" type="list">' + i18n("list") + '</li>');
        html.push('        <li class="owl_menu_item" onmouseover="mouseOver(event)" onmouseout="mouseOut(event)" onclick="mouseClick(event)" type="upload">' + i18n("upload") + '</li>');
        html.push('    </ul>');
        html.push('    <div class="owl_menu_container openFile_container">');
        html.push('        <div id="menu_list">');
        html.push('        </div>');
        html.push('        <div id="menu_upload" class="hidden">');
        html.push('            <iframe src="./domain.html?d=' + String.uniqueID() + '" name="uploadFrame" style="display:none;"></iframe>');
        html.push('            <form action="owl/upload" method="POST" enctype="multipart/form-data" target="uploadFrame" id="openForm" onsubmit="return starfish.web.form.validateForm(this, false);">');
        html.push('                <div>');
        html.push('                    <label for="file_name">' + i18n("edit_openFile") + '</label>');
        html.push('                    <input id="file_file" name="file_file" type="file" class="required" />');
        html.push('                    <input type="hidden" name="callback" value="setGraphData" />');
        html.push('                </div>');
        html.push('                <div>');
        html.push('                    <button type="submit">' + i18n("upload") + '</button>');
        html.push('                </div>');
        html.push('            </form>');
        html.push('        </div>');
        html.push('    <div>');
        html.push('<div>');
        /*
        html.push('<div class="hor"></div>');
        html.push('<label class="editor_title">' + i18n("edit_xmlDoc") + '</label>');
        html.push('<textarea class="editor_content"></textarea>');
        html.push('<button type="button" onclick="owl_formatCode();">' + i18n("edit_format") + '</button>');
        html.push('<button type="button">' + i18n("edit_loadXML") + '</button>');
        */
        owl_showOverlay();
        dialog(500, 400, html.join(""), "css/default/images/open.png", i18n("tb_open"), true);
        var openFile_container = web.className("openFile_container")[0];
        web.css(openFile_container, "height", (400 - 117) + "px");
        var li = web.dom.last(web.dom.prev(openFile_container));
        fireClick(li);
        var openForm = $("openForm");
        starfish.web.form.showRequired(openForm);
        starfish.web.form.addFocusStyle(openForm);
    });

    // 保存
    _add(_get("tb_save"), function() {
        if (owl_constant.saveFileName) {
            owl_$saveGraph(owl_constant.saveFileName);
        } else {
            _saveAs();
        }
    });

    // 另存为
    _add(_get("tb_saveAs"), function() {
        _saveAs();
    });

    // 预览
    _add(_get("tb_preview"), function() {
        owl_constant.graph.clearSelection();
        mxUtils.show(owl_constant.graph, null, 10, 10);
    });

    ////////////////////

    // 剪切
    _add(_get("tb_cut"), function() {
        mxClipboard.cut(owl_constant.graph);
    });

    // 拷贝
    _add(_get("tb_copy"), function() {
        mxClipboard.copy(owl_constant.graph);
    });

    // 粘贴
    _add(_get("tb_paste"), function() {
        mxClipboard.paste(owl_constant.graph);
    });

    // 删除
    _add(_get("tb_delete"), function() {
        owl_constant.graph.removeCells();
    });

    // 撤销
    _add(_get("tb_undo"), function() {
        if (owl_constant.collab != null) {
            owl_constant.collab.undo();
        } else {
            owl_constant.undoMgr.undo();
        }
    });

    // 重做
    _add(_get("tb_redo"), function() {
        if (owl_constant.collab != null) {
            owl_constant.collab.redo();
        } else {
            owl_constant.undoMgr.redo();
        }
    });

    ///////////////////////////

    function _get(clazz) {
        return starfish.web.className(clazz, menu_file)[0];
    }

    function _add(elem, func) {
        web.event.addEvent(elem, 'click', func);
    }

    ////////////////////////////

    /**
     * 提示框
     * @param w   width
     * @param h   height
     * @param s   内容
     */
    function dialog(w, h, s, img, caution, closeable) {
        var border = starfish.toolkit.dialog.show({
            width: w,
            height: h,
            closeable: closeable
        });

        starfish.toolkit.dialog.caption({
            width: w,
            caution: caution,
            img: img
        });

        starfish.toolkit.dialog.content(s, {
            width: w,
            height: h
        });
    }

    // 另存为
    function _saveAs() {
        var bounds = owl_constant.graph.getGraphBounds();
        if (bounds.width == 0 && bounds.height == 0) {
            mxUtils.alert(i18n('edit_drawingEmpty'));
            return;
        }

        var html = [];
        html.push('<form action="" method="POST" id="saveForm">');
        html.push('     <div>');
        html.push('         <label for="file_name">' + i18n("edit_fileName") + '</label>');
        html.push('         <input type="text" id="file_name" name="file_name" class="required" value="graph" style="width:15em;"/>');
        html.push('     </div>');
        html.push('     <div>');
        html.push('         <label for="title">' + i18n("edit_fileType") + '</label>');
        html.push("         <select style='width:20em;height:25px;' id='file_type'>");
        html.push("            <option value='xml' selected='selected'>XML</option>");
        html.push("            <option value='png'>PNG</option>");
        html.push("            <option value='jpg'>JPG</option>");
        html.push("         </select>");
        html.push('     </div>');
        html.push('     <div>');
        html.push('         <button type="button" onclick="owl_saveGraph()">' + i18n("ok") + '</button>');
        html.push('         <button type="button" onclick="starfish.toolkit.dialog.cancel()">' + i18n("cancel") + '</button>');
        html.push('     </div>');
        html.push('</form>');

        owl_showOverlay();
        dialog(440, 250, html.join(""), "css/default/images/save.png", i18n("tb_save"), false);
        starfish.web.form.showRequired($("saveForm"), false);
        starfish.web.form.addFocusStyle($("saveForm"));
    }

}

// =================================================================== //

function owl_showOverlay() {
    starfish.toolkit.overlay.show({
        end: 50
    });
}

/**
 * 新建graph
 */
function owl_newGraph() {
    owl_constant.graph.container.innerHTML = "";
    owl_constant.graph.init($('owl_graph'));
    starfish.toolkit.dialog.cancel();
}

/**
 * 保存graph
 */
function owl_saveGraph() {
    var web = starfish.web;
    var result = starfish.web.form.validateForm($("saveForm"));
    if (result) {
        var graphName = $('file_name');
        var graphType = $('file_type');
        var fileName = graphName.value.trim();
        var fileType = graphType.options[graphType.selectedIndex].value;
        if (fileType === "xml") {
            owl_$saveGraph(fileName);
            owl_constant.saveFileName = fileName;
        } else {  // 输出图片格式
            exportImg(400);
        }
        starfish.toolkit.dialog.cancel();
    }
}

// 直接存储文件
function owl_$saveGraph(fileName) {
    var web = starfish.web;
    var url = owl_constant.servlet_path + "owl/savegraph";
    var params = { // 表单元素 名称和值
        file_name: fileName,
        file_type: "xml",
        xml: getGraphData()
    };
    var doc = document;
    var old = null;
    if (doc == document) {
        old = window.onbeforeunload;
        window.onbeforeunload = null;
    }
    var form = doc.createElement('form');
    form.setAttribute('method', "post");
    form.setAttribute('action', url);
    form.setAttribute('target', '_blank');
    form.style.display = 'none';
    form.style.visibility = 'hidden';
    for (var o in params) {
        if (params.hasOwnProperty(o)) {
            var value = params[o];
            var textarea = web.dom.elem('textarea');
            textarea.setAttribute('name', o);
            value = value.replace(/\n/g, '&#xa;');
            textarea['value'] = value;
            web.dom.insert(form, textarea);
        }
    }
    doc.body.appendChild(form);
    form.submit();
    doc.body.removeChild(form);
    if (old != null) {
        window.onbeforeunload = old;
    }
}

/**
 * 格式化 代码 ***暂无用***
 */
function owl_formatCode() {
    var web = starfish.web;
    var pre = web.dom.elem("pre");
    pre.className = "brush: xml";
    var editor_content = web.className("editor_content")[0];
    pre.innerHTML = editor_content.value;
    web.dom.insert(editor_content, pre, "after");
    SyntaxHighlighter.highlight();
}
