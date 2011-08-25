starfish.web.dom.domReady(function() {
    var web = starfish.web;

    mxResources.add('mxGraph/resources/editor');
    mxResources.add('mxGraph/resources/graph');
    mxResources.add('mxGraph/resources/toolbar');

    var hash = location.hash.toString();
    owl_constant.theme = hash.getParamter("theme") || owl_constant.theme; // 主题(默认:default)
    //var mxLanguage = hash.getParamter("lang") || null;
    owl_constant.storage = hash.getParamter("storage") || null;

    owl_beforeMain();

    owl_main();

    // 工具条
    owl_toolbar();

    // 工具条各项加事件
    owl_add_event();

    owl_afterMain();

    // 最后移除loading...
    (function() {
        var loading = $('owl_loading');
        if (loading != null) {
            try {
                mxEvent.release(loading);
                mxEffects.fadeOut(loading, 100, true);
            } catch (e) {
                starfish.web.dom.dispose(loading);
            }
        }
    })();
});

/**
 * 一些初始化步骤
 */
function owl_beforeMain() {
    var web = starfish.web;

    mxPopupMenu.prototype.submenuImage = 'images/submenu.gif';
    // 预读图片
    var img = new Image();
    img.src = mxPopupMenu.prototype.submenuImage;

    // Specifies if local storage should be used (eg. on the iPad which has no filesystem)
    var useLocalStorage = owl_constant.storage == 'local' && typeof(localStorage) != 'undefined';

    ////////////////

    // Specifies if tapAndHold on touch devices should start connections
    var tapAndHoldStartsConnection = false;

    mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);
    // 预读图片
    var _img = new Image();
    _img.src = mxConnectionHandler.prototype.connectImage.src;

    owl_constant.edgeTemplate = new mxCell();
    owl_constant.edgeTemplate.edge = true;

    // 刷新/退出窗口提示
    web.event.addEvent(window, 'beforeunload', function(e) {
        e = e || window.event;
        if (owl_constant.modified && owl_constant.collab == null) {
            var s = i18n('edit_changesLost');
            if (mxClient.IS_IE) {
                e.returnValue = s;
            } else {
                return s;
            }
        }
    });

    owl_constant.graph = new mxGraph($('owl_graph'));
    owl_constant.undoMgr = new mxUndoManager();
    owl_constant.graphEditor = {};
}

