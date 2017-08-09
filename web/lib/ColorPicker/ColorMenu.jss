Ext.namespace("lib.ColorPicker");

using("lib.ColorPicker.ColorPicker");
lib.ColorPicker.ColorMenu = Ext.extend(Ext.menu.Menu, {
	enableScrolling : false,
	hideOnClick : true,
	initComponent : function() {
		Ext.apply(this, {
					plain : true,
					showSeparator : false,
					items : this.picker = new Ext.ux.ColorPicker(this.initialConfig)
				});
		lib.ColorPicker.ColorMenu.superclass.initComponent.call(this);
		this.relayEvents(this.picker, ["select"]);
		this.on("select", this.menuHide, this);
		if (this.handler) {
			this.on("select", this.handler, this.scope || this)
		}
	},
	menuHide : function() {
		if (this.hideOnClick) {
			this.hide(true)
		}
	}
});