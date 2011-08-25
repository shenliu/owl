function owl_add_event() {
    var web = starfish.web;
    var menu_file = $("menu_file");

    // 新建
    _add(_get("tb_new"), function() {
        dialog(400, 210, i18n("edit_newGraph"), null, null, function() {
            owl_constant.graph.container.innerHTML = "";
            owl_constant.graph.init($('owl_graph'));
        });
    });

    // 保存
    _add(_get("tb_save"), function() {
        dialog(400, 210, "", function() {

        });
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
            func();
            _cancel();
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
}