function owl_main() {
    // 屏蔽右键
    //mxEvent.disableContextMenu(document.body);

    // rubberband selection 可选择矩形区域
    var rubberband = new mxRubberband(owl_constant.graph);

    // 倒转elbow edge样式 且不移除已经存在的样式
    owl_constant.graph.flipEdge = function(edge) {
        if (edge != null) {
            var state = this.view.getState(edge);
            var style = (state != null) ? state.style : this.getCellStyle(edge);
            if (style != null) {
                var elbow = mxUtils.getValue(style, mxConstants.STYLE_ELBOW,
                        mxConstants.ELBOW_HORIZONTAL);
                var value = (elbow == mxConstants.ELBOW_HORIZONTAL) ?
                        mxConstants.ELBOW_VERTICAL : mxConstants.ELBOW_HORIZONTAL;
                this.setCellStyles(mxConstants.STYLE_ELBOW, value, [edge]);
            }
        }
    };

    // 载入默认的样式
    var node = mxUtils.load('mxGraph/resources/defaultStyle.xml').getDocumentElement();
    var dec = new mxCodec(node.ownerDocument);
    dec.decode(node, owl_constant.graph.getStylesheet());

    // 双击elbow edge时使用alternate edge样式
    owl_constant.graph.alternateEdgeStyle = 'vertical';

    owl_constant.graph.panningHandler.factoryMethod = function(menu, cell, evt) {
        //return createPopupMenu(graph, menu, cell, evt);
    };

    // Tap and hold brings up context menu.
    // Tolerance slightly below graph tolerance is better. 容错率
    owl_constant.graph.connectionHandler.tapAndHoldTolerance = 16;

    //  Tap and hold on background starts rubberband on cell starts connecting
    var connectionHandlerTapAndHold = owl_constant.graph.connectionHandler.tapAndHold;
    owl_constant.graph.connectionHandler.tapAndHold = function(me, state) {
        if (state == null) {
            if (!owl_constant.graph.panningHandler.active) {
                rubberband.start(me.getGraphX(), me.getGraphY());
                owl_constant.graph.panningHandler.panningTrigger = false;

                var img = document.createElement('img');
                img.setAttribute('src', 'images/crosshair.png');
                img.style.position = 'absolute';
                img.style.width = '128px';
                img.style.height = '128px';
                img.style.left = (me.getGraphX() - 64) + 'px';
                img.style.top = (me.getGraphY() - 64) + 'px';
                owl_constant.graph.container.appendChild(img);

                window.setTimeout(function() {
                    if (img.parentNode != null) {
                        img.parentNode.removeChild(img);
                    }
                }, 400);
            }
        } else if (owl_constant.tapAndHoldStartsConnection) {
            connectionHandlerTapAndHold.apply(this, arguments);
        } else if (owl_constant.graph.isCellSelected(state.cell) && owl_constant.graph.getSelectionCount() > 1) {
            owl_constant.graph.removeSelectionCell(state.cell);
        }
    };

    // Installs the command history after the initial graph
    // has been created
    var listener = function(sender, evt) {
        owl_constant.undoMgr.undoableEditHappened(evt.getProperty('edit'));
    };

    owl_constant.graph.getModel().addListener(mxEvent.UNDO, listener);
    owl_constant.graph.getView().addListener(mxEvent.UNDO, listener);

    // Keeps the selection in sync with the history
    var undoHandler = function(sender, evt) {
        var changes = evt.getProperty('edit').changes;
        owl_constant.graph.setSelectionCells(owl_constant.graph.getSelectionCellsForChanges(changes));
    };

    owl_constant.undoMgr.addListener(mxEvent.UNDO, undoHandler);
    owl_constant.undoMgr.addListener(mxEvent.REDO, undoHandler);

    owl_constant.graph.setAllowLoops(true);
    owl_constant.graph.setConnectable(true);
    owl_constant.graph.setDropEnabled(true);
    owl_constant.graph.setPanning(true);
    owl_constant.graph.setTooltips(!mxClient.IS_TOUCH);
    owl_constant.graph.setAllowDanglingEdges(true);
    owl_constant.graph.foldingEnabled = false;
    owl_constant.graph.connectionHandler.setCreateTarget(true);

    // 辅助线
    owl_constant.graph.graphHandler.guidesEnabled = true;
    // Alt disables guides
    mxGuide.prototype.isEnabledForEvent = function(evt) {
        return !mxEvent.isAltDown(evt);
    };

    // Connect preview
    owl_constant.graph.connectionHandler.createEdgeState = function(me) {
        if (owl_constant.edgeTemplate != null) {
            return owl_constant.graph.view.createState(owl_constant.edgeTemplate);
        }
        return null;
    };

    // Disable folding
    owl_constant.graph.isCellFoldable = function(cell) {
        return this.foldingEnabled && owl_constant.graph.isSwimlane(cell);
    };

    // Defines valid roots for drill-down, we use swimlanes and cells with existing children
    owl_constant.graph.isValidRoot = function(cell) {
        return owl_constant.graph.isSwimlane(cell);
    };

    // Updates the modified flag
    owl_constant.graph.getModel().addListener(mxEvent.CHANGE, function(sender, evt) {
        owl_constant.modified = true;
    });

    // Transfers focus to graph container for key handling. This is not
    // required for IE as it transfers focus to clicked DIV nodes.
    if (!mxClient.IS_IE && !mxClient.IS_TOUCH) {
        owl_constant.graph.container.setAttribute('tabindex', '-1');
        mxEvent.addListener(owl_constant.graph.container, 'mousedown', function() {
            if (!owl_constant.graph.isEditing()) {
                owl_constant.graph.container.focus();
            }
        });
    }

    // Enables dropping files
    if (owl_constant.fileSupport) {
        function handleDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            // todo handleFiles(evt.dataTransfer.files);
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        }

        // Setup the dnd listeners.
        owl_constant.graph.container.addEventListener('dragover', handleDragOver, false);
        owl_constant.graph.container.addEventListener('drop', handleDrop, false);
    }

    // Overrides createGroupCell to set the group style for new groups to 'group'
    var previousCreateGroupCell = owl_constant.graph.createGroupCell;

    owl_constant.graph.createGroupCell = function() {
        var group = previousCreateGroupCell.apply(this, arguments);
        group.setStyle('group');
        return group;
    };

    owl_constant.graph.connectionHandler.factoryMethod = function() {
        if (owl_constant.edgeTemplate != null) {
            return owl_constant.graph.cloneCells([owl_constant.edgeTemplate])[0];
        }
        return null;
    };

    var nudge = function(keyCode) {
        if (!owl_constant.graph.isSelectionEmpty()) {
            var dx = 0, dy = 0;
            if (keyCode == 37) {    // Arrow Left
                dx = -1;
            } else if (keyCode == 38) {    // Arrow Up
                dy = -1;
            } else if (keyCode == 39) {    // Arrow Right
                dx = 1;
            } else if (keyCode == 40) {    // Arrow Down
                dy = 1;
            }
            owl_constant.graph.moveCells(owl_constant.graph.getSelectionCells(), dx, dy);
        }
    };

    // Transfer initial focus to graph container for keystroke handling
    owl_constant.graph.container.focus();

    // Handles keystroke events
    var keyHandler = new mxKeyHandler(owl_constant.graph);

    // Ignores enter keystroke. Remove this line if you want the
    // enter keystroke to stop editing
    keyHandler.enter = function() {
    };

    keyHandler.bindKey(37, function() {
        nudge(37);
    });

    keyHandler.bindKey(38, function() {
        nudge(38);
    });

    keyHandler.bindKey(39, function() {
        nudge(39);
    });

    keyHandler.bindKey(40, function() {
        nudge(40);
    });

    keyHandler.bindKey(8, function() {   // Backspace
        if (owl_constant.graph.foldingEnabled) {
            owl_constant.graph.foldCells(true);
        }
    });

    keyHandler.bindKey(13, function() {  // Enter
        if (owl_constant.graph.foldingEnabled) {
            owl_constant.graph.foldCells(false);
        }
    });

    keyHandler.bindKey(33, function() {  // Page Up
        if (owl_constant.graph.foldingEnabled) {
            owl_constant.graph.exitGroup();
        }
    });

    keyHandler.bindKey(34, function() {  // Page Down
        if (owl_constant.graph.foldingEnabled) {
            owl_constant.graph.enterGroup();
        }
    });

    keyHandler.bindKey(36, function() {  // Home
        if (owl_constant.graph.foldingEnabled) {
            owl_constant.graph.home();
        }
    });

    keyHandler.bindKey(35, function() {  // End
        owl_constant.graph.refresh();
    });

    keyHandler.bindControlKey(37, function() {  // Ctrl + left
        owl_constant.graph.selectPreviousCell();
    });

    keyHandler.bindControlKey(38, function() {  // Ctrl + up
        owl_constant.graph.selectParentCell();
    });

    keyHandler.bindControlKey(39, function() {  // Ctrl + right
        owl_constant.graph.selectNextCell();
    });

    keyHandler.bindControlKey(40, function() {  // Ctrl + down
        owl_constant.graph.selectChildCell();
    });

    keyHandler.bindKey(46, function() {  // Delete
        owl_constant.graph.removeCells();
    });

    keyHandler.bindKey(107, function() {  // + (Num Lock)
        owl_constant.graph.zoomIn();
    });

    keyHandler.bindKey(109, function() {  // - (Num Lock)
        owl_constant.graph.zoomOut();
    });

    keyHandler.bindKey(113, function() {  // F2
        owl_constant.graph.startEditingAtCell();
    });

    keyHandler.bindControlKey(65, function() {  // Ctrl + a
        owl_constant.graph.selectAll();
    });

    keyHandler.bindControlKey(89, function() {  // Ctrl + y
        owl_constant.undoMgr.redo();
    });

    keyHandler.bindControlKey(90, function() {  // Ctrl + z
        owl_constant.undoMgr.undo();
    });

    keyHandler.bindControlKey(68, function() {  // Ctrl + d
        if (!owl_constant.graph.isSelectionEmpty()) {
            var s = owl_constant.graph.gridSize;
            owl_constant.graph.setSelectionCells(owl_constant.graph.moveCells(owl_constant.graph.getSelectionCells(), s, s, true));
        }
    });

    keyHandler.bindControlKey(88, function() {  // Ctrl + x
        mxClipboard.cut(owl_constant.graph);
    });

    keyHandler.bindControlKey(67, function() {  // Ctrl + c
        mxClipboard.copy(owl_constant.graph);
    });

    keyHandler.bindControlKey(86, function() {  // Ctrl + v
        mxClipboard.paste(owl_constant.graph);
    });

    keyHandler.bindControlKey(71, function() {  // Ctrl + g
        owl_constant.graph.setSelectionCell(owl_constant.graph.groupCells(null, 0));
    });

    keyHandler.bindControlKey(85, function() {  // Ctrl + u
        owl_constant.graph.setSelectionCells(owl_constant.graph.ungroupCells());
    });
}

