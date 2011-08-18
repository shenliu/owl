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

/**
 * 扩展Number
 *
 * @module Number
 */

/**
 * 返回从min到max的随机数 (包括min和max)
 *
 * @static
 * @method Number.random
 * @param {int} min
 * @param {int} max
 * @return {int}    随机数[min, max]
 */
Number.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// --------------------------------------------- //

/**
 * 在给定的区域中查找该数值的极限
 *
 * @method Number.limit
 * @param {Number}     min    极限最小值
 * @param {Number}     max    极限最大值
 * @return {Number} 本数值的极限
 */
Number.prototype.limit = function(min, max) {
    return Math.min(max, Math.max(min, this));
};

/**
 * 得到该数值的近似值
 *
 * @method Number.round
 * @param {Number}     precision    保留几位小数,默认为0.(可选)
 * @return {Number} 近似值
 */
Number.prototype.round = function(precision) {
    precision = Math.pow(10, precision || 0).toFixed(
        precision < 0 ? -precision : 0);
    return Math.round(this * precision) / precision;
};

/**
 * 执行该数值次指定的函数
 *
 * @method Number.times
 * @param {Function}     func    指定的要执行的函数 索引值会变化
 * @param {Object}         bind    在函数中this指向的对象(可选)
 * 例子:
 (4).times(alert); // alerts "0", then "1", then "2", then "3".
 */
Number.prototype.times = function(func, bind) {
    for (var i = 0; i < this; i++) {
        func.call(bind, i, this);
    }
};

/**
 * 将该数值转换为浮点值
 *
 * @method Number.toFloat
 * @return {Number}     浮点值
 */
Number.prototype.toFloat = function() {
    return parseFloat(this);
};

/**
 * 将该数值转换为整型
 *
 * @method Number.toInt
 * @param {Number}     base    进制,默认为10.(可选)
 * @return {int}     整型
 */
Number.prototype.toInt = function(base) {
    return parseInt(this, base || 10);
};

/**
 * 扩展String
 *
 * @module String
 */

/**
 * 生成一个unique ID
 *
 * @static
 * @method uniqueID
 * @return {String}     UID
 */
String.uniqueID = function() {
    var UID = new Date().getTime();
    return (UID++).toString(36);
};

// ----------------------------------------------------- //

/**
 * 在该字符串中寻找指定的子字符串或正则表达式
 *
 * @method String.test
 * @param {String/RegExp}     regexp    要寻找的子字符串或正则表达式
 * @param {String}             params    标志 i g m (可选)
 * @return {Boolean}     找到返回true,否则返回false
 */
String.prototype.test = function(regexp, params) {
    return ((type(regexp) == 'regexp') ? regexp : new RegExp('' + regexp, params))
        .test(this);
};

/**
 * 检查指定的字符串是否在该字符串中.
 *
 * @method String.contains
 * @param {String}     string        要查找的字符串
 * @param {String}     separator    要查找的字符串以separator分割(可选)
 * @return {Boolean}     找到返回true,否则返回false
 * 例子:
 'a bc'.contains('bc'); // returns true
 'a b c'.contains('c', ' '); // returns true
 'a bc'.contains('b', ' '); // returns false
 */
String.prototype.contains = function(string, separator) {
    return (separator) ? (separator + this + separator).indexOf(separator
        + string + separator) > -1 : this.indexOf(string) > -1;
};

/**
 * 删除该字符串中所有的HTML标记
 *
 * @method String.stripTags
 * @return     {String}     删除标记后的字符串
 */
String.prototype.stripTags = function() {
    return this.replace(/<(?:.|\s)*?>/g, "");
};

/**
 * 去掉该字符串两边的空白
 *
 * @method String.trim
 * @return {String} 去掉空白的字符串
 */
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

/**
 * 去掉该字符串两边和字符串内多余的空格
 *
 * @method String.clean
 * @return {String} 去掉空白的字符串
 */
String.prototype.clean = function() {
    return this.replace(/\s+/g, ' ').trim();
};

/**
 * 将该字符串中的连字符的转换为camelCase字符串
 *
 * @method String.camelCase
 * @return     {String}    camelCase字符串
 */
String.prototype.camelCase = function() {
    return this.replace(/-\D/g, function(match) {
        return match.charAt(1).toUpperCase();
    });
};

/**
 * 将该字符串中的camelCase转换为带有连字符的字符串
 *
 * @method String.hyphenate
 * @return {String}     带有连字符的字符串
 */
String.prototype.hyphenate = function() {
    return this.replace(/[A-Z]/g, function(match) {
        return ('-' + match.charAt(0).toLowerCase());
    });
};

/**
 * 该字符串中每个单词的首字母大写
 *
 * @method String.capitalize
 * @return     {String}    字符串
 */
String.prototype.capitalize = function() {
    return this.replace(/\b[a-z]/g, function(match) {
        return match.toUpperCase();
    });
};

/**
 * 转义该字符串中的正则表达式的字符
 *
 * @method String.escapeRegExp
 * @return {String}     转义后的字符串
 * 例子:
 'animals.sheep[1]'.escapeRegExp(); // returns 'animals\.sheep\[1\]'
 */
String.prototype.escapeRegExp = function() {
    return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
};

/**
 * 判断str是否为中文
 *
 * @method String.isChinese
 * @return {Boolean}
 */
