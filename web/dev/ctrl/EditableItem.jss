Ext.namespace("dev.ctrl");
dev.ctrl.EditableItem = Ext.extend(Ext.menu.BaseItem, {
	itemCls : "x-menu-item",
	hideOnClick : false,
	initComponent : function() {
		this.addEvents({
					keyup : true
				});

		this.editor = this.editor || new Ext.form.TextField();
		if (this.text)
			this.editor.setValue(this.text);
	},

	onRender : function(container) {
		var s = container.createChild({
			cls : this.itemCls,
			html : '<img src="'
					+ this.menuIcon
					+ '" class="x-menu-item-icon" style="margin: 3px 12px 2px 2px;float:left;" />'
		});

		Ext.apply(this.config, {
					width : 125
				});
		this.editor.render(s);

		this.el = s;
		this.relayEvents(this.editor.el, ["keyup"]);

		if (Ext.isGecko)
			s.setStyle('overflow', 'auto');

		dev.ctrl.EditableItem.superclass.onRender.apply(this, arguments);
	},

	getValue : function() {
		return this.editor.getValue();
	},

	setValue : function(value) {
		this.editor.setValue(value);
	},

	isValid : function(preventMark) {
		return this.editor.isValid(preventMark);
	}
});