var BetterORM = function (oRm) {
    this._oRm = oRm;
    this._elements = [];
};

BetterORM.Element = function (owner, parent, tag) {
    this._owner = owner;
    this._parent = parent;
    this._tag = tag;

    this._control = null;

    this._classes = [];
    this._attributes = {};
    this._html = null;

    this._children = [];
};

BetterORM.prototype.create = function (tag) {
    var element = new BetterORM.Element(this, this, tag);
    this._elements.push(element);
    return element;
};

BetterORM.prototype.flush = function () {
    this._elements.forEach(function (e) {
        e.expand();
    });

    this._elements = [];
};

BetterORM.Element.prototype.setControlData = function(control) {
    this._control = control;
    return this;
};

BetterORM.Element.prototype.addClass = function (str) {
    var self = this;
    str.split(/\s+/).forEach(function (e) {
        self._classes.push(e);
    });
    return this;
};

BetterORM.Element.prototype.setClass = function (str) {
    this._classes = [];
    return this.addClass(str);
};

BetterORM.Element.prototype.attr = function (name, value) {
    if (typeof value === "undefined") {
        return this._attributes[name] || "";
    }

    this._attributes[name] = value;
    return this;
};

BetterORM.Element.prototype.html = function (str) {
    if (typeof str === "undefined") {
        return this._html;
    }

    this._html = str;
    return this;
};

BetterORM.Element.prototype.addControl = function (control) {
    this._children.push(control);
    return this;
};

BetterORM.Element.prototype.create = function (tag) {
    var element = new BetterORM.Element(this, this._owner, tag);
    this._children.push(element);
    return element;
};

BetterORM.Element.prototype.destroy = function () {
    var i = this._parent._children.indexOf(this);
    if (i >= 0) {
        this._parent._children.splice(i, 1);
    }
};

BetterORM.escapeHTML = function (html) {
    return html;
};

BetterORM.escapeAttribute = function (attr) {
    return attr.replace(/"/g, "\\\"");
};

BetterORM.Element.prototype.expand = function () {
    var oRm = this._owner._oRm;

    oRm.write("<" + this._tag);

    if (this._control !== null) {
        oRm.write(" ");
        oRm.writeControlData(this._control);
    }

    if (this._classes.length > 0) {
        oRm.write(" class=\"" + this._classes.join(" ") + "\"");
    }

    for (var name in this._attributes) {
        if (this._attributes.hasOwnProperty(name)) {
            oRm.write(" " + name + "=\"" + BetterORM.escapeAttribute(this._attributes[name]) + "\"");
        }
    }

    if (this._html !== null) {
        oRm.write(">" + BetterORM.escapeHTML(this._html) + "</" + this._tag + ">");
    }
    else if (this._children.length > 0) {
        oRm.write(">");

        this._children.forEach(function (e) {
            if (e instanceof sap.ui.core.Control) {
                oRm.renderControl(e);
            }
            else if (typeof e.expand === "function") {
                e.expand();
            }
        });

        oRm.write("</" + this._tag + ">");
    }
    else {
        oRm.write("/>");
    }
};
