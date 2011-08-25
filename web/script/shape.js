/**
 * Cube Shape
 */
function CubeShape() {
}

CubeShape.prototype = new mxCylinder();
CubeShape.prototype.constructor = CubeShape;
CubeShape.prototype.extrude = 20;
CubeShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    var dy = this.extrude * this.scale;
    var dx = this.extrude * this.scale;

    if (isForeground) {
        path.moveTo(dx, h);
        path.lineTo(dx, dy);
        path.lineTo(0, 0);
        path.moveTo(dx, dy);
        path.lineTo(w, dy);
        path.end();
    } else {
        path.moveTo(0, 0);
        path.lineTo(w - dx, 0);
        path.lineTo(w, dy);
        path.lineTo(w, h);
        path.lineTo(dx, h);
        path.lineTo(0, h - dy);
        path.lineTo(0, 0);
        path.close();
        path.end();
    }
};

mxCellRenderer.prototype.defaultShapes['cube'] = CubeShape;

/**
 * Note Shape
 */
function NoteShape() {
}

NoteShape.prototype = new mxCylinder();
NoteShape.prototype.constructor = NoteShape;
NoteShape.prototype.extrude = 30;
NoteShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    var dx = this.extrude * this.scale;
    var dy = this.extrude * this.scale;

    if (isForeground) {
        path.moveTo(w - dx, 0);
        path.lineTo(w - dx, dy);
        path.lineTo(w, dy);
        path.end();
    } else {
        path.moveTo(0, 0);
        path.lineTo(w - dx, 0);
        path.lineTo(w, dy);
        path.lineTo(w, h);
        path.lineTo(0, h);
        path.lineTo(0, 0);
        path.close();
        path.end();
    }
};

mxCellRenderer.prototype.defaultShapes['note'] = NoteShape;

/**
 * Folder Shape
 */
function FolderShape() {
}

FolderShape.prototype = new mxCylinder();
FolderShape.prototype.constructor = FolderShape;
FolderShape.prototype.crisp = true;
FolderShape.prototype.tabWidth = 60;
FolderShape.prototype.tabHeight = 20;
FolderShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    var dx = this.tabWidth * this.scale;
    var dy = this.tabHeight * this.scale;

    if (isForeground) {
        path.moveTo(w - dx, dy);
        path.lineTo(w, dy);
        path.end();
    } else {
        path.moveTo(0, dy);
        path.lineTo(w - dx, dy);
        path.lineTo(w - dx, 0);
        path.lineTo(w, 0);
        path.lineTo(w, h);
        path.lineTo(0, h);
        path.lineTo(0, dy);
        path.close();
        path.end();
    }
};

mxCellRenderer.prototype.defaultShapes['folder'] = FolderShape;

/**
 * Card Shape
 */
function CardShape() {
}

CardShape.prototype = new mxCylinder();
CardShape.prototype.constructor = CardShape;
CardShape.prototype.extrude = 30;
CardShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    var dx = this.extrude * this.scale;
    var dy = this.extrude * this.scale;

    if (!isForeground) {
        path.moveTo(dx, 0);
        path.lineTo(w, 0);
        path.lineTo(w, h);
        path.lineTo(0, h);
        path.lineTo(0, dy);
        path.lineTo(dx, 0);
        path.close();
        path.end();
    }
};

mxCellRenderer.prototype.defaultShapes['card'] = CardShape;

/**
 * Tape Shape
 */
function TapeShape() {
}

TapeShape.prototype = new mxCylinder();
TapeShape.prototype.constructor = TapeShape;
TapeShape.prototype.size = 0.4;
TapeShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    var dy = h * this.size;
    var fy = 1.4;

    if (!isForeground) {
        path.moveTo(0, dy / 2);
        path.quadTo(w / 4, dy * fy, w / 2, dy / 2);
        path.quadTo(w * 3 / 4, dy * (1 - fy), w, dy / 2);
        path.lineTo(w, h - dy / 2);
        path.quadTo(w * 3 / 4, h - dy * fy, w / 2, h - dy / 2);
        path.quadTo(w / 4, h - dy * (1 - fy), 0, h - dy / 2);
        path.lineTo(0, dy / 2);
        path.close();
        path.end();
    }
};

mxCellRenderer.prototype.defaultShapes['tape'] = TapeShape;