function owl_afterMain() {
    var menu_file = $("menu_file");

    if (!owl_constant.miniUi) {
        var selectionListener = function() {
            var edgeSelected = false;
            var vertexSelected = false;
            var selected = false;
            var cells = owl_constant.graph.getSelectionCells();
            if (cells != null) {
                selected = cells.length > 0;
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    if (owl_constant.graph.getModel().isEdge(cell)) {
                        edgeSelected = true;
                    }
                    if (owl_constant.graph.getModel().isVertex(cell)) {
                        vertexSelected = true;
                    }
                    if (edgeSelected && vertexSelected) {
                        break;
                    }
                }
            }

            // 剪贴板
            _disable(_get('tb_cut'), !selected);
            _disable(_get('tb_copy'), !selected);
            _disable(_get('tb_delete'), !selected);

//            var shape = toolbarItems.get('shape');
//            shape.items.get('group').setDisabled(!selected);
//            shape.items.get('ungroup').setDisabled(!selected);
//            shape.items.get('rotate').setDisabled(!selected);
//            shape.items.get('toback').setDisabled(!selected);
//            shape.items.get('tofront').setDisabled(!selected);
//            shape.items.get('alignShapes').setDisabled(graph.getSelectionCount() <= 1);
//
//            var font = toolbarItems.get('font');
//            font.items.get('italic').setDisabled(!selected);
//            font.items.get('bold').setDisabled(!selected);
//            font.items.get('underline').setDisabled(!selected);
//            font.items.get('align').setDisabled(!selected);
//
//            var colors = toolbarItems.get('colors');
//            colors.items.get('fillcolor').setDisabled(!selected);
//            colors.items.get('fontcolor').setDisabled(!selected);
//            colors.items.get('linecolor').setDisabled(!selected);
//            colors.items.get('gradientcolor').setDisabled(!selected);
//            colors.items.get('shadow').setDisabled(!vertexSelected);
//            colors.items.get('image').setDisabled(!vertexSelected);
//
//            var line = toolbarItems.get('line');
//            line.items.get('connection').setDisabled(!edgeSelected);
//            line.items.get('linewidth').setDisabled(!selected);
//            line.items.get('linestart').setDisabled(!edgeSelected);
//            line.items.get('lineend').setDisabled(!edgeSelected);
//            line.items.get('dashed').setDisabled(!selected);
//            line.items.get('rounded').setDisabled(!selected);
        };
        owl_constant.graph.getSelectionModel().addListener(mxEvent.CHANGE, selectionListener);
        selectionListener();
    }

    if (owl_constant.collab == null) {
        var historyListener = function() {
            _disable(_get('tb_undo'), !owl_constant.undoMgr.canUndo());
            _disable(_get('tb_redo'), !owl_constant.undoMgr.canRedo());
        };
        owl_constant.undoMgr.addListener(mxEvent.ADD, historyListener);
        owl_constant.undoMgr.addListener(mxEvent.UNDO, historyListener);
        owl_constant.undoMgr.addListener(mxEvent.REDO, historyListener);
        historyListener();
    }

    function _get(clazz) {
        return starfish.web.className(clazz, menu_file)[0];
    }

    function _disable(elem, flag) {
        if (flag) {
            elem.setAttribute("disabled", "disabled");
            elem.disabled = true;
        } else {
            elem.setAttribute("disabled", "");
            elem.disabled = false;
        }
    }
}

function getGraphData() {
    var enc = new mxCodec(mxUtils.createXmlDocument());
    var node = enc.encode(owl_constant.graph.getModel());
    return mxUtils.getXml(node);
}

function exportImg(_w) {
    var imgExport = new mxImageExport();
    var width = 300, height = 200;
    var scale = parseInt(_w) / width;
    var bounds = owl_constant.graph.getGraphBounds();

    // New image export
    var xmlDoc = mxUtils.createXmlDocument();
    var root = xmlDoc.createElement('output');
    xmlDoc.appendChild(root);
    var xmlCanvas = new mxXmlCanvas2D(root);

    // Render graph
    xmlCanvas.scale(scale);
    xmlCanvas.translate(-bounds.x, -bounds.y);
    imgExport.drawState(owl_constant.graph.getView().getState(owl_constant.graph.model.root), xmlCanvas);

    var w = Math.round((bounds.width + 4) * scale);
    var h = Math.round((bounds.height + 4) * scale);

    var xml = mxUtils.getXml(root);

    alert(xml);

}
