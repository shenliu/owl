/**
 * 扩展Array
 *
 * @module Array
 */

/**
 * 迭代数组
 *
 * @method Array.forEach
 * @param {Function}    func    对每个元素执行的函数
 * @param {Object}       bind    在函数中this指向的对象(可选)
 */
Array.prototype.forEach = function(func, bind) {
    if (!Array.prototype.forEach) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                func.call(bind, this[i], i, this);
            }
        }
    } else {
        Array.forEach(func, bind);
    }
};

/**
 * 迭代数组
 *
 * @method Array.each
 * @param {Function}    func    对每个元素执行的函数
 *             func(item, index, array)
 *             {Object}    item    当前元素
 *             {int}       index    当前索引
 *             {Array}     array    实际数组
 * @param {Object}     bind    在函数中this指向的对象(可选)
 * @return {Array}    本数组this
 */
Array.prototype.each = function(func, bind) {
    Array.forEach(this, func, bind);
    return this;
};

/**
 * 对该数组的每一个元素调用指定的函数,并返回包含所有执行结果的数组
 *
 * @method Array.invoke
 * @param {String}     methodName    要调用的函数名称 该函数所需要的参数可由arguments[0]后的提供
 *                     var arr = myArray.invoke(method[, arg, arg, arg ...])
 * @return {Array}    包括所有执行结果的数组
 * 例子:
 var foo = [4, 8, 15, 16, 23, 42];
 var bar = foo.invoke('limit', 10, 30);  //bar is now [10, 10, 15, 16, 23, 30]
 */
Array.prototype.invoke = function(methodName) {
    var args = Array.slice(arguments, 1);
    return this.map(function(item) {
        return item[methodName].apply(item, args);
    });
};

/**
 * 对该数组中的每一个元素调用指定的函数, 如果所有函数调用都为真返回true,否则返回false
 *
 * @method Array.every
 * @param {Function}     func    对每个元素执行的函数
 * @param {Object}         bind    在函数中this指向的对象(可选)
 * @return {Boolean}     如果所有函数调用都为真返回true,否则返回false
 */
Array.prototype.every = function(func, bind) {
    for (var i = 0, l = this.length; i < l; i++) {
        if ((i in this) && !func.call(bind, this[i], i, this)) {
            return false;
        }
    }
    return true;
};

/**
 * 对该数组中的每一个元素调用指定的函数, 如果至少有一个函数调用为真返回true,都不为真返回false
 *
 * @method Array.some
 * @param {Function}     func    对每个元素执行的函数
 * @param {Object}         bind    在函数中this指向的对象(可选)
 * @return {Boolean}    如果至少有一个函数调用为真返回true,都不为真返回false
 */
Array.prototype.some = function(func, bind) {
    for (var i = 0, l = this.length; i < l; i++) {
        if ((i in this) && func.call(bind, this[i], i, this)) {
            return true;
        }
    }
    return false;
};

/**
 * 对该数组中的每一个元素调用指定的函数, 返回由执行结果为真的元素所组成的新数组
 *
 * @method Array.filter
 * @param {Function}     func    对每个元素执行的函数
 * @param {Object}         bind    在函数中this指向的对象(可选)
 * @return {Array}    新的数组
 */
Array.prototype.filter = function(func, bind) {
    var results = [];
    for (var i = 0, l = this.length; i < l; i++) {
        if ((i in this) && func.call(bind, this[i], i, this)) {
            results.push(this[i]);
        }
    }
    return results;
};

/**
 * 对该数组的每一个元素调用指定的函数,并返回得到结果的新数组
 *
 * @method Array.map
 * @param {Function}     func    对每个元素执行的函数
 * @param {Object}         bind    在函数中this指向的对象(可选)
 * @return {Array}    新数组
 *
 * 例子:
 var timesTwo = [1, 2, 3].map(function(item, index){
 return item * 2;
 });

 现在timesTwo = [2, 4, 6];
 */
Array.prototype.map = function(func, bind) {
    var results = [];
    for (var i = 0, l = this.length; i < l; i++) {
        if (i in this) {
            results[i] = func.call(bind, this[i], i, this);
        }
    }
    return results;
};

/**
 * 创建一个由该数组包含的所有元素组成的新的数组,不包括null和undefined
 *
 * @method Array.clean
 * @return {Array}     新的数组
 */
Array.prototype.clean = function() {
    return this.filter(function(item) {
        return item != null;
    });
};

/**
 * 从该数组中得到与指定值相等的第一个元素的索引值
 *
 * @method Array.indexOf
 * @param {Object}     item    要查找的值
 * @param {int}     from    从数组的第from位起查找,默认为0.(可选)
 * @return {int}    第一个匹配元素的索引值 或-1没有匹配
 */
Array.prototype.indexOf = function(item, from) {
    var len = this.length;
    for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++) {
        if (this[i] === item) {
            return i;
        }
    }
    return -1;
};

