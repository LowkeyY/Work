Ext.namespace('lib.SelectOrg');
lib.SelectOrg.SelectOrg = Ext.extend(Ext.form.TriggerField, {
	win : null,
	triggerClass : 'x-form-search-trigger',
	onTriggerClick : function() {
		if (this.readOnly || this.disabled) {
			return;
		}
		if (this.win == null) {
			this.createWindow();
		}
		this.win.show(this.el);
	},

	createWindow : function() {
		var ds = new Ext.data.JsonStore({
					method : 'GET',
					url : '/lib/SelectOrg/SelectOrg.jcp',
					root : 'data',
					fields : ["short_name", "org_type", "org_id", "entry_date"],
					autoLoad : true
				});
		var grid = new Ext.grid.GridPanel({
					border : false,
					store : ds,
					columns : [{
								header : '机构名称'.loc(),
								width : 120,
								dataIndex : 'short_name'
							}, {
								header : '机构类型'.loc(),
								dataIndex : 'org_type'
							}, {
								header : '机构ID'.loc(),
								dataIndex : 'org_id'
							}, {
								header : '创建时间'.loc(),
								dataIndex : 'entry_date'
							}]
				});
		var saveButton = new Ext.Toolbar.Button({
					text : '确定',
					scope : this,
					handler : function() {
						var rec = grid.getSelectionModel().getSelected();
						if (!rec) {
							Ext.msg("warn", "请选择一行");
							return;
						} else {
							this.setValue({
										text : rec.get('short_name'),
										value : rec.get('org_id')
									});
						}
						this.win.hide();
					}
				})
		this.win = new Ext.Window({
					title : '选择组织机构'.loc(),
					width : 540,
					buttons : [{
								xtype : 'button',
								text : '取消',
								scope : this,
								handler : function() {
									this.win.hide();
								}
							}, saveButton],
					height : 400,
					autoScroll : false,
					layout : 'fit',
					modal : true,
					closeAction : 'hide',
					plain : true,
					items : grid
				})
	},
	setValue : function(v) {
		if (v.text) {
			this.setText(v.text);
			this.value = v.value;
		} else {
			this.setText(v);
		}
	},
	setText : function(text) {
		lib.SelectOrg.SelectOrg.superclass.setValue.call(this, text);
	},
	onDestroy : function() {
		Ext.destroy(this.win);
		lib.SelectOrg.SelectOrg.superclass.onDestroy.call(this);
	}
});
Ext.reg('selectorg', lib.SelectOrg.SelectOrg);