String.prototype.isChinese = function() {
    return /[\u4e00-\u9fa5]/g.test(this);
};

/**
 * 解析该字符串,返回包括的整数值
 *
 * @method String.toInt
 * @param {int}   base    进制数,默认为10 (可选)
 * @return {int}  数字,如果不能转换返回NaN
 */
String.prototype.toInt = function(base) {
    return parseInt(this, base || 10);
};

/**
 * 解析该字符串,返回包括的浮点值
 *
 * @method String.toFloat
 * @return {Number}     浮点数,如果不能转换返回NaN
 */
String.prototype.toFloat = function() {
    return parseFloat(this);
};

/**
 * 转换16进制颜色值到RGB.必须是'#ffffff','#fff','ffffff','fff'中的形式
 *
 * @method String.hexToRgb
 * @param {Boolean}     array    如果为true,则转换为数组
 * @return {String/Array}    转换后的RGB或数组
 * 例子:
 '#123'.hexToRgb(); // returns 'rgb(17, 34, 51)'
 '112233'.hexToRgb(); // returns 'rgb(17, 34, 51)'
 '#112233'.hexToRgb(true); // returns [17, 34, 51]
 */
String.prototype.hexToRgb = function(array) {
    var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
    return (hex) ? hex.slice(1).hexToRgb(array) : null;
};

/**
 * 转换RGB颜色值到16进制.必须是"rgb(255, 255, 255)","rgba(255, 255, 255, 1)"中的形式
 *
 * @method String.rgbToHex
 * @param {Boolean}  array    如果为true,则转换为数组
 * @return {String/Array}    转换后的16进制颜色值或数组,如果第4个参数为0,则返回transparent
 * 例子:
 'rgb(17, 34, 51)'.rgbToHex(); // returns '#112233'
 'rgb(17, 34, 51)'.rgbToHex(true); // returns ['11', '22', '33']
 'rgba(17, 34, 51, 0)'.rgbToHex(); // returns 'transparent'
 */
String.prototype.rgbToHex = function(array) {
    var rgb = this.match(/\d{1,3}/g);
    return (rgb) ? rgb.rgbToHex(array) : null;
};

/**
 * 用对象中的键值对替换该字符串中匹配regexp的部分
 *
 * @method String.substitute
 * @param {Object}  object    键值对对象
 * @param {RegExp}     regexp    要替换的正则表达式.默认为/\?{([^}]+)}/g
 * @return {String}     替换的字符串
 * 例子:
 var myString = '{subject} is {property_1} and {property_2}.';
 var myObject = {subject: 'Jack Bauer', property_1: 'our lord', property_2: 'saviour'};
 myString.substitute(myObject); // returns 'Jack Bauer is our lord and saviour'
 */
String.prototype.substitute = function(object, regexp) {
    return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {
        if (match.charAt(0) == '\\') {
            return match.slice(1);
        }
        return (object[name] != null) ? object[name] : '';
    });
};

/**
 * 返回指定key在querystring中的值
 *
 * @method String.getParamter
 * @param {String}     key    指定的key
 * @return {String}  key对应的值.如无对应值,返回"".
 * 例子:
 var s = 'a=111&b=222&c=333&d=444';
 s.getParamter('b') 返回 222
 */
String.prototype.getParamter = function(key) {
    if (key == "") {
        return "";
    }
    return new RegExp(key + "=([^&]+)", "gi").test(this) ? RegExp.$1 : "";
};
/**
 * web: 常用方法
 *
 * @namespace org.shen.Starfish
 * @module web
 */