/**
 * 从该数组中得到与指定值相等的最后一个元素的索引值
 *
 * @method Array.lastIndexOf
 * @param {Object}     item    要查找的值
 * @param {int}     from    从数组的第from位起查找,默认为数组长度-1.(可选)
 * @return {int}    最后一个匹配元素的索引值 或-1没有匹配
 */
Array.prototype.lastIndexOf = function(item, from) {
    var len = this.length;
    for (var i = (from > len) ? Math.min(len - 1, from - len) : (from == 0 ? 0
        : from || len - 1); i >= 0; i--) {
        if (this[i] === item) {
            return i;
        }
    }
    return -1;
};

/**
 * 创建一个由指定数组的每一元素为键,该数组(this)的元素为值的对象
 *
 * @method Array.associate
 * @param {Array}     keys    该数组每一元素为键
 * @return {Object}        键值对对象
 */
Array.prototype.associate = function(keys) {
    var obj = {}, length = Math.min(this.length, keys.length);
    for (var i = 0; i < length; i++) {
        obj[keys[i]] = this[i];
    }
    return obj;
};

/**
 * 用该数组中的元素为一个key/function对的对象赋值
 *
 * @method Array.link
 * @param {Object}     object    一个包含key/function对的对象
 * @return {Object}        赋值了的对象
 * 例子:
 var arr2 = [100, 'Hello', {foo: 'bar'}, el, false]; // el为对象
 arr2.link({
 myNumber: Type.isNumber,
 myElement: Type.isElement,
 myObject: Type.isObject,
 myString: Type.isString,
 myBoolean: function(obj){ return obj != null; }
 });
 // returns {myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello', myBoolean: false}
 */
Array.prototype.link = function(object) {
    var result = {};
    for (var i = 0, l = this.length; i < l; i++) {
        for (var key in object) {
            if (object[key](this[i])) {
                result[key] = this[i];
                delete object[key];
                break;
            }
        }
    }
    return result;
};

/**
 * 检查该数组中指定的元素值是否存在
 *
 * @method Array.contains
 * @param {Object}     item    指定的元素值
 * @param {int}     from    从数组的第from位起查找,默认为0.(可选)
 * @return {Boolean}    存在指定的元素值返回true, 否则返回false
 */
Array.prototype.contains = function(item, from) {
    return this.indexOf(item, from) != -1;
};

/**
 * 在该数组末尾添加指定的数组
 *
 * @method Array.append
 * @param {Array}     array    要追加的数组
 * @return {Array}    该数组this
 */
Array.prototype.append = function(array) {
    this.push.apply(this, array);
    return this;
};

/**
 * 得到该数组的最后一个元素 此方法并不改变该数组 区别于pop()方法
 *
 * @method Array.getLast
 * @return {Object}     最后一个元素,如果数组长度为0则返回null
 */
Array.prototype.getLast = function() {
    return (this.length) ? this[this.length - 1] : null;
};

/**
 * 随机得到该数组的一个元素
 *
 * @method Array.getRandom
 * @return {Object}   一个元素,如果数组长度为0则返回null
 */
Array.prototype.getRandom = function() {
    return (this.length) ? this[Number.random(0, this.length - 1)] : null;
};

/**
 * 添加指定的元素到该数组结尾处,如果该数组中已经存在就不添加.元素名称大小写和元素类型敏感
 *
 * @method Array.include
 * @param {Object}     item    要添加的元素
 * @return {Array}     该数组this
 */
Array.prototype.include = function(item) {
    if (!this.contains(item)) {
        this.push(item);
    }
    return this;
};

/**
 * 添加指定数组中的所有元素到该数组中,如果有重复就不添加.元素名称大小写和元素类型敏感
 *
 * @method Array.combine
 * @param {Array}     array    要添加的数组
 * @return {Array}     该数组this
 */
Array.prototype.combine = function(array) {
    for (var i = 0, l = array.length; i < l; i++) {
        this.include(array[i]);
    }
    return this;
};

/**
 * 删除该数组中所有与指定元素相同的元素
 *
 * @method Array.erase
 * @param {Object}     item    指定元素
 * @return {Array}     该数组this
 */
Array.prototype.erase = function(item) {
    for (var i = this.length; i--;) {
        if (this[i] === item) {
            this.splice(i, 1);
        }
    }
    return this;
};

/**
 * 删除该数组中索引为from到to的元素
 *
 * @method Array.remove
 * @param {int} from    起始索引
 * @param {int} to      终止索引 (可选) 不提供则只删除from指定的元素
 * @return {Array}     该数组this
 */
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

/**
 * 清空该数组
 *
 * @method Array.empty
 * @return {Array}   该数组this 为[]
 */
Array.prototype.empty = function() {
    this.length = 0;
    return this;
};

