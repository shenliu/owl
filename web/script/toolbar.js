/**
 * 菜单
 */
function owl_toolbar() {
    var web = starfish.web;

    var owl_menu = $("owl_menu");

    var ul_menu = web.dom.elem("ul");
    ul_menu.className = "owl_menu";

    // 文件
    var li_file = web.dom.elem("li");
    li_file.className = "owl_menu_item first_menu";
    li_file.setAttribute("type", "file");
    web.dom.addText(i18n("tb_file"), li_file);
    web.dom.insert(ul_menu, li_file);

    // 图型
    var li_graph = web.dom.elem("li");
    li_graph.className = "owl_menu_item";
    li_graph.setAttribute("type", "graph");
    web.dom.addText(i18n("tb_graph"), li_graph);
    web.dom.insert(ul_menu, li_graph);

    web.dom.insert(owl_menu, ul_menu);

    // 子菜单

    // 容器
    var container = web.dom.elem("div");
    container.className = "owl_menu_container";
    web.css(container, "height", "80px");

    // 文件 子菜单
    var div_file = web.dom.elem("div");
    div_file.className = "owl_menu_file_sub";
    div_file.id = "menu_file";
    web.dom.insert(container, div_file);

    // 图型 子菜单
    var div_graph = web.dom.elem("div");
    div_graph.className = "owl_menu_graph_sub hidden";
    div_graph.id = "menu_graph";
    web.dom.insert(container, div_graph);

    web.dom.insert(owl_menu, container);

    // 事件
    var lis = $$(ul_menu, "li");
    for (var i = 0; i < lis.length; i++) {
        (function() {
            var li = lis[i];

            web.event.addEvent(li, "mouseover", function(e) {
                mouseOver(e);
            });

            web.event.addEvent(li, "mouseout", function(e) {
                mouseOut(e);
            });

            web.event.addEvent(li, "click", function(e) {
                mouseClick(e);
            });
        })();
    }

    // 初始时 触发'文件'
    fireClick(lis[0]);

    owl_toolbar_file();
    owl_toolbar_graph();
}

/**
 * 文件 工具条
 */
function owl_toolbar_file() {
    var web = starfish.web;
    var menu_file = $("menu_file");

    var path = "css/" + owl_constant.theme + "/toolbar/";
    // 文档 box
    var box = owl_create_box("文档", 67);
    var owl_box_ul = web.className("owl_box_ul", box)[0];
    var cssTest = ";padding:4px 2px;";
    owl_add_item(owl_box_ul, owl_create_button("tb_new", path + "new.png"), cssTest); // 新建
    owl_add_item(owl_box_ul, owl_create_button("tb_open", path + "open.png"), cssTest); // 打开
    owl_add_item(owl_box_ul, owl_create_button("tb_save", path + "save.png"), cssTest); // 保存
    owl_add_item(owl_box_ul, owl_create_button("tb_saveAs", path + "saveAs.png"), cssTest); // 另存为
    owl_add_item(owl_box_ul, owl_create_button("tb_print", path + "print.png"), cssTest); // 打印
    owl_add_item(owl_box_ul, owl_create_button("tb_preview", path + "printView.png"), cssTest); // 预览
    web.dom.insert(menu_file, box);

    // 剪贴板 box
    box = owl_create_box("剪贴板", 67);
    owl_box_ul = web.className("owl_box_ul", box)[0];
    cssTest = ";padding:4px 2px;";
    owl_add_item(owl_box_ul, owl_create_button("tb_cut", path + "cut.png"), cssTest); // 剪切
    owl_add_item(owl_box_ul, owl_create_button("tb_copy", path + "copy.png"), cssTest); // 拷贝
    owl_add_item(owl_box_ul, owl_create_button("tb_paste", path + "paste.png"), cssTest); // 粘贴
    owl_add_item(owl_box_ul, owl_create_button("tb_delete", path + "delete.png"), cssTest); // 删除
    owl_add_item(owl_box_ul, owl_create_button("tb_undo", path + "undo.png"), cssTest); // 撤销
    owl_add_item(owl_box_ul, owl_create_button("tb_redo", path + "redo.png"), cssTest); // 重做
    web.dom.insert(menu_file, box);
}

/**
 * 图型 工具条
 */