starfish.web = {
    /**
     * 根据元素的class属性查找元素 x.getElementsByClassName()
     *
     * @method className
     * @param {String} searchClass        class属性名 如: &lt;input class="" /&gt;
     * @param {Element} node              起始查找节点(默认为document)
     * @param {String} tag                查找的元素tag(默认为*)
     * @return {Array} 包含指定class属性的元素数组
     */
    className: function(searchClass, node, tag) {
        node = node || document;
        tag = tag || "*";

        var classes = searchClass.split(" ");

        var elements = (tag === "*" && node.all) ? node.all : node
            .getElementsByTagName(tag);
        var patterns = [];
        var returnElements = [];
        var i = classes.length;
        while (--i >= 0) {
            patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
        }

        var j = elements.length;
        var current, match;
        while (--j >= 0) {
            current = elements[j];
            match = false;
            for (var k = 0, kl = patterns.length; k < kl; k++) {
                match = patterns[k].test(current.className);
                if (!match) {
                    break;
                }
            }
            if (match) {
                returnElements.push(current);
            }
        }
        returnElements.reverse(); // 翻转数组 按实际dom顺序排列
        return returnElements;
    },

    /**
     * @method clazz
     * @deprecated 使用 starfish.web.className 方法代替
     **/
    clazz: function(node, tag, searchClass) {
        return starfish.web.className(searchClass, node, tag);
    },

    /**
     * 根据给定的属性名称和一个可选的匹配值得到元素数组
     *
     * @param  {String}  att  要查找的属性名称
     * @param  {Object/String}  value  属性要匹配的值(可选)
     * @return  {Array}  包含指定att属性的元素数组
     */
    byAttr: function(att, value) {
        var results = [];

        walk(document.body, function (node) {
            var actual = node.nodeType === 1 && node.getAttribute(att);
            if (typeof actual === 'string' &&
                (actual === value || typeof value !== 'string')) {
                results.push(node);
            }
        });

        function walk(node, func) {
            func(node);
            node = node.firstChild;
            while (node) {
                walk(node, func);
                node = node.nextSibling;
            }
        }

        return results;
    },

    /**
     * 获取/设置元素属性值
     *
     * @method attr
     * @param {Object} elem        元素对象
     * @param {String} name        属性名
     * @param {Object} value    属性值
     * @return {Object}  设置的属性值 没有此属性返回undefined
     */
    attr: function(elem, name, value) {
        if (!name || name.constructor != String) {
            return '';
        }

        // 避免javascript保留字
        name = {
            'for' : 'htmlFor',
            'class' : 'className'
        }[name] || name;

        if (value) {
            elem[name] = value;
            if (elem.setAttribute) {
                elem.setAttribute(name, value);
            }
        }
        return elem[name] || elem.getAttribute(name) || undefined;
    },

    /**
     * 得到/设置给定元素的给定style值
     *
     * @method css
     * @param {Element}     elem    给定元素
     * @param {String}      name    style名称
     * @param {String}     value    style值 赋值时提供 (可选)
     * @return {Object}     style值
     */
    css: function(elem, name, value) {
        if (value) {
            elem.style[name] = value;
        }

        if (elem.style[name]) {
            return elem.style[name];
        } else if (elem.currentStyle) { // IE
            return elem.currentStyle[name];
        } else if (document.defaultView && document.defaultView.getComputedStyle) { // W3C
            // W3C使用如'text-align'的风格代替'textAlign'
            name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
            var s = document.defaultView.getComputedStyle(elem, "");
            return s && s.getPropertyValue(name);
        } else {
            return null;
        }
    },

    /**
     * 设置给定元素的一组style值 并保留原有的属性值
     *
     * @method czz
     * @param {Element}     elem    给定元素
     * @param {Object}     stylez    style属性对象
     * @return {Object}     原有的属性值对象
     */
    czz: function(elem, stylez) {
        var bak = {};
        for (var s in stylez) {
            bak[s] = starfish.web.css(elem, s);
            starfish.web.css(elem, s, stylez[s]);
        }
        return bak;
    },

    /**
     * 判断给定的元素是否具有给定的样式
     * @param {Element}  elem  给定元素
     * @param {String}  clazz  要判断的样式
     * @return {Boolean}  true/false
     */
    hasClass: function(elem, clazz) {
        var re = new RegExp('(^| )' + clazz + '( |$)');
        return re.test(elem.className);
    },

    /**
     * 为给定的元素添加给定的样式
     * @param {Element}  elem  给定元素
     * @param {String}  clazz  要添加的样式
     */
    addClass: function(elem, clazz) {
        if (!starfish.web.hasClass(elem, clazz)) {
            elem.className += ' ' + clazz;
        }
    },

    /**
     * 去除给定元素的给定样式
     * @param {Element}  elem  给定元素
     * @param {String}  clazz  要去除的样式
     */
    removeClass: function(elem, clazz) {
        var re = new RegExp('(^| )' + clazz + '( |$)');
        elem.className = elem.className.replace(re, ' ').trim();
    },

    /**
     * 使用display属性隐藏元素 并保留自身display属性的值在自建属性"__displayed__"中
     *
     * @method hide
     * @param {Element}  elem    元素
     */
    hide: function(elem) {
        var curDisplay = starfish.web.css(elem, 'display');
        if (curDisplay != 'none') {
            elem.__displayed__ = curDisplay;
        }
        starfish.web.css(elem, "display", "none");
    },

    /**
     * 使用display属性显示元素 先查看元素有没有"__displayed__"属性,如有就用其值,并删除该属性
     *
     * @method show
     * @param {Element}  elem    元素
     */
    show: function(elem) {
        starfish.web.css(elem, "display", elem.__displayed__ || 'block');
        if (elem.__displayed__) {
            elem.removeAttribute("__displayed__");
        }
    },

    /**
     * 设置元素透明度
     *
     * @method setOpacity
     * @param {Element}  elem    元素
     * @param {int}  level    透明度 (0-100 透明-不透明)
     */
    setOpacity: function(elem, level) {
        if (elem.style.filter) { // IE filters
            starfish.web.css(elem, "filter", "alpha(opacity=" + level + ")");
        } else {    // W3C opacity
            starfish.web.css(elem, "opacity", level / 100);
        }
    }

};
/**
 * AJAX
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module ajax
 */
