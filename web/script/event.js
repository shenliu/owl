function owl_add_event() {
    var web = starfish.web;
    var menu_file = $("menu_file");

    // 新建
    _add(_get("tb_new"), function() {
        var bounds = owl_constant.graph.getGraphBounds();
        if (bounds.width == 0 && bounds.height == 0) {
            return false;
        }
        dialog(400, 210, "<span>" + i18n("edit_newGraph") + "</span>", null, null, function() {
            owl_constant.graph.container.innerHTML = "";
            owl_constant.graph.init($('owl_graph'));
            return true;
        });
    });

    // 保存
    _add(_get("tb_save"), function() {
        if (owl_constant.saveFileName) {
            _save(owl_constant.saveFileName);
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

    /**
     * 提示框
     * @param w   width
     * @param h   height
     * @param s   内容
     * @param func  "确定"按钮事件
     */
    function dialog(w, h, s, img, caution, func) {
        var border = starfish.toolkit.dialog.show({
            overlay: true,
            overlayEnd: 50,
            width: w,
            height: h,
            closeable: false
        });
        var html = starfish.toolkit.dialog.confirm(s, {
            width: w,
            height: h,
            caution: caution,
            img: img
        });
        var content = web.className('sf_dialog_content', border)[0];
        content.innerHTML = html.join('');

        var sf_dialog_confirm_ok = web.className('sf_dialog_confirm_ok', border)[0];
        web.event.addEvent(sf_dialog_confirm_ok, 'click', function() {
            if (func()) {
                _cancel();
            }
        });

        var sf_dialog_confirm_cancel = web.className('sf_dialog_confirm_cancel', border)[0];
        web.event.addEvent(sf_dialog_confirm_cancel, 'click', function() {
            _cancel();
        });

        function _cancel() {
            web.dom.dispose(border);
            starfish.toolkit.overlay.hide();
        }
    }

    function _saveAs() {
        var bounds = owl_constant.graph.getGraphBounds();
        if (bounds.width == 0 && bounds.height == 0) {
            mxUtils.alert(i18n('edit_drawingEmpty'));
            return false;
        }

        var html = [];
        html.push("<div class='owl_form'>");
        html.push("<div>");
        html.push("    <span class='owl_form_title a_right'>" + i18n("edit_fileName") + "</span>");
        html.push("    <span class='a_center'><input class='graphName' value='graph' onfocus='owl_etc_hideRequired();'></span>");
        html.push("</div>");
        html.push("<div class='hidden fileNameEmpty required'>");
        html.push("    <span>" + i18n("edit_fileNameEmpty") + "</span>");
        html.push("</div>");
        html.push("<div>");
        html.push("    <span class='owl_form_title a_right'>" + i18n("edit_fileType") + "</span>");
        html.push("    <span class='a_center'>");
        html.push("        <select class='graphType' style='width:182px;'>");
        html.push("            <option value='xml' selected='selected'>XML</option>");
        html.push("            <option value='png'>PNG</option>");
        html.push("            <option value='jpg'>JPG</option>");
        html.push("        </select>");
        html.push("    </span>");
        html.push("</div>");
        html.push("</div>");

        dialog(400, 250, html.join(""), "css/default/images/save.png", i18n("tb_save"), function() {
            var graphName = web.className("graphName")[0];
            var graphType = web.className("graphType")[0];
            var fileNameEmpty = web.className("fileNameEmpty")[0];
            if (graphName.value.trim() === "") {
                web.removeClass(fileNameEmpty, "hidden");
                return false;
            }

            var fileName = graphName.value.trim();
            var fileType = graphType.options[graphType.selectedIndex].value;
            if (fileType === "xml") {
                _save(fileName);
                owl_constant.saveFileName = fileName;
            } else {  // 输出图片格式
                exportImg(400);
            }

            return true;
        });

    }

    function _save(fileName) {
        var url = owl_constant.servlet_path + "owl/savegraph";
        var params = {
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
                var textarea = doc.createElement('textarea');
                textarea.setAttribute('name', o);
                value = value.replace(/\n/g, '&#xa;');
                var content = doc.createTextNode(value);
                textarea.appendChild(content);
                form.appendChild(textarea);
            }
        }
        doc.body.appendChild(form);
        form.submit();
        doc.body.removeChild(form);
        if (old != null) {
            window.onbeforeunload = old;
        }
    }
}

function owl_etc_hideRequired() {
    var web = starfish.web;
    var fileNameEmpty = web.className("fileNameEmpty")[0];
    web.addClass(fileNameEmpty, "hidden");
}
