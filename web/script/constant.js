var owl_constant = {
    theme: "default" // 默认样式

    ,storage: null // 本地存储
    ,collab: null
    ,fileSupport: window.File && window.FileReader && window.FileList // drag and drop
    ,miniUi: false
    ,modified: false  // 修改完成flag
    ,tapAndHoldStartsConnection: false

    // mxGraph 对象
    ,graph: null  // graph对象
    ,undoMgr: null // undo对象
    ,edgeTemplate: null
    ,library: null
    ,graphEditor: null
};