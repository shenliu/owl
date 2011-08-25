starfish.toolkit.dialog = function() {
    var web = starfish.web;

    return {
        /**
         * @param options  {
         *              left, top, width, height, border // {String} 样式
         *              closeable // 是否有关闭按钮
         *              closeFunc // 关闭时要执行的方法
         *        }
         */
        frame: function(options) {
            var border = web.dom.elem("div");
            border.className = "sf_dialog";
            if (options) {
                if (options.left) web.css(border, 'left', parseInt(options.left) + 'px');
                if (options.top) web.css(border, 'top', parseInt(options.top) + 'px');
                if (options.width) web.css(border, 'width', parseInt(options.width) + 'px');
                if (options.height) web.css(border, 'height', parseInt(options.height) + 'px');
                if (options.border) web.css(border, 'border', options.border);
            }
            var outer = web.dom.elem("div");
            outer.className = "sf_dialog_outer";

            var inner = web.dom.elem("div");
            inner.className = "sf_dialog_inner";

            var html = [];
            html.push('<div class="sf_dialog_panel_container">');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_center"></div>');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_t"></div>');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_rt"></div>');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_r"></div>');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_rb"></div>');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_b"></div>');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_lb"></div>');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_l"></div>');
            html.push('  <div class="sf_dialog_panel sf_dialog_panel_lt"></div>');
            html.push('</div>');
            inner.innerHTML = html.join("");

            var content = web.dom.elem("div");
            content.className = "sf_dialog_content";

            web.dom.insert(inner, content);
            web.dom.insert(outer, inner);
            web.dom.insert(border, outer);
            web.dom.insert(document.body, border);

            // 有关闭按钮
            if (options && options['closeable']) {
                var close = web.dom.elem('div');
                close.className = 'sf_dialog_close';
                web.dom.insert(border, close);
                close.title = "关闭";
                web.event.addEvent(close, 'click', function() {
                    web.dom.dispose(border);
                    if (options['closeFunc']) {
                        options['closeFunc']();
                    }
                });
            }

            // 修复 content 高度
            var h = parseInt(web.css(border, 'height'));
            web.css(inner, 'height', (h - 10) + 'px');
            web.css(content, 'height', (h - 10) + 'px');
            return border;
        },

        /**
         * 要确定的对话框
         * @param  {String} tips  提示语
         * @param  {Object} options {
         *              width， height, caution, ok, cancel
         *              img // 显示的图片
         *          }
         */
        confirm: function(tips, options) {
            var w = options.width, h = options.height;
            var caution = options['caution'] || "注意",
                    ok = options['ok'] || "确定",
                    cancel = options['cancel'] || "取消",
                    img = options['img'] || "css/default/images/sf_dialog_warning.png";
            var html = [];
            html.push('<div class="sf_dialog_confirm_icon" style="background:url(' + img + ') no-repeat ' + (w / 4) + 'px center;">' + caution + '</div>');
            html.push('<div class="sf_dialog_confirm" style="width:' + (w - 20) + 'px;height:' + (h - 75) + 'px">');
            html.push('  <div class="sf_dialog_confirm_line" style="height:' + (h - 155) + 'px">');
            html.push('    <span style="line-height:' + (h - 155) + 'px">' + tips + '</span>');
            html.push('  </div>');
            html.push('  <div class="sf_dialog_confirm_line" style="height:30px;">');
            html.push('    <input type="button" class="sf_dialog_confirm_ok" value="' + ok + '" />');
            html.push('    <input type="button" class="sf_dialog_confirm_cancel" value="' + cancel + '" />');
            html.push('  </div>');
            html.push('</div>');
            return html;
        },

        /**
         * 显示框架
         * @param options {
         *            overlay,  overlayEnd,
         *            width, height,
         *            closeable,  closeFunc // 关闭时要执行的方法
         *            border
         *        }
         */
        show: function(options) {
            if (options['overlay']) {
                starfish.toolkit.overlay.show({
                    end: options['overlayEnd'] || 50
                });
            }
            var width = options['width'], height = options['height'];
            return starfish.toolkit.dialog.frame({
                left: (web.window.docWidth() - width) / 2,
                top: (web.window.docHeight() - height) / 2,
                width: width,
                height: height,
                closeable: options['closeable'],
                closeFunc: options['closeFunc'] ? function() {
                    options['closeFunc']();
                    if (options['overlay']) {
                        starfish.toolkit.overlay.hide();
                    }
                } : options['overlay'] ? starfish.toolkit.overlay.hide : null,
                border: options['border'] || '1px solid #999'
            });
        }
    }
}();
