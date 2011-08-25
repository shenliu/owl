starfish.web.fx = {
    fade: function(elem, opts) {
        if (!opts) {
            opts = {
                begin: 0,
                end:   100,
                step:  5
            };
        } else {
            opts.begin = isNaN(opts.begin) ? 0
                    : (opts.begin < 0 || opts.begin > 100) ? 0
                    : opts.begin;
            opts.end = isNaN(opts.end) ? 0
                    : (opts.end < 0 || opts.end > 100) ? 0 : opts.end;
            opts.step = isNaN(opts.step) ? 5
                    : (opts.step < 5 || opts.step > 20) ? 5
                    : opts.step;
        }

        var win = starfish.web;
        win.setOpacity(elem, opts.begin);
        win.show(elem);

        var begin = Math.min(opts.begin, opts.end);
        var end = Math.max(opts.begin, opts.end);
        var step = opts.step;
        var current = end;
        var interval = 0;
        var flag = opts.begin < opts.end;

        for (var i = begin; i <= end; i += step) {
            (function() {
                var pos = current;
                current = flag ? i : current - step;
                interval = flag ? (pos + 1) * 50 : (101 - pos) * 50;
                setTimeout(function() {
                    win.setOpacity(elem, pos);
                }, interval);
            })();
        }
    }

};
