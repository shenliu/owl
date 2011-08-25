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
    init: function() {
        var overlay = document.createElement("div");
        overlay.id = "overlay";

        starfish.web.event.addEvent(window, "resize", starfish.toolkit.overlay.resize);

        document.body.appendChild(overlay);
    },

    /**
     * 隐藏overlay
     *
     * @method hide
     */
    hide: function() {
        starfish.web.hide($("overlay"));
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
    show: function(options) {
        var w = starfish.web;
        var overlay = $("overlay");

        if (!overlay) {
            starfish.toolkit.overlay.init();
            overlay = $("overlay");
        }

        if (options && options.clickHide) {
            // 点击div该层隐藏
            starfish.web.event.addEvent(overlay, "click", starfish.toolkit.overlay.hide);
        }

        w.css(overlay, "width", w.window.docWidth() + "px");
        w.css(overlay, "height", w.window.docHeight() + "px");

        w.fx.fade(overlay, {
            begin: 0,
            end:   (options && options.end) || 100,
            step:  5
        });
    },

    resize: function() {
        var w = starfish.web;
        var overlay = $("overlay");
        w.css(overlay, "width", w.window.docWidth() + "px");
        w.css(overlay, "height", w.window.docHeight() + "px");
    }

};