function owl_toolbar_graph() {
    var web = starfish.web;
    var menu_graph = $("menu_graph");
    if (mxClient.IS_IE) {
        new mxDivResizer(menu_graph);
    }

    var path = "images/graph/";
    // 基本图型 box
    var box = owl_create_box("基本图型", 88);
    var owl_box_ul = web.className("owl_box_ul", box)[0];
    var cssTest = ";;";
    owl_add_item(owl_box_ul, owl_create_vertex(path + "swimlane.gif", "tb_gp_swimlane", 'swimlane', 200, 200, 'Container'), cssTest); // 泳道
    owl_add_item(owl_box_ul, owl_create_vertex(path + "text.gif", "tb_text", 'text', 80, 20, 'Text'), cssTest); // 文字
    owl_add_item(owl_box_ul, owl_create_vertex(path + "actor.gif", "tb_gp_actor", 'shape=actor', 60, 80, null), cssTest); // 角色
    owl_add_item(owl_box_ul, owl_create_vertex(path + "cloud.gif", "tb_gp_cloud", 'ellipse;shape=cloud', 120, 80, null), cssTest); // 云
    web.dom.insert(menu_graph, box);

    box = owl_create_box("线型", 88);
    owl_box_ul = web.className("owl_box_ul", box)[0];
    cssTest = ";padding:4px 2px;";
    owl_add_item(owl_box_ul, owl_create_vertex(path + "hline.gif", "tb_gp_hline", 'line', 120, 10, null), cssTest); // 水平线
    owl_add_item(owl_box_ul, owl_create_edge(path + "straight.gif", "tb_gp_straight", 'edgeStyle=none', 100, 100, null), cssTest); // 直线
    owl_add_item(owl_box_ul, owl_create_edge(path + "horizontal.gif", "tb_gp_horizontal", 'edgeStyle=elbowEdgeStyle;elbow=horizontal', 100, 100, null), cssTest); // 水平连线
    owl_add_item(owl_box_ul, owl_create_edge(path + "vertical.gif", "tb_gp_vertical", 'edgeStyle=elbowEdgeStyle;elbow=vertical', 100, 100, null), cssTest); // 垂直连线
    owl_add_item(owl_box_ul, owl_create_edge(path + "entity.gif", "tb_gp_position", 'edgeStyle=entityRelationEdgeStyle', 100, 100, null), cssTest); // 位置关系线
    owl_add_item(owl_box_ul, owl_create_edge(path + "arrow.gif", "tb_gp_arrow", 'arrow', 100, 100, null), cssTest); // 箭头
    web.dom.insert(menu_graph, box);

    box = owl_create_box("面型", 88);
    owl_box_ul = web.className("owl_box_ul", box)[0];
    cssTest = ";padding:4px 2px;";
    owl_add_item(owl_box_ul, owl_create_vertex(path + "triangle.gif", "tb_gp_triangle", 'triangle', 60, 80, null), cssTest); // 三角形
    owl_add_item(owl_box_ul, owl_create_vertex(path + "rectangle.gif", "tb_gp_rectangle", null, 120, 60, null), cssTest); // 矩形
    owl_add_item(owl_box_ul, owl_create_vertex(path + "rhombus.gif", "tb_gp_rhombus", 'rhombus', 80, 80, null), cssTest); // 菱形
    owl_add_item(owl_box_ul, owl_create_vertex(path + "hexagon.gif", "tb_gp_hexagon", 'shape=hexagon', 120, 80, null), cssTest); // 六边形
    owl_add_item(owl_box_ul, owl_create_vertex(path + "rounded.gif", "tb_gp_rounded", 'rounded=1', 120, 60, null), cssTest); // 圆角矩形
    owl_add_item(owl_box_ul, owl_create_vertex(path + "ellipse.gif", "tb_gp_ellipse", 'ellipse', 80, 80, null), cssTest); // 椭圆
    owl_add_item(owl_box_ul, owl_create_vertex(path + "doubleellipse.gif", "tb_gp_doubleellipse", 'ellipse;shape=doubleEllipse', 80, 80, null), cssTest); // 双椭圆
    web.dom.insert(menu_graph, box);

    box = owl_create_box("体型", 46);
    owl_box_ul = web.className("owl_box_ul", box)[0];
    cssTest = ";padding:4px 2px;";
    owl_add_item(owl_box_ul, owl_create_vertex(path + "cylinder.gif", "tb_gp_cylinder", 'shape=cylinder', 60, 80, null), cssTest); // 圆柱体
    owl_add_item(owl_box_ul, owl_create_vertex(path + "cube.png", "tb_gp_cube", 'shape=cube', 120, 80, null), cssTest); // 立方体
    web.dom.insert(menu_graph, box);

    box = owl_create_box("业务流程", 193);
    owl_box_ul = web.className("owl_box_ul", box)[0];
    cssTest = ";padding:4px 2px;";
    path = "images/workflow/";
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_event.gif", "tb_gp_event", 'image;image=' + path + "event.png", 80, 80, ""), cssTest); // 事件
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_event_intermediate.gif", "tb_gp_eventIntermediate", 'image;image=' + path + "event_intermediate.png", 80, 80, ''), cssTest); // 事件中间过程
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_event_end.gif", "tb_gp_eventEnd", 'image;image=' + path + "event_end.png", 80, 80, ''), cssTest); // 事件终点
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_cancel_end.gif", "tb_gp_cancelEnd", 'image;image=' + path + "cancel_end.png", 80, 80, ''), cssTest); // 取消终点
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_cancel_intermediate.gif", "tb_gp_cancelIntermediate", 'image;image=' + path + "cancel_intermediate.png", 80, 80, ''), cssTest); // 取消中间过程
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_error.gif", "tb_gp_error", 'image;image=' + path + "error.png", 80, 80, ''), cssTest); // 错误
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_message.gif", "tb_gp_message", 'image;image=' + path + "message.png", 80, 80, ''), cssTest); // 消息
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_message_intermediate.gif", "tb_gp_messageIntermediate", 'image;image=' + path + "message_intermediate.png", 80, 80, ''), cssTest); // 消息中间过程
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_message_end.gif", "tb_gp_messageEnd", 'image;image=' + path + "message_end.png", 80, 80, ''), cssTest); // 消息终点

    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_inclusive.gif", "tb_gp_inclusive", 'image;image=' + path + "inclusive.png", 80, 80, ''), cssTest); // 包含
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_merge.gif", "tb_gp_merge", 'image;image=' + path + "merge.png", 80, 80, ''), cssTest); // 合并
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_link.gif", "tb_gp_link", 'image;image=' + path + "link.png", 80, 80, ''), cssTest); // 链接
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_rule.gif", "tb_gp_rule", 'image;image=' + path + "rule.png", 80, 80, ''), cssTest); // 规则
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_fork.gif", "tb_gp_fork", 'image;image=' + path + "fork.png", 80, 80, ''), cssTest); // 分叉
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_multiple.gif", "tb_gp_multiple", 'image;image=' + path + "multiple.png", 80, 80, ''), cssTest); // 并联
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_terminate.gif", "tb_gp_terminate", 'image;image=' + path + "terminate.png", 80, 80, ''), cssTest); // 终止
    owl_add_item(owl_box_ul, owl_create_vertex(path + "small_timer.gif", "tb_gp_timer", 'image;image=' + path + "timer.png", 80, 80, ''), cssTest); // 计时器
    web.dom.insert(menu_graph, box);
}