starfish.web.ajax = {
    /**
     * 创建并返回一个新的XMLHttpRequest对象  如果浏览器不支持XMLHttpRequest,则引发异常
     *
     * @method newRequest
     * @return {Object}   XMLHttpRequest对象
     */
    newRequest: function() {
        var request;
        if (typeof XMLHttpRequest == "undefined") {
            request = new ActiveXObject(
                navigator.userAgent.indexOf("MSIE 5") >= 0 ?
                    "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
            );
        } else {
            request = new XMLHttpRequest();
        }
        return request;
    },

    /**
     * 使用XMLHttpRequest对象,向指定的url发送GET请求
     * 以 字符串 的型式返回响应,并传送给callback引用的方法
     *
     * @method getText
     * @param {String}    url       请求url
     * @param {Function}  callback  回调函数
     */
    getText: function(url, callback) {
        var request = starfish.web.ajax.newRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            }
        };
        request.open("GET", url);
        request.send(null);
    },

    /**
     * 使用XMLHttpRequest对象,向指定的url发送GET请求
     * 以 XML 的型式返回响应,并传送给callback引用的方法
     *
     * @method getXML
     * @param {String}    url          请求url
     * @param {Function}  callback     回调函数
     */
    getXML: function(url, callback) {
        var request = starfish.web.ajax.newRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseXML);
            }
        };
        request.open("GET", url);
        request.send(null);
    },

    /**
     * 向指定的url发送GET请求,并提供了请求过期的处理方法
     *
     * @method get
     * @param {String}      url         请求url
     * @param {Function}    callback    回调函数
     * @param {Object}  options
     *        包含:
     *            timeout - 过期时间
     *            errorHandler - 错误回调方法
     *            progressHandler - 在request.readyState的值为4前的处理方法
     *            parameters - 包含对象的属性 名称/值 的参数对象 将传递给encodeFormData方法
     *                         转换为字符串后,成为url的'?'后参数等属性的对象
     **/
    get: function(url, callback, options) {
        var request = starfish.web.ajax.newRequest();
        var n = 0;
        var timer;
        if (options.timeout) {
            timer = setTimeout(function() {
                request.abort();
                if (options.timeoutHandler) {
                    options.timeoutHandler(url);
                }
            }, options.timeout);
        }
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (timer) {
                    clearTimeout(timer);
                }
                if (request.status == 200) {
                    callback(starfish.web.ajax._getResponse(request));
                } else {
                    if (options.errorHandler) {
                        options.errorHandler(request.status, request.statusText);
                    } else {
                        callback(null);
                    }
                }
            } else if (options.progressHandler) {
                options.progressHandler(++n);
            }
        };

        var target = url;
        if (options.parameters) {
            target += "?" + starfish.web.ajax._encodeFormData(options.parameters);
        }
        request.open("GET", target);
        request.send(null);
    },

    /**
     * 使用XMLHttpRequest对象,向指定的url发送POST请求
     * 使用 名称/值 为属性的values对象作为请求的请求体
     * 根据服务器响应的类型(调用_getResponse方法)传递给回调函数
     * 如果出现错误
     *         - 指定了errorHandler方法,则调用该方法
     *         - 否则向callback回调函数传递null
     *
     * @method post
     * @param {String}    url             请求url
     * @param {Object}    values          请求体名称/值为属性的对象
     * @param {Function}  callback        成功处理回调函数
     * @param {Function}  errorHandler    错误处理回调函数
     **/
    post: function(url, values, callback, errorHandler) {
        var request = starfish.web.ajax.newRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    callback(starfish.web.ajax._getResponse(request));
                } else {
                    if (errorHandler) {
                        errorHandler(request.status, request.statusText);
                    } else {
                        callback(null);
                    }
                }
            }
        };

        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 编码对象的属性
        request.send(starfish.web.ajax._encodeFormData(values));
    },

    /**
     * 使用XMLHttpRequest对象,向指定的url发送HEAD请求
     *
     * - 如果成功返回响应,则调用parseHeaders方法解析(见下面的parseHeaders方法),并把解析结果的
     *      对象传给回调方法callback,callback的参数是parseHeaders方法的返回值.
     *
     * - 如果不成功
     *         当指定了errorHandler方法时,则调用该方法
     *         没有指定errorHandler方法时,则传入null值到callback回调方法
     *
     * @method getHeaders
     * @param {String}      url              请求url
     * @param {Function}    callback         成功处理回调函数
     * @param {Function}    errorHandler     错误处理回调函数
     */
    getHeaders: function(url, callback, errorHandler) {
        var request = starfish.web.ajax.newRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    callback(starfish.web.ajax._parseHeaders(request));
                }
                else {
                    if (errorHandler) {
                        errorHandler(request.status, request.statusText);
                    } else {
                        callback(null);
                    }
                }
            }
        };
        request.open("HEAD", url);
        request.send(null);
    },

    /**
     * 把对象的属性 名称/值 转换为一个字符串的形式.
     *
     * @private
     * @method _encodeFormData
     * @param {Object}    data    名称/值为属性的对象
     * @return {String} 字符串
     */
    _encodeFormData: function(data) {
        var pairs = [];
        var regexp = /%20/g;
        for (var name in data) {
            var value = data[name].toString();
            // 替换 空格(%20) 为 "+"
            var pair = encodeURIComponent(name).replace(regexp, "+") + '=' +
                encodeURIComponent(value).replace(regexp, "+");
            pairs.push(pair);
        }
        return pairs.join('&');
    },

    /**
     * 根据HTTP响应的类型(Content-Type) 返回响应的内容
     *
     * @private
     * @method _getResponse
     * @param {Object}    request    XMLHttpRequest对象
     */
    _getResponse: function(request) {
        switch (request.getResponseHeader("Content-Type")) {
            case "text/xml":
                return request.responseXML;
            case "text/json":
            case "application/json":
            case "text/javascript":
            case "application/javascript":
            case "application/x-javascript":
                return eval(request.responseText);
            default:
                return request.responseText;
        }
    },

    /**
     * 请求服务器返回一个给定url的头部,而不返回该url的内容
     * 该方法解析HTTP头部的一对名字/值并将它们存储为一个对象的属性及其值
     *
     * @private
     * @method _parseHeaders
     * @param {Object}    request  XMLHttpRequest对象
     * @return {Object} 一个对象
     */
    _parseHeaders: function(request) {
        // 服务端返回的字符串
        var headerText = request.getAllResponseHeaders();
        var headers = {};
        var exp = /^\s*|\s*$/;

        var lines = headerText.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.length == 0) {
                continue; // 跳过空行
            }
            var pos = line.indexOf(':');
            var name = line.substring(0, pos).replace(exp, "");
            headers[name] = line.substring(pos + 1).replace(exp, "");
        }
        return headers;
    }

};
/**
 * web: document
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module dom
 * @requires event
 */
