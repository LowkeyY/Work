Ext.namespace("lib.RowEditorTree");
lib.RowEditorTree.TreeEditor = function(tree, field, config) {
	this.tree = tree;
	lib.RowEditorTree.TreeEditor.superclass.constructor.call(this, field,
			config);
}
Ext.extend(lib.RowEditorTree.TreeEditor, Ext.Editor, {
			alignment : "tl-tl",
			onBlur : Ext.emptyFn,
			onShow : function() {
				this.el.show();
				if (this.hideEl !== false) {
					this.boundEl.hide();
				}
				this.field.show();
			}
		});

lib.RowEditorTree.RowEditorTree = Ext.extend(Ext.tree.TreePanel, {
	borderWidth : Ext.isBorderBox ? 0 : 2,
	cls : 'x-column-tree',
	activeNode : null,
	autoSave : true,
	initComponent : function() {
		lib.RowEditorTree.RowEditorTree.superclass.initComponent.call(this);
		this.on("click", function(node, e) {
					this.startEditing(node);
				}, this);
		this.addEvents('beforestartediting');
		this.initEditors();		
	},
	initEditors : function() {
		for (var i = 0; i < this.columns.length; i++) {
			if (typeof(this.columns[i].editor) != 'undefined') {
				this.editors[this.columns[i].dataIndex] = new lib.RowEditorTree.TreeEditor(
						this, this.columns[i].editor);
				delete this.columns[i].editor;
			}
		}
	},
	onDestroy : function() {
		for (var i in this.editors) {
			this.editors[i].tree = null; 
			this.editors[i].destroy();
		}
		this.editors = null; 
	},
	startEditing : function(node) {
		if (node == this.activeNode)
			return;
        if(this.fireEvent('beforestartediting', node)===false){
            return false;
        }
		if (this.activeNode != null)
			this.stopEditing(this.autoSave);
		this.activeNode = node;

		var divs = node.divs || this.getNodeDivs(node);
		var editors = node.editors || this.getNodeEditors(node);
		var values = this.getNodeValues(node, editors, divs);
		for (var i = 0, len = editors.length; i < len; i++) {
			if (editors[i] != null) {
				editors[i].startEdit(divs[i], values[i]);
			}
		}
	},
	stopEditing : function(save) {
		if (this.activeNode != null) {
			var n = this.activeNode;
			var editors = n.editors || this.getNodeEditors(n);
			for (var i = 0, len = editors.length; i < len; i++) {
				if (editors[i] != null) {
					if (save)
						this.saveValue(n, editors[i], i);
					editors[i].hide();
				}
			}
			this.activeNode = null;
		}
	},
	saveValue : function(node, editor, colIndex) {
		var val = editor.getValue();
		node.attributes[this.columns[colIndex].dataIndex] = val;
		node.divs[colIndex].innerHTML =Ext.util.Format.htmlEncode(val);
	},
	editors : {},
	getNodeValues : function(node, ceditors, divs) {
		var values = new Array(ceditors.length);
		for (var i = 0; i < ceditors.length; i++) {
			if (ceditors[i] != null)
				values[i] = node.attributes[this.columns[i].dataIndex];
		}
		return values;
	},
	getNodeDivs : function(node) {
		var ui = node.getUI();
		var ds = ui.elNode.childNodes;
		var divs = new Array();
		divs[0] = ui.textNode;
		for (var i = 1; i < this.columns.length; i++) {
			divs[i] = ds[i].firstChild;
		}
		node.divs = divs;
		return node.divs;
	},
	getNodeEditors : function(node) {
		var arr = new Array();
		for (var i = 0; i <this.columns.length; i++) {
			arr[i] = this.editors[this.columns[i].dataIndex];
		}
		node.editors = arr;
		return node.editors;
	},
	addNode : function(isGroup) {
		if (this.activeNode == null)
			return false;
		var config = {};
		for (var i = 0; i < this.columns.length; i++) {
			config[this.columns[i].dataIndex] = "";
		}
		var child = Ext.apply({
					uiProvider : Ext.tree.ColumnNodeUI,
					text : '',
					leaf : true
				}, config);
		if (isGroup) {
			child = Ext.apply({
						children : [child],
						uiProvider : Ext.tree.ColumnNodeUI,
						text : '',
						expanded : true,
						leaf : false
					}, config);
		}
		var group = new Ext.tree.AsyncTreeNode(child);
		this.activeNode.appendChild(group);
		return true;
	},
	onRender : function() {
		lib.RowEditorTree.RowEditorTree.superclass.onRender.apply(this,
				arguments);
		this.headers = this.body.createChild({
					cls : 'x-tree-headers'
				}, this.innerCt.dom);

		var cols = this.columns, c;
		var totalWidth = 0;

		for (var i = 0, len = cols.length; i < len; i++) {
			c = cols[i];
			totalWidth += c.width;
			this.headers.createChild({
				cls : 'x-tree-hd ' + (c.cls ? c.cls + '-hd' : ''),
				cn : {
					cls : 'x-tree-hd-text',
					html : c.header
				},
				style : 'width:' + (c.width - this.borderWidth) + 'px;'
			});
		}
		this.headers.createChild({
			cls : 'x-clear'
		});
		this.headers.setWidth(totalWidth);
		this.innerCt.setWidth(totalWidth);
	}
});

