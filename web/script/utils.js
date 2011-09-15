// 读取资源文件
function i18n(key) {
    return mxResources.get(key);
}

function mouseOver(e) {
    e = window.event || e;
    var o = e.target || e.srcElement;
    if (!starfish.web.hasClass(o, "current_menu")) {
        starfish.web.addClass(o, "hover_menu");
    }
}

function mouseOut(e) {
    e = window.event || e;
    var o = e.target || e.srcElement;
    starfish.web.removeClass(o, 'hover_menu');
}

function mouseClick(e) {
    e = window.event || e;
    var o = e.target || e.srcElement;
    var web = starfish.web;
    if (web.hasClass(o, "current_menu")) {
        return;
    }

    var lis = $$(web.dom.parent(o), "li");
    for (var k = 0; k < lis.length; k++) {
        web.removeClass(lis[k], "current_menu");
    }
    web.addClass(o, "current_menu");

    var parent = web.dom.parent(o, 2);
    var container = web.className("owl_menu_container", parent)[0];
    for (var j = 0; j < container.childNodes.length; j++) {
        var c = container.childNodes[j];
        web.addClass(c, "hidden");
    }
    var type = o.getAttribute("type");
    var div = $("menu_" + type);
    web.removeClass(div, "hidden");
}

function fireClick(o) {
    if (o.click) {
        o.click();
    } else {  // chrome
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        o.dispatchEvent(evt);
    }
}

////////////////////////////////////////////////////

function Log(s) {
    if (window.console) {
        console.log(s);
    }
}

function Info(s) {
    if (window.console) {
        console.info(s);
    }
}

function Debug(s) {
    if (window.console) {
        console.debug(s);
    }
}

function Warn(s) {
    if (window.console) {
        console.warn(s);
    }
}

function Error(s) {
    if (window.console) {
        console.error(s);
    }
}