starfish.web.dom = {
    /**
     * 判断文档是否加载完毕
     *
     * @method domReady
     * @param {Function}  func    要执行的函数
     */
    domReady: function(func) {
        var web = starfish.web;
        if (web.dom.domReady.done) {
            return func();
        }
        if (web.dom.domReady.timer) {
            web.dom.domReady.ready.push(func);
        } else {
            web.event.addEvent(window, "load", web.dom._isDOMReady);
            web.dom.domReady.ready = [ func ];
            web.dom.domReady.timer = setInterval(web.dom._isDOMReady, 10);
        }
    },

    /**
     * @private
     */
    _isDOMReady: function() {
        var web = starfish.web;
        if (web.dom.domReady.done) {
            return false;
        }
        if (document && document.getElementsByTagName && document.getElementById
            && document.body) {
            web.dom.domReady.done = true;
            clearInterval(web.dom.domReady.timer);
            web.dom.domReady.timer = null;
            for (var i = 0, j = web.dom.domReady.ready.length; i < j; i++) {
                web.dom.domReady.ready[i]();
            }
            web.dom.domReady.ready = null;
        }
    },

    /**
     * 得到指定元素的前一个元素
     *
     * @method prev
     * @param {Element}  elem    指定的元素
     * @return {Element} 前一个元素
     */
    prev: function(elem) {
        do {
            elem = elem.previousSibling;
        } while (elem && elem.nodeType != 1);
        return elem;
    },

    /**
     * 得到指定元素的下一个元素
     *
     * @method next
     * @param {Element}   elem    指定的元素
     * @return {Element}  下一个元素
     */
    next: function(elem) {
        do {
            elem = elem.nextSibling;
        } while (elem && elem.nodeType != 1);
        return elem;
    },

    /**
     * 得到指定元素的子元素中第一个元素
     *
     * @method first
     * @param {Element}   elem    指定的元素
     * @return {Element}  第一个元素
     */
    first: function(elem) {
        elem = elem.firstChild;
        return elem && elem.nodeType != 1 ? starfish.web.dom.next(elem) : elem;
    },

    /**
     * 得到指定元素的子元素中最后一个元素
     *
     * @method last
     * @param {Element}   elem    指定的元素
     * @return {Element}  最后一个元素
     */
    last: function(elem) {
        elem = elem.lastChild;
        return elem && elem.nodeType != 1 ? starfish.web.dom.prev(elem) : elem;
    },

    /**
     * 得到指定元素的父元素
     *
     * @method parent
     * @param {Element}  elem    指定的元素
     * @param {int}         num    父元素向上几级 默认为1
     * @return {Element}     父元素
     */
    parent: function(elem, num) {
        num = num || 1;
        for (var i = 0; i < num; i++) {
            if (elem != null) {
                elem = elem.parentNode;
            }
        }
        return elem;
    },

    /**
     * 把additive元素添加到elem元素的where处
     *
     * @param {Element}  elem  原有相对的元素
     * @param {Element}  additive  被添加的元素
     * @param {String}  where  添加到何处(默认为'bottom'):
     *          'before': 把additive加到elem之前 (additive和elem是兄弟节点)
     *          'after': 把additive加到elem之后 (additive和elem是兄弟节点)
     *          'top': 把additive添加到elem的子节点列表的开始 (elem是additive的父节点)
     *          'bottom': 把additive添加到elem的子节点列表的末尾 (elem是additive的父节点) (默认)
     */
    insert: function(elem, additive, where) {
        switch (where) {
            case 'before':
                var parent = elem.parentNode;
                if (parent) {
                    parent.insertBefore(additive, elem);
                }
                break;

            case 'after':
                parent = elem.parentNode;
                if (parent) {
                    parent.insertBefore(additive, elem.nextSibling);
                }
                break;

            case 'top':
                elem.insertBefore(additive, elem.firstChild);
                break;

            default: // 'bottom'
                elem.appendChild(additive);
                break;
        }
    },

    /**
     * 从DOM中删除该elem元素
     *
     * @param {Element}  elem  要删除的元素
     * @return {Element}  删除的元素
     */
    dispose: function(elem) {
        return (elem.parentNode) ? elem.parentNode.removeChild(elem) : elem;
    },

    /**
     * 得到给定元素中的text
     *
     * @method text
     * @param {Element}  elem  给定元素
     * @return {String}  元素中的text
     */
    text: function(elem) {
        var t = "";
        elem = elem.childNodes || elem;
        for (var j = 0; j < elem.length; j++) {
            t += elem[j].nodeType != Node.ELEMENT_NODE ? elem[j].nodeValue : starfish.web.dom.text(elem[j].childNodes);
        }
        return t;
    },

    /**
     * 在给定元素中创建给定值的Text元素
     *
     * @method addText
     * @param {String}  s  text字符串
     * @param {Element}  elem  要添加字符串节点的元素
     */
    addText: function(s, elem) {
        starfish.web.dom.insert(elem, document.createTextNode(s), 'bottom');
    },

    /**
     * 根据lab值创建元素
     *
     * @method elem
     * @param {String}  lab  元素类型字符串
     * @return {Element}  创建的元素
     */
    elem: function(lab) {
        return document.createElement(lab);
    },

    /**
     * 把指定字符串转化为DOM
     *
     * @param {String} html  指定的字符串
     * @return {Array}  转化的DodeList
     */
    parseDOM: function(html) {
        var div = starfish.web.dom.elem("div");
        div.innerHTML = html;
        return div.childNodes;
    },

    /**
     * 给指定元素(elem)包裹指定的元素(wrapper)
     *
     * @param {Element}  elem  要被包裹的元素
     * @param {Element/String}  wrapper  包裹的元素或元素字符串
     * @return {Element}  包裹的元素
     */
    wrap: function(elem, wrapper) {
        var dom = starfish.web.dom;
        var w_type = type(wrapper);

        if (w_type == "string") {
            var parent = dom.parent(elem);
            var wrap = dom.parseDOM(wrapper)[0];
            var removed = parent.replaceChild(wrap, elem);
            wrap.appendChild(removed);
            return wrap;
        } else if (w_type.contains("element")) {
            dom.parent(elem).appendChild(wrapper).appendChild(elem);
            return wrapper;
        } else {
            return null;
        }
    }

};

