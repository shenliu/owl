// 读取资源文件
function i18n(key) {
    return mxResources.get(key);
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
