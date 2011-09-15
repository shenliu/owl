/**
 * 表单
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module form
 */
starfish.web.form = {
    validate: {
        // required
        required: {
            msg: "请输入值",
            check: function(obj, load) {
                return obj.value.length > 0 || load
                        || (obj.value != "" && obj.value == obj.defaultValue);
            }
        },

        // email address
        email: {
            msg: "请输入正确的电子邮件地址",
            check: function(obj) {
                return !obj.value || /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/i
                        .test(obj.value);
            }
        },

        // phone number
        phone: {
            msg: "Not a valid phone number.",
            check: function(obj) {
                var m = /(\d{3}).*(\d{3}).*(\d{4})/.exec(obj.value);
                if (m) {
                    obj.value = "(" + m[1] + ") " + m[2] + "-" + m[3];
                }
                return !obj.value || m;
            }
        },

        // date YYYY-MM-DD
        date: {
            msg: "请输入正确的日期。如: 2011-02-10",
            check: function(obj) {
                return !obj.value || /^\d{2,4}-\d{2}-\d{2}$/.test(obj.value);
            }
        },

        time: {
            msg: "请输入正确的时间。如: 06:10",
            check: function(obj) {
                return !obj.value || /^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/.test(obj.value);
            }
        },

        // URL
        url: {
            msg: "请输入正确的url地址",
            check: function(obj) {
                return !obj.value || obj.value == 'http://' ||
                        /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test(obj.value);
            }
        }
    },

    /**
     * 验证表单所有元素
     *
     * @method validateForm
     * @param {Object}         form    表单元素
     * @param {Boolean}     load    页面加载执行还是动态执行
     * @return {Boolean}    是否提交表单
     */
    validateForm: function(form, load) {
        var f = starfish.web.form;
        var valid = true;

        // 遍历表单中的所有字段 form.elements是包含表单所有字段的数组
        var elems = form.elements;
        for (var i = 0, j = elems.length; i < j; i++) {
            var t = elems[i].type;
            if (t == "text" || t == "textarea" || t == "checkbox" || t == "password"
                    || t == "radio" || t == "file" || t == "hidden") {
                // 先隐藏任何错误的信息
                f.hideErrors(elems[i]);

                // 检查字段是否正确
                if (f.validateField(elems[i], load)) {
                    valid = false;
                }
            }
        }
        return valid;
    },

    /**
     * 验证单个字段的内容
     *
     * @method validateField
     * @param {Element}  elem  字段
     * @param {Boolean}  load  页面加载执行还是动态执行
     * @return {Boolean}  字段是否符合要求
     */
    validateField: function(elem, load) {
        var f = starfish.web.form;
        var errors = [];

        // 遍历所有可能的验证方法
        for (var name in f.validate) {
            var re = new RegExp("(^|\\s)" + name + "(\\s|$)");

            // 检查字段是否有错误类型指定的className属性,如果有则传递给验证函数
            if (re.test(elem.className) && !f.validate[name].check(elem, load)) {
                // 如果验证失败,则把错误信息添加到数组中
                errors.push(f.validate[name].msg);
            }
        }

        // 显示错误信息
        if (errors.length) {
            f.showErrors(elem, errors);
        } else {
            f.hideErrors(elem);
        }

        // 有错误 返回true
        return errors.length > 0;
    },

    /**
     * 隐藏当前字段正显示的错误信息
     *
     * @method hideErrors
     * @param {Element}  elem  当前字段
     */
    hideErrors: function(elem) {
        // 得到当前字段父元素的最后一个元素
        var parent = starfish.web.dom.parent(elem);
        var last = starfish.web.dom.last(parent);

        // 如果该元素是一个ul,并有className='error' 则删除掉
        if (last && last.nodeName == "UL" && last.className == "errors") {
            starfish.web.dom.dispose(last);
        }
        starfish.web.removeClass(elem, "error");
    },

    /**
     * 显示字段的错误信息
     *
     * @method showErrors
     * @param {Element}  elem  字段
     * @param {Array}  errors  错误信息数组
     */
    showErrors: function(elem, errors) {
        var dom = starfish.web.dom;
        // 得到当前字段父元素的最后一个元素
        var parent = dom.parent(elem);
        var last = dom.last(parent);

        // 如果该元素不是一个ul,并且没有className='error' 则创建一个
        if (!last || (last.nodeName != "UL" || last.className != "errors")) {
            last = dom.elem("ul");
            last.className = "errors";
            dom.insert(parent, last);
        }

        last.innerHTML = "";
        // 添加li,并显示错误信息
        for (var i = 0; i < errors.length; i++) {
            var li = dom.elem("li");
            li.innerHTML = errors[i];
            dom.insert(last, li);
        }
        starfish.web.addClass(elem, "error");
    },

    /**
     * 添加 必填字段的'星'
     * @param  {Element}  form  表单
     * @param  {Boolean}  showTip  是否显示字段tip
     */
    showRequired: function(form, showTip) {
        var web = starfish.web;
        var requireds = web.className("required", form);
        for (var i = 0, j = requireds.length; i < j; i++) {
            var lab = web.dom.prev(requireds[i]); // 得到前面的<label>元素

            // 添加'*'
            var span = web.dom.parseDOM("<span class='require'>*</span>")[0];
            web.dom.insert(lab, span);
            if (showTip) {
                web.css(lab, "cursor", "help");
                web.event.addEvent(lab, 'mouseover', function() {
                    starfish.toolkit.tips.show(w.form.validate.required.msg);
                });

                web.event.addEvent(lab, 'mouseout', function() {
                    starfish.toolkit.tips.hide();
                });
            }
        }
    },

    /**
     * 添加 输入框等 得到焦点和失去焦点的事件
     * @param  {Element}  form  表单
     */
    addFocusStyle: function(form) {
        var web = starfish.web;
        var inputs = $$(form, "input");
        for (var i = 0; i < inputs.length; i++) {
            (function() {
                _focus(inputs[i]);
            })();
        }

        var tas = $$(form, "textarea");
        for (i = 0; i < tas.length; i++) {
            (function() {
                _focus(tas[i]);
            })();
        }

        function _focus(o) {
            web.event.addEvent(o, "focus", function() {
                //web.addClass(o, "focus");    // for ie6
                starfish.web.form.hideErrors(o);
            });

            web.event.addEvent(o, "blur", function() {
                //web.removeClass(o, "focus");
                if (!starfish.web.form.validateField(o, false)) { // 没有错误
                    web.addClass(o, "validate");
                }
            });
        }
    }

};
