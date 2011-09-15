/**
 * 半透明覆盖层 overlay
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module overlay
 * @requires window event dom fade
 */
starfish.toolkit.overlay = {
    /**
     * @method init
     */
    init: function(isParent) {
        var doc = isParent ? parent.document : document;
        var overlay = doc.createElement("div");
        overlay.id = "overlay";
        starfish.web.event.addEvent(window, "resize", function() {
            starfish.toolkit.overlay.resize(isParent);
        });
        doc.body.appendChild(overlay);
    },

    /**
     * 隐藏overlay
     *
     * @method hide
     */
    hide: function(isParent) {
        starfish.web.hide($("overlay", isParent));
    },

    /**
     * 显示 overlay
     *
     * @method show
     * @param {Object}  options
     *      options {
     *          clickHide  // 点击是否隐藏overlay
     *          end        // 最终透明度
     *      }
     */
    show: function(options, isParent) {
        var w = starfish.web;
        var overlay = $("overlay", isParent);

        if (!overlay) {
            starfish.toolkit.overlay.init(isParent);
            overlay = $("overlay", isParent);
        }

        if (options && options['clickHide']) {
            // 点击div该层隐藏
            starfish.web.event.addEvent(overlay, "click", function() {
                starfish.toolkit.overlay.hide(isParent);
            });
        }

        w.css(overlay, "width", w.window.docWidth(isParent) + "px");
        w.css(overlay, "height", w.window.docHeight(isParent) + "px");

        w.fx.fade(overlay, {
            begin: 0,
            end:   (options && options.end) || 100,
            step:  5
        });
    },

    resize: function(isParent) {
        var w = starfish.web;
        var overlay = $("overlay", isParent);
        w.css(overlay, "width", w.window.docWidth(isParent) + "px");
        w.css(overlay, "height", w.window.docHeight(isParent) + "px");
    }

};