/**
 * 生成 vertex
 * @param name
 * @param icon
 * @param style
 * @param width
 * @param height
 * @param value
 */
function owl_create_vertex(icon, name, style, width, height, value) {
    var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
    cells[0].vertex = true;

    var funct = function(graph, evt, target, x, y) {
        cells = graph.getImportableCells(cells);
        if (cells.length > 0) {
            var validDropTarget = (target != null) ?
                    graph.isValidDropTarget(target, cells, evt) : false;
            var select = null;
            if (target != null && !validDropTarget) {
                target = null;
            }
            // Splits the target edge or inserts into target group
            if (graph.isSplitEnabled() && graph.isSplitTarget(target, cells, evt)) {
                graph.splitEdge(target, cells, null, x, y);
                select = cells;
            } else {
                cells = graph.getImportableCells(cells);
                if (cells.length > 0) {
                    select = graph.importCells(cells, x, y, target);
                }
            }
            if (select != null && select.length > 0) {
                graph.scrollCellToVisible(select[0]);
                graph.setSelectionCells(select);
            }
        }
    };
    var node = owl_create_img(name, icon);
    // Creates the element that is being shown while the drag is in progress
    var dragPreview = document.createElement('div');
    dragPreview.style.border = 'dashed black 1px';
    dragPreview.style.width = width + 'px';
    dragPreview.style.height = height + 'px';

    var ds = mxUtils.makeDraggable(node, owl_constant.graph, funct, dragPreview, 0, 0,
            owl_constant.graph.autoscroll, true, true);
    ds.isGuidesEnabled = function() {
        return owl_constant.graph.graphHandler.guidesEnabled;
    };
    ds.getDropTarget = function(graph, x, y) {
        var target = mxDragSource.prototype.getDropTarget.apply(this, arguments);
        if (!graph.isValidRoot(target)) {
            target = null;
        }
        return target;
    };

    // Inserts the cell on a single click
    var first = null;
    var md = 'mousedown';
    mxEvent.addListener(node, md, function(evt) {
        first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
    });

    var oldMouseUp = ds.mouseUp;
    ds.mouseUp = function(evt) {
        if (this.currentGraph == null && first != null) {
            var tol = owl_constant.graph.tolerance;
            if (Math.abs(first.x - mxEvent.getClientX(evt)) <= tol &&
                    Math.abs(first.y - mxEvent.getClientY(evt)) <= tol) {
                var gs = owl_constant.graph.getGridSize();
                ds.drop(owl_constant.graph, evt, null, gs, gs);
            }
        }
        first = null;
        oldMouseUp.apply(this, arguments);
    };
    return node;
}

