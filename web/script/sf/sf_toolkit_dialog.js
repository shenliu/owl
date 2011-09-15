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
        frame: function(options, isParent) {
            var border = web.dom.elem("div", isParent);
            border.className = "sf_dialog";
            if (options) {
                if (options.left) web.css(border, 'left', parseInt(options.left) + 'px');
                if (options.top) web.css(border, 'top', parseInt(options.top) + 'px');
                if (options.width) web.css(border, 'width', parseInt(options.width) + 'px');
                if (options.height) web.css(border, 'height', parseInt(options.height) + 'px');
                if (options.border) web.css(border, 'border', options.border);
            }
            var outer = web.dom.elem("div", isParent);
            outer.className = "sf_dialog_outer";

            var inner = web.dom.elem("div", isParent);
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

            var content = web.dom.elem("div", isParent);
            content.className = "sf_dialog_content";

            web.dom.insert(inner, content);
            web.dom.insert(outer, inner);
            web.dom.insert(border, outer);
            var doc = isParent ? parent.document : document;
            web.dom.insert(doc.body, border);

            // 有关闭按钮
            if (options && options['closeable']) {
                var close = web.dom.elem('div', isParent);
                close.className = 'sf_dialog_close';
                web.dom.insert(border, close);
                close.title = "关闭";
                web.event.addEvent(close, 'click', function() {
                    starfish.toolkit.dialog.cancel(isParent);
                });
            }

            // 修复 content 高度
            var h = parseInt(web.css(border, 'height'));
            web.css(inner, 'height', (h - 10) + 'px');
            web.css(content, 'height', (h - 10) + 'px');
            return border;
        },

        /**
         * 添加 对话框标题、图片
         * @param  {Object} options {
         *              width， height, caution
         *              img // 显示的图片
         *          }
         */
        caption: function(options) {
            var w = options.width, h = options.height;
            var caution = options['caution'] || "注意",
                img = options['img'] || "css/default/images/sf_dialog_warning.png";
            var html = [];
            html.push('<div class="sf_dialog_caption" style="background:url(' + img + ') no-repeat ' + (w / 4) + 'px center;">' + caution + '</div>');
            var sf_dialog_content = web.className("sf_dialog_content")[0];
            sf_dialog_content.innerHTML = html.join("");
        },

        /**
         * 内容
         * @param tips
         * @param options
         */
        content: function(tips, options) {
            var w = options.width, h = options.height;
            var html = [];
            html.push(tips);
            var sf_dialog_content = web.className("sf_dialog_content")[0];
            sf_dialog_content.innerHTML += html.join("");
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
            html.push(tips);
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
         *            width, height,
         *            closeable,  closeFunc // 关闭时要执行的方法
         *            border
         *        }
         */
        show: function(options, isParent) {
            var width = options['width'], height = options['height'];
            return starfish.toolkit.dialog.frame({
                left: (web.window.docWidth(isParent) - width) / 2,
                top: (web.window.docHeight(isParent) - height) / 2,
                width: width,
                height: height,
                closeable: options['closeable'],
                border: options['border'] || '1px solid #999'
            }, isParent);
        },

        cancel: function(isParent) {
            var sf_dialog = web.className('sf_dialog')[0];
            web.dom.dispose(sf_dialog);
            if ($("overlay", isParent)) {
                starfish.toolkit.overlay.hide(isParent);
            }
        }
    }
}();
