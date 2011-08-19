starfish.web.dom.domReady(function() {
    var web = starfish.web;
    mxConstants.DEFAULT_HOTSPOT = 1;

    // 辅助线
    mxGraphHandler.prototype.guidesEnabled = false;

    // 按住Alt键 屏蔽辅助线
    mxGuide.prototype.isEnabledForEvent = function(evt) {
        return !mxEvent.isAltDown(evt);
    };

    //
    mxEdgeHandler.prototype.snapToTerminals = true;

    // 刷新/退出窗口提示
    web.event.addEvent(window, 'beforeunload',function() {
        return mxResources.get('changesLost');
    });

    var editor = owl_application("config/owl_main.xml");
});

function owl_application(configFile) {
    var hideLoading = function() {
        var loading = $('owl_loading');
        if (loading != null) {
            try {
                mxEvent.release(loading);
                mxEffects.fadeOut(loading, 100, true);
            } catch (e) {
                starfish.web.dom.dispose(loading);
            }
        }
    };

    try {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('您的浏览器不支持本系统，请联系系统管理员。', 200, false);
        } else {
            var node = mxUtils.load(configFile).getDocumentElement();
            var editor = new mxEditor(node);

            var title = document.title;
            var titleFunc = function(sender) {
                document.title = title + ' - ' + sender.getTitle();
            };

            editor.addListener(mxEvent.OPEN, titleFunc);
            editor.addListener(mxEvent.ROOT, titleFunc);
            titleFunc(editor);

            // 版本信息
            editor.setStatus('ocsoft');
            hideLoading();
        }
    } catch (e) {
        hideLoading();
        mxUtils.alert('不能启动系统，因为: ' + e.message);
        Error(e);
    }
    return editor;
}