function owl_create_edge(icon, name, style, width, height, value) {
    var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
    cells[0].geometry.setTerminalPoint(new mxPoint(0, height), true);
    cells[0].geometry.setTerminalPoint(new mxPoint(width, 0), false);
    cells[0].edge = true;

    var funct = function(graph, evt, target) {
        cells = graph.getImportableCells(cells);
        if (cells.length > 0) {
            var validDropTarget = (target != null) ? graph.isValidDropTarget(target, cells, evt) : false;
            var select = null;
            if (target != null && !validDropTarget) {
                target = null;
            }
            var pt = graph.getPointForEvent(evt);
            var scale = graph.view.scale;
            pt.x -= graph.snap(width / 2);
            pt.y -= graph.snap(height / 2);
            select = graph.importCells(cells, pt.x, pt.y, target);
            graph.scrollCellToVisible(select[0]);
            graph.setSelectionCells(select);
        }
    };
    var node = owl_create_img(name, icon);
    // Installs a click handler to set the edge template
    mxEvent.addListener(node, 'mousedown', function(evt) {
        edgeTemplate = cells[0];
    });
    // Creates the element that is being shown while the drag is in progress
    var dragPreview = document.createElement('div');
    dragPreview.style.border = 'dashed black 1px';
    dragPreview.style.width = width + 'px';
    dragPreview.style.height = height + 'px';
    mxUtils.makeDraggable(node, owl_constant.graph, funct, dragPreview, -width / 2, -height / 2,
            owl_constant.graph.autoscroll, true, false);
    return node;
}

/**
 * 生成每个菜单中的box
 * @param  {String}  t  标题
 * @param  {int}  w  宽度
 */
function owl_create_box(t, w) {
    var web = starfish.web;
    var box = web.dom.elem("div");
    box.className = "owl_menu_box";
    web.css(box, "width", w + "px");

    var content = web.dom.elem("div");
    content.className = "owl_box_content";

    var ul = web.dom.elem("ul");
    ul.className = "owl_box_ul";
    web.dom.insert(content, ul);

    var title = web.dom.elem("div");
    title.className = "owl_box_title";
    web.dom.addText(t, title);

    web.dom.insert(box, content);
    web.dom.insert(box, title);

    return box;
}

function owl_add_item(container, elem, style) {
    var web = starfish.web;
    var li = web.dom.elem("li");
    li.style.cssText = style;
    web.dom.insert(li, elem);
    web.dom.insert(container, li);
}

function owl_create_img(name, icon) {
    var node = mxUtils.createImage(icon);
    node.setAttribute('title', i18n(name));
    node.setAttribute('alt', i18n(name));
    node.setAttribute('width', '17');
    node.setAttribute('height', '17');
    return node;
}

function owl_create_button(name, icon) {
    var web = starfish.web;
    var button = web.dom.elem("button");
    button.setAttribute("type", "button");
    button.className += name;
    button.setAttribute('title', i18n(name));
    web.css(button, "backgroundImage", "url(" + icon + ")");
    web.dom.addText(".", button);
    return button;
}