// 为IE添加Node常量
if (!window.Node) {
    window.Node = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_FRAGMENT_NODE: 11
    };
}
/**
 *    web: event
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module event
 */
starfish.web.event = {
    /**
     * 为每一个事件处理函数赋予一个独立ID
     *
     * @private
     */
    _guid: 1,

    /**
     * 为元素添加事件监听
     *
     * @method addEvent
     * @param {Element}   element    元素
     * @param {String}       type        事件类型
     * @param {Function}  handler    事件句柄(要执行的函数)
     * @param {Boolean}   useCapture  是否捕获 (默认false [bubbling方式])
     */
    addEvent: function(element, type, handler, useCapture) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, useCapture ? useCapture : false);
        } else {
            // 为每一个事件句柄赋予一个UID
            if (!handler.$$guid) {
                handler.$$guid = starfish.web.event._guid++;
            }

            // 为元素创建一个事件类型的散列表hash table
            if (!element.events) {
                element.events = {};
            }

            // 为每对元素/事件创建一个事件句柄的散列表
            var handlers = element.events[type];
            if (!handlers) {
                handlers = element.events[type] = {};
                // 存储已有的事件句柄(如果已存在一个)
                if (element["on" + type]) {
                    handlers[0] = element["on" + type];
                }
            }
            // 在散列表中存储事件句柄
            handlers[handler.$$guid] = handler;
            // 赋予一个全局事件句柄来处理所有工作
            element["on" + type] = starfish.web.event.handleEvent;
        }
    },

    /**
     * 全局事件句柄
     *
     * @method handleEvent
     * @param {Object}      event    事件对象
     * @return {Boolean}     执行结果
     */
    handleEvent: function(event) {
        var returnValue = true;
        // 获取事件对象(IE使用全局事件对象)
        event = starfish.web.event.fixEvent(event || ((this.ownerDocument || this.document || this).parentWindow
            || window).event);

        // 获取事件句柄散列表的引用
        // 其中this指向element
        // events为addEvent中定义的element.events
        // event.type为事件类型(此处为load)
        var handlers = this.events[event.type];

        // 执行每个事件句柄
        for (var i in handlers) {
            if (handlers.hasOwnProperty(i)) {
                this.$$handleEvent = handlers[i];
                if (this.$$handleEvent(event) === false) {
                    returnValue = false;
                }
            }
        }
        return returnValue;
    },

    /**
     * 增加IE事件对象的缺乏方法
     *
     * @method fixEvent
     * @param {Object}      event    事件对象
     * @return {Object}  事件对象
     */
    fixEvent: function(event) {
        // 添加W3C标准事件方法
        event.preventDefault = function() {
            this.returnValue = false;
        };
        event.stopPropagation = function() {
            this.cancelBubble = true;
        };
        return event;
    },

    /**
     * 为元素删除事件监听
     *
     * @method removeEvent
     * @param {Element}   element    元素
     * @param {String}       type        事件类型
     * @param {Function}  handler    事件句柄(要执行的函数)
     * @param {Boolean}   useCapture  是否捕获 (默认false [bubbling方式])
     */
    removeEvent: function(element, type, handler, useCapture) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, useCapture ? useCapture : false);
        } else {
            // 从散列表中删除事件句柄
            if (element.events && element.events[type]) {
                delete element.events[type][handler.$$guid];
            }
        }
    }

};
/**
 * web: window
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module window
 * @requires event
 */
