Ext.namespace("dev.ctrl");
dev.ctrl.SearchColumnPanel = function(params) {
	var fm = Ext.form;
	var object_id = params['objectId'];
	var Column = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'lname'
			}]);
	var defaultField = new fm.TextField({
				tabIndex : 122,
				allowBlank : true
			});
	var titleField = new fm.TextField({
				tabIndex : 120,
				allowBlank : true
			});
	var widgetStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/dev/ctrl/searchColumn.jcp?",
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : 'id'
						}, Column),
				toggle : false,
				remoteSort : false,
				autoLoad : false
			});
	var widgetField = new fm.ComboBox({
				tabIndex : 124,
				allowBlank : true,
				store : widgetStore,
				valueField : 'id',
				displayField : 'lname',
				triggerAction : 'all',
				clearTrigger : false,
				mode : 'local'
			});
	var searchField = new fm.ComboBox({
				tabIndex : 121,
				allowBlank : false,
				store : new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
										url : "/dev/ctrl/searchColumn.jcp?object_id="
												+ object_id,
										method : 'GET'
									}),
							reader : new Ext.data.JsonReader({
										root : 'dataItem',
										totalProperty : 'totalCount',
										id : 'id'
									}, Column),
							remoteSort : false,
							autoLoad : true
						}),
				valueField : 'id',
				displayField : 'lname',
				triggerAction : 'all',
				clearTrigger : false,
				mode : 'local'
			});
	searchField.on('select', function() {
				var params = {};
				params['itemId'] = searchField.getValue();
				params['object_id'] = object_id;
				params['type'] = 'widget';
				widgetStore.baseParams = params;
				widgetStore.load();
			}, this);
	var cm = {
		columns : [{
					header : '查询标题'.loc(),
					dataIndex : 'search_title',
					width : 200,
					editor : titleField
				}, {
					id : 'name',
					header : '查询列'.loc(),
					dataIndex : 'item_text',
					width : 200,
					realValueIndex : 'item_id',
					editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
					editor : searchField
				}, {
					header : '缺省值'.loc(),
					dataIndex : 'default_value',
					width : 200,
					editor : defaultField
				}, {
					header : '挂接控件'.loc(),
					dataIndex : 'widget_text',
					realValueIndex : 'widget_id',
					editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
					width : 150,
					editor : widgetField
				}]
	};

	var listStore = new Ext.data.JsonStore({
				url : "/dev/ctrl/searchColumn.jcp",
				baseParams : {
					object_id : object_id
				},
				root : 'dataItem',
				fields : ['item_id', 'item_text', 'default_value',
						'search_title', 'widget_id', 'widget_text'],
				remoteSort : false
			});
	listStore.load();
	cm = new Ext.grid.ColumnModel(cm);
	var FieldList = new lib.RowEditorGrid.ListInput({
				viewMode : false,
				enableCtrl : true,
				autoExpandColumn : 'name',
				autoScroll : true,
				border : false,
				cm : cm,
				clicksToEdit : 1,
				frame : false,
				stripeRows : true,
				minSize : 180,
				height : 420,
				region : 'center',
				store : listStore,
				width : 600
			});
	FieldList.on("beforeAddClick", function(grid, editors, rowIndex) {
				var ds = grid.getStore();
				var count = ds.getCount() - 1;
				if (count == 0)
					return true;
				var item_id = this.editors[0].getValue();
				for (var i = 0; i < count; i++) {
					if (i != rowIndex && ds.getAt(i).get("item_id") == item_id) {
						Ext.msg('error', '同一列不可重复选择'.loc());
						return false;
					}
				}
				return true;
			});

	FieldList.on("beforeentryedit", function(grid, rec, index) {
				if (!widgetStore.toggle) {
					var params = {};
					params['itemId'] = rec.get('item_id');
					if (params['itemId'] == '') {
						return true;
					}
					params['object_id'] = object_id;
					params['type'] = 'widget';
					widgetStore.baseParams = params;
					widgetStore.load({
								callback : function() {
									this.activRow = null;
									FieldList.startEditing(index, 0);
								},
								scope : this

							});
				}
				widgetStore.toggle = !widgetStore.toggle;
				return !widgetStore.toggle;
			});
	var inp = new Ext.Panel({
				border : false,
				layout : 'border',
				items : [FieldList]
			});
	inp.fl = FieldList;
	inp.getJson = function() {
		var storeValue = [];
		var allRecords = listStore.getRange(0);
		for (i = 0; i < allRecords.length - 1; i++)
			storeValue[i] = allRecords[i].data;
		var returnJson = {
			fields : Ext.encode(storeValue)
		};
		return returnJson;
	}
	inp.reload = function() {
		listStore.load();
	}
	return inp;
}