/**
 * 使多维数组变为一维数组
 *
 * @method Array.flatten
 * @return {Array}    新的一维数组
 */
Array.prototype.flatten = function() {
    var array = [];
    for (var i = 0, l = this.length; i < l; i++) {
        var type = type(this[i]);
        if (type == 'null') {
            continue;
        }
        array = array.concat((type == 'array' || type == 'collection'
            || type == 'arguments' || (this[i] instanceof Array)) ? Array
            .flatten(this[i]) : this[i]);
    }
    return array;
};

/**
 * 得到该数组中第一个非null的元素
 *
 * @method Array.pick
 * @return {Object}     第一个非null的元素
 */
Array.prototype.pick = function() {
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] != null)
            return this[i];
    }
    return null;
};

/**
 * 转换16进制颜色值到RGB.必须是['FF','FF','FF']的形式
 *
 * @method Array.hexToRgb
 * @param {Boolean}  toArray   如果为true,则转换为数组
 * @return {String/Array}    转换后的RGB或数组
 * 例子:
 ['11', '22', '33'].hexToRgb(); // returns 'rgb(17, 34, 51)'
 ['11', '22', '33'].hexToRgb(true); // returns [17, 34, 51]
 */
Array.prototype.hexToRgb = function(toArray) {
    if (this.length != 3) {
        return null;
    }
    var rgb = this.map(function(value) {
        if (value.length == 1) {
            value += value;
        }
        return value.toInt(16);
    });
    return (toArray) ? rgb : 'rgb(' + rgb + ')';
};

/**
 * 转换RGB颜色值到16进制.必须是[255, 255, 255], [255, 255, 255, 1]中的形式
 *
 * @method Array.rgbToHex
 * @param {Boolean}     toArray        如果为true,则转换为数组
 * @return {String/Array}    转换后的16进制颜色值或数组,如果第4个参数为0,则返回transparent
 * 例子:
 [17, 34, 51].rgbToHex(); // returns '#112233'
 [17, 34, 51].rgbToHex(true); // returns ['11', '22', '33']
 [17, 34, 51, 0].rgbToHex(); // returns 'transparent'
 */
Array.prototype.rgbToHex = function(toArray) {
    if (this.length < 3) {
        return null;
    }
    if (this.length == 4 && this[3] == 0 && !toArray) {
        return 'transparent';
    }
    var hex = [];
    for (var i = 0; i < 3; i++) {
        var bit = (this[i] - 0).toString(16);
        hex.push((bit.length == 1) ? '0' + bit : bit);
    }
    return (toArray) ? hex : '#' + hex.join('');
};

/**
 * 对 对象的某一个属性进行排序,可以传入一个次要的比较函数(当属性值相同时,比较次要函数)
 * 此函数用于Array.sort()的compare function
 *
 * @param   {String}  name  属性名称
 * @param   {Function}  minor  次要的比较函数
 * @return  {Function}  排序比较函数
 *
 * 例子:
 s.sort(orderBy('last', orderBy('first'))); 先按'last'属性比较,再按'first'比较
 */
var orderBy = function(name, minor) {
    return function (o, p) {
        var a, b;
        if (o && p && typeof o === 'object' && typeof p === 'object') {
            a = o[name];
            b = p[name];
            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        } else {
            throw {
                name: 'Error',
                message: 'Expected an object when sorting by ' + name
            };
        }
    }
};
/**
 * 扩展Function
 *
 * @module Function
 */

/**
 * 可以省略prototype为类型增加新的方法
 *
 * @method method
 * @param  {String}  name  增加的方法名称
 * @param  {Function}  func  方法
 * @return  {Object}  该类型
 */
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
    return this;
};

/**
 * 绑定方法调用
 *
 * @method bind
 * @return {Function}     一个函数
 */
Function.prototype.bind = function() {
    var __method = this;
    var args = Array.prototype.slice.call(arguments);
    var object = args.shift();
    return function() {
        return __method.apply(object, args.concat(Array.prototype.slice
            .call(arguments)));
    }
};

/**
 * 把一个多参数的函数转换成多个单参数函数
 *
 * @method curry
 * @return     {Function} 一个函数
 */
Function.prototype.curry = function() {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function() {
        return fn.apply(this, args
            .concat(Array.prototype.slice.call(arguments)));
    };
};

/**
 * 对一个多参数的函数调用,但只传入部分需要的参数,得到的是接受剩余参数的函数
 *
 * @method partial
 * @return {Function} 一个函数
 */
Function.prototype.partial = function() {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function() {
        var arg = 0;
        for (var i = 0; i < args.length && arg < arguments.length; i++) {
            if (args[i] === undefined) {
                args[i] = arguments[arg++];
            }
        }
        return fn.apply(this, args);
    };
};
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

// --------------------------------------------- //

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