starfish.web.window = {
    /**
     * 得到元素的水平位置
     *
     * @method pageX
     * @param {Element}     elem    元素
     * @return {int}  水平位置
     */
    pageX: function(elem) {
        return elem.offsetParent ? elem.offsetLeft
            + starfish.web.window.pageX(elem.offsetParent)
            : elem.offsetLeft;
    },

    /**
     * 得到元素的垂直位置
     *
     * @method pageY
     * @param {Element}     elem    元素
     * @return {int}  垂直位置
     */
    pageY: function(elem) {
        return elem.offsetParent ? elem.offsetTop
            + starfish.web.window.pageY(elem.offsetParent)
            : elem.offsetTop;
    },

    // -------------------------------------------------------------- //

    /**
     * 得到元素相对于父元素的水平位置
     *
     * @method parentX
     * @param {Element}     elem    元素
     * @return {int}  水平位置
     */
    parentX: function(elem) {
        return elem.parentNode == elem.offsetParent ? elem.offsetLeft
            : starfish.web.window.pageX(elem)
            - starfish.web.window.pageX(elem.parentNode);
    },

    /**
     * 得到元素相对于父元素的垂直位置
     *
     * @method parentY
     * @param {Element}     elem    元素
     * @return {int}  垂直位置
     */
    parentY: function(elem) {
        return elem.parentNode == elem.offsetParent ? elem.offsetTop
            : starfish.web.window.pageY(elem)
            - starfish.web.window.pageY(elem.parentNode);
    },

    // -------------------------------------------------------------- //

    /**
     * 得到元素左端位置
     *
     * @method getX
     * @param {Element}  elem  元素
     * @return {int}  左端位置
     */
    getX: function(elem) {
        var x = starfish.web.css(elem, "left");
        if (isNaN(x)) { // 有可能得到auto值
            x = starfish.web.window.pageX(elem);
        }
        return parseInt(x);
    },

    /**
     * 得到元素顶端位置
     *
     * @method getY
     * @param {Element}  elem    元素
     * @return {int}  顶端位置
     */
    getY: function(elem) {
        var y = starfish.web.css(elem, "top");
        if (isNaN(y)) { // 有可能得到auto值
            y = starfish.web.window.pageY(elem);
        }
        return parseInt(y);
    },

    // -------------------------------------------------------------- //

    /**
     * 设置元素水平位置
     *
     * @method setX
     * @param {Element} elem  元素
     * @param {int}  pos  水平数值
     */
    setX: function(elem, pos) {
        starfish.web.css(elem, "left", pos + "px");
    },

    /**
     * 设置元素垂直位置
     *
     * @method setY
     * @param {Element}  elem    元素
     * @param {int}  pos  垂直数值
     */
    setY: function(elem, pos) {
        starfish.web.css(elem, "top", pos + "px");
    },

    // -------------------------------------------------------------- //

    /**
     * 元素在水平位置上增加像素距离
     *
     * @method addX
     * @param {Element} elem  元素
     * @param {int}  pos  增加的数值
     */
    addX: function(elem, pos) {
        var w = starfish.web.window;
        w.setX(w.getX(elem) + pos);
    },

    /**
     * 元素在垂直位置上增加像素距离
     *
     * @method addY
     * @param {Element}  elem    元素
     * @param {int}  pos  增加的数值
     */
    addY: function(elem, pos) {
        var w = starfish.web.window;
        w.setY(w.getY(elem) + pos);
    },

    // -------------------------------------------------------------- //

    /**
     * 得到元素宽度
     *
     * @method getWidth
     * @param {Element}  elem    元素
     * @return {int}  宽度
     */
    getWidth: function(elem) {
        var w = starfish.web.css(elem, 'width');
        //if (w === "auto") {w = starfish.web.window._autoWidth(elem);}
        return parseInt(w);
    },

    /**
     * 得到元素高度
     *
     * @method getHeight
     * @param {Element}  elem    元素
     * @return {int}  高度
     */
    getHeight: function(elem) {
        var h = starfish.web.css(elem, 'height');
        //if (h === "auto") {h = starfish.web.window._autoHeight(elem);}
        return parseInt(h);
    },

    // -------------------------------------------------------------- //

    /**
     * 得到元素完整的 可能的宽度
     *
     * @method fullWidth
     * @param {Element}  elem    元素
     * @return {int}  宽度
     */
    fullWidth: function(elem) {
        var w = starfish.web;
        // 如果元素是显示(display)的,使用offsetWidth得到宽度.
        // 如果没有offsetWidth,则使用getWidth()
        if (w.css(elem, 'display') != 'none') {
            return elem.offsetWidth || w.window.getWidth(elem);
        }

        // 元素为display='none'时,重置它的CSS属性
        var old = w.czz(elem, {
            display: '',
            visibility: 'hidden',
            position: 'absolute'
        });

        // 使用clientWidth得到元素完整的宽度,否则使用getWidth()
        var width = elem.clientWidth || w.window.getWidth(elem);

        // 恢复CSS的原有属性
        w.czz(elem, old);

        return width;
    },

    /**
     * 得到元素完整的 可能的高度
     *
     * @method fullHeight
     * @param {Element}   elem    元素
     * @return {int}  高度
     */
    fullHeight: function(elem) {
        var w = starfish.web;
        // 如果元素是显示(display)的,使用offsetHeight得到高度.
        // 如果没有offsetHeight,则使用getHeight()
        if (w.css(elem, 'display') != 'none') {
            return elem.offsetHeight || w.window.getHeight(elem);
        }

        // 元素为display='none'时,重置它的CSS属性
        var old = w.czz(elem, {
            display: '',
            visibility: 'hidden',
            position: 'absolute'
        });

        // 使用clientHeight得到元素完整的高度,否则使用getHeight()
        var height = elem.clientHeight || w.window.getHeight(elem);
        // 恢复CSS的原有属性
        w.czz(elem, old);

        return height;
    },

    // ------------------------ 鼠标事件 -------------------------------- //

    /**
     * 得到鼠标相对于整个页面的水平位置
     *
     * @event mouseX
     * @param {Event}  e  事件
     * @return {int}  水平位置
     */
    mouseX: function(e) {
        e = e || window.event;
        // W3C有pageX || IE
        return e.pageX || e.clientX + document.body.scrollLeft - document.body.clientLeft;
    },

    /**
     * 得到鼠标相对于整个页面的垂直位置
     *
     * @event mouseY
     * @param {Event}     e    事件
     * @return {int}  垂直位置
     */
    mouseY: function(e) {
        e = e || window.event;
        // W3C有pageY || IE
        return e.pageY || e.clientY + document.body.scrollTop - document.body.clientTop;
    },

    // -------------------------------------------------------------- //

    /**
     * 得到鼠标相对于当前元素(事件对象e的target属性)的水平位置
     *
     * @event getElementX
     * @param {Event}     e    事件
     * @return {int}  相对水平位置
     */
    getElementX: function(e) {
        e = e || window.event;
        // W3C || IE
        return e.layerX || e.offsetX;
    },

    /**
     * 得到鼠标相对于当前元素(事件对象e的target属性)的垂直位置
     *
     * @event getElementY
     * @param {Event}     e    事件
     * @return {int}  相对垂直位置
     */
    getElementY: function(e) {
        e = e || window.event;
        // W3C || IE
        return e.layerY || e.offsetY;
    },

    // ------------------------ 以下是窗口的函数 ------------------------------ //

    /**
     * 得到浏览器左上角在屏幕上的水平坐标 (屏幕坐标)
     *
     * @method windowX
     * @return {int}  水平坐标
     */
    windowX: function() {
        // W3C || IE
        return window.screenX || window.screenLeft;
    },

    /**
     * 得到浏览器左上角在屏幕上的垂直坐标 (屏幕坐标)
     *
     * @method windowY
     * @return {int}  垂直坐标
     */
    windowY: function() {
        // W3C || IE
        return window.screenY || window.screenTop;
    },

    // -------------------------------------------------------------- //

    /**
     * 得到文档document的宽度 (文档坐标)
     *
     * @method docWidth
     * @return {int}  宽度
     */
    docWidth: function() {
        var de = document.documentElement;
        return (de && de.scrollWidth) || document.body.scrollWidth;
        //return document.documentElement.clientWidth || document.body.clientWidth;
    },

    /**
     * 得到文档document的高度 (文档坐标)
     *
     * @method docHeight
     * @return {int}  高度
     */
    docHeight: function() {
        var de = document.documentElement;
        return (de && de.scrollHeight) || document.body.scrollHeight;
        //return document.documentElement.clientHeight || document.body.clientHeight;
    },

    // -------------------------------------------------------------- //

    /**
     * 得到浏览器滚动条的水平位置
     *
     * @method scrollX
     * @return {int}  水平滚动位置
     */
    scrollX: function() {
        // 应用在IE6的Strict Mode方式(有DOCTYPE)
        var de = document.documentElement;

        // W3C pageXOffset || 根节点的左端滚动偏移量 || body元素的左端滚动偏移量
        return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
    },

    /**
     * 得到浏览器滚动条的垂直位置
     *
     * @method scrollY
     * @return {int}  垂直滚动位置
     */
    scrollY: function() {
        // 应用在IE6的Strict Mode方式(有DOCTYPE)
        var de = document.documentElement;

        // W3C pageYOffset || 根节点的顶端滚动偏移量 || body元素的顶端滚动偏移量
        return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
    },

    // -------------------------------------------------------------- //

    /**
     * 得到视口(viewport)的宽度 随浏览器大小变动 (窗口坐标)
     *
     * @method vpWidth
     * @return {int}  宽度
     */
    vpWidth: function() {
        // 应用在IE6的Strict Mode方式(有DOCTYPE)
        var de = document.documentElement;

        // W3C innerWidth || 根节点宽度偏移量 || body元素宽度偏移量
        return    self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    },

    /**
     * 得到视口(viewport)的高度 随浏览器大小变动 (窗口坐标)
     *
     * @method vpHeight
     * @return {int}  高度
     */
    vpHeight: function() {
        // 应用在IE6的Strict Mode方式(有DOCTYPE)
        var de = document.documentElement;

        // W3C innerHeight || 根节点高度偏移量 || body元素高度偏移量
        return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    },

    // -------------------------------------------------------------- //

    /**
     * 屏幕的宽度
     *
     * @method screenWidth
     * @return {int}  宽度
     */
    screenWidth: function() {
        return screen.width;
    },

    /**
     * 屏幕的高度
     *
     * @method screenHeight
     * @return {int}  高度
     */
    screenHeight: function() {
        return screen.height;
    },

    /**
     * 屏幕的可用宽度(一般不包括windows应用程序的快捷栏)
     *
     * @method screenAvailWidth
     * @return {int}  宽度
     */
    screenAvailWidth: function() {
        return screen.availWidth;
    },

    /**
     * 屏幕的可用高度 (一般不包括windows任务栏)
     *
     * @method screenAvailHeight
     * @return {int}  高度
     */
    screenAvailHeight: function() {
        return screen.availHeight;
    }

};
