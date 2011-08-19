/**
 * starfish的基本类
 *
 * 命名规范：
 *         1.以"_"开头的属性或方法为 私有的或局部的
 *         2.以"$"开头或全部大写的变量为 全局变量
 *
 * @namespace org.shen.Starfish
 * @module Starfish
 */
var org;
if (!org) {
    org = {};
} else if (typeof org != "object") {
    throw new Error("包'org'已经存在,并且不是一个对象!");
}

if (!org.shen) {
    org.shen = {};
} else if (typeof org.shen != "object") {
    throw new Error("包'org.shen'已经存在,并且不是一个对象!");
}

if (org.shen.Starfish) {
    throw new Error("包'org.shen.Starfish'已经存在");
}

org.shen.Starfish = {
    author: 'shen LIU',
    email: 'bonjour.shen@gmail.com',
    organization: 'shen universal group',
    found: '2010.02.10',
    /**
     *  v.x.y
     *  v - 主版本(重大改动)
     *  x - 次版本(增加方法)
     *  y - 方法有小改动
     */
    version: '0.8.60',
    lastmodify: '2011.06.16'
};

var starfish = org.shen.Starfish;
// ----------------------------------------- //

// 改造内置方法

/**
 * 返回对象的类型    此方法替换typeof 因为Object.toString()返回'[object class]'形式
 *
 * @method type
 * @param {Object}  o   待检验的对象
 * @return {String}        o的类型
 */
var type = function(o) {
    var _t;
    return ((_t = typeof(o)) == "object" ? o == null && "null" ||
        Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
};

/**
 * document.getElementById()
 *
 * @method $
 * @param {String/Object}   _id   元素的id值或元素
 * @return {Object} 元素
 */
var $ = function(_id) {
    if (typeof(_id) != "object") {
        return document.getElementById(_id);
    } else {
        return _id;
    }
};

/**
 * x.getElementsByTagName()
 *
 * @method $$
 * @param {Object} elem   元素 默认为document
 * @param {String} name   tag名称
 * @return {Array}  具有tag名称的元素数组
 */
var $$ = function(elem, name) {
    return (elem || document).getElementsByTagName(name);
};

/**
 * x.getElementsByName
 *
 * @method $n
 * @param {Object} elem  元素 默认为document
 * @param {String} name  元素name属性的值
 * @return {Array}  具有name属性值的元素数组
 */
var $n = function(elem, name) {
    return (elem || document).getElementsByName(name);
};

/**
 * window.setTimeout支持传递Object
 *
 * @method delay
 * @param {Function}     func    要执行的函数
 * @param {int}         mDelay    时间间隔
 * @return {Function}  延迟执行的函数
 */
var delay = function(func, mDelay) {
    var st = window.setTimeout;
    if (type(func) == 'function') {
        var args = Array.prototype.slice.call(arguments, 2);
        var f = function() {
            func.apply(null, args);
        };
        return st(f, mDelay);
    }
    return st(func, mDelay);
};
/**
 * 测试客户端 引擎 浏览器 平台/设备/OS
 *
 * @namespace org.shen.Starfish
 * @module client
 */
starfish.client = function() {
    //rendering engines
    var engine = {
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,
        //complete version
        ver: null
    };
    //browsers
    var browser = {
        //browsers
        ie: 0,
        firefox: 0,
        konq: 0,
        opera: 0,
        chrome: 0,
        safari: 0,
        //specific version
        ver: null
    };
    //platform/device/OS
    var system = {
        win: false,
        mac: false,
        x11: false,
        //mobile devices
        iphone: false,
        ipod: false,
        nokiaN: false,
        winMobile: false,
        macMobile: false,
        //game systems
        wii: false,
        ps: false
    };
    //detect rendering engines/browsers
    var ua = navigator.userAgent;
    if (window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)) {
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        //figure out if it’s Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100) {
                safariVersion = 1;
            } else if (engine.webkit < 312) {
                safariVersion = 1.2;
            } else if (engine.webkit < 412) {
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }
            browser.safari = browser.ver = safariVersion;
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);
        //determine if it’s Firefox
        if (/Firefox\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }
    //detect browsers
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    //detect platform
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    //detect windows operating systems
    if (system.win) {
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if (RegExp["$1"] == "NT") {
                switch (RegExp["$2"]) {
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "Windows7";
                        break;
                    default:
                        system.win = "NT";
                        break;
                }
            } else if (RegExp["$1"] == "9x") {
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }
    //mobile devices
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    system.winMobile = (system.win == "CE");
    system.macMobile = (system.iphone || system.ipod);
    //gaming systems
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    //return it
    return {
        engine: engine,
        browser: browser,
        system: system
    };
}();