Ext.tree.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
			focus : Ext.emptyFn, // prevent odd scrolling behavior

			renderElements : function(n, a, targetNode, bulkRender) {
				this.indentMarkup = n.parentNode ? n.parentNode.ui
						.getChildIndent() : '';

				var t = n.getOwnerTree();
				var cols = t.columns;
				var bw = t.borderWidth;
				var c = cols[0];

				var buf = [
						'<li class="x-tree-node"><div ext:tree-node-id="',
						n.id,
						'" class="x-tree-node-el x-tree-node-leaf ',
						a.cls,
						'">',
						'<div class="x-tree-col" style="width:',
						c.width - bw,
						'px;">',
						'<span class="x-tree-node-indent">',
						this.indentMarkup,
						"</span>",
						'<img src="',
						this.emptyIcon,
						'" class="x-tree-ec-icon x-tree-elbow">',
						'<img src="',
						a.icon || this.emptyIcon,
						'" class="x-tree-node-icon',
						(a.icon ? " x-tree-node-inline-icon" : ""),
						(a.iconCls ? " " + a.iconCls : ""),
						'" unselectable="on">',
						'<a hidefocus="on" class="x-tree-node-anchor" href="',
						a.href ? a.href : "#",
						'" tabIndex="1" ',
						a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
						'>',
						'<span unselectable="on">',
						n.text
								|| (c.renderer ? c.renderer(a[c.dataIndex], n,
										a) : a[c.dataIndex]), "</span></a>",
						"</div>"];
				for (var i = 1, len = cols.length; i < len; i++) {
					c = cols[i];

					buf.push('<div class="x-tree-col ', (c.cls ? c.cls : ''),
							'" style="width:', c.width - bw, 'px;">',
							'<div class="x-tree-col-text">', (c.renderer
									? c.renderer(a[c.dataIndex], n, a)
									: a[c.dataIndex]), "</div>", "</div>");
				}
				buf
						.push(
								'<div class="x-clear"></div></div>',
								'<ul class="x-tree-node-ct" style="display:none;"></ul>',
								"</li>");

				if (bulkRender !== true && n.nextSibling
						&& n.nextSibling.ui.getEl()) {
					this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
							n.nextSibling.ui.getEl(), buf.join(""));
				} else {
					this.wrap = Ext.DomHelper.insertHtml("beforeEnd",
							targetNode, buf.join(""));
				}

				this.elNode = this.wrap.childNodes[0];
				this.ctNode = this.wrap.childNodes[1];
				var cs = this.elNode.firstChild.childNodes;
				this.indentNode = cs[0];
				this.ecNode = cs[1];
				this.iconNode = cs[2];
				this.anchor = cs[3];
				this.textNode = cs[3].firstChild;
			}
		});
