dev.database.ConstraintColumnPanel = function(type, name, object_id) {
	var showPlus = (type == 'F' || type == 'R');
	var editMode = name.length > 1;
	var constraintForm = {};
	if (showPlus || editMode) {
		var leftItms = [];
		var rightItms = [{
					xtype : 'hidden',
					name : 'id'
				}];

		if (editMode) {
			leftItms.push({
						xtype : 'textfield',
						tabIndex : 101,
						fieldLabel : '约束名称'.loc(),
						name : 'c_name',
						width : 200,
						readOnly : true,
						value : name
					});
		}
		if (showPlus) {
			var tableCombo = new lib.ComboTree.ComboTree({
						fieldLabel : '引用表'.loc(),
						forceLeaf : true,
						width : 240,
						height : 400,
						queryParam : "type",
						name : 'application_id',
						mode : 'remot',
						allowBlank : false,
						root : new Ext.tree.AsyncTreeNode({
									text : '所有系统'.loc(),
									draggable : false,
									expanded : true,
									id : '0',
									icon : "/themes/icon/all/plugin.gif"
								}),
						loader : new Ext.tree.TreeLoader({
									dataUrl : '/dev/database/tableTree.jcp?object_id='
											+ object_id,
									requestMethod : "GET"
								})
					});
			tableCombo.on("select", function(obj, node, e) {
						if (listStore.getCount() > 1) {
							FieldList.stopEditing(true);
							for (var i = listStore.getCount() - 1; i > 0; i--)
								listStore.remove(listStore.getAt(0));
							FieldList.delayedEditMode.delay(100);
						}
						relField.proxy = new Ext.data.HttpProxy({
									url : "/dev/database/table.jcp?object_id="
											+ node.id
											+ "&submitType=columns&pmk=true",
									method : 'GET'
								})
						relField.load();
						relEditor.reset();

					}, this);
			leftItms.push(tableCombo)
		}

		var formContent = [{
					columnWidth : 0.60,
					layout : 'form',
					clear : true,
					border : false,
					items : leftItms
				}, {
					columnWidth : 0.40,
					layout : 'form',
					clear : true,
					border : false,
					items : rightItms
				}];

		constraintForm = new Ext.FormPanel({
			labelWidth : 100,
			labelAlign : 'right',
			region : 'north',
			height : 80,
			url : '/dev/database/constraint.jcp',
			method : 'POST',
			border : false,
			layout : 'column',
			bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;height:250px;background:#FFFFFF;',
			items : formContent
		});
	}
	var fm = Ext.form;
	var Column = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'lname'
			}, {
				name : 'pname'
			}, {
				name : 'data_type'
			}, {
				name : 'length'
			}, {
				name : 'decimal_digits'
			}, {
				name : 'pmk'
			}, {
				name : 'not_null'
			}, {
				name : 'special_set'
			}, {
				name : 'default_value'
			}, {
				name : 'serial'
			}]);
	var relField = new Ext.data.Store({
				proxy : null,
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : 'id'
						}, Column),
				remoteSort : false
			});
	var relEditor = showPlus ? new fm.ComboBox({
				tabIndex : 128,
				allowBlank : !showPlus,
				store : relField,
				valueField : 'id',
				displayField : 'lname',
				triggerAction : 'all',
				clearTrigger : false,
				mode : 'local'
			}) : new fm.Hidden();
	var cm = {columns:[{
		id : 'name',
		header : '表列'.loc(),
		dataIndex : 'item_text',
		width : 200,
		realValueIndex : 'item_id',
		editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
		editor : new fm.ComboBox({
					tabIndex : 129,
					allowBlank : false,
					store : new Ext.data.Store({
								proxy : new Ext.data.HttpProxy({
											url : "/dev/database/table.jcp?object_id="
													+ object_id
													+ "&submitType=columns"
													+ ((type == 'F')
															? "&notNull=true"
															: ""),
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
				})
	}, {
		header : '引用列'.loc(),
		dataIndex : 'link_item_text',
		realValueIndex : 'link_item_id',
		editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
		width : 200,
		hidden : !showPlus,
		editor : relEditor
	}]};

	var listStore = new Ext.data.JsonStore({
				url : "/dev/database/constraintTree.jcp",
				baseParams : {
					object_id : object_id,
					type : type,
					grid : true,
					name : name
				},
				root : 'dataItem',
				fields : ['item_id', 'link_item_id', 'item_text',
						'link_item_text'],
				remoteSort : false
			});
	if (editMode) {
		//cm.unshift(new Ext.grid.RowNumberer());
		listStore.load();
	}
	cm = new Ext.grid.ColumnModel(cm);
	var FieldList = new lib.RowEditorGrid.ListInput({
				viewMode : editMode,
				enableCtrl : !editMode,
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
	var itms = (showPlus || editMode)
			? [constraintForm, FieldList]
			: [FieldList];
	var inp = new Ext.Panel({
				border : false,
				layout : 'border',
				items : itms
			});
	inp.fl = FieldList;
	inp.getJson = function() {
		var storeValue = [];
		if(listStore.getCount()==1){
			Ext.msg("error",'请点击列表左侧绿色的对勾添加约束条件,约束中至少有一个条件'.loc());
			return null;
		}
		var allRecords = listStore.getRange(0);
		for (i = 0; i < allRecords.length - 1; i++)
			storeValue[i] = allRecords[i].data;
		var returnJson = {
			fields : Ext.encode(storeValue),
			type : type
		};
		if (name.length > 1)
			returnJson.constraint_name = name;
		if (showPlus) {
			returnJson.link_table = constraintForm.form
					.findField("application_id").getValue();
		}
		return returnJson;
	}
	var setLinkTableValue = function() {
		var obj = inp.obj;
		var frm = constraintForm.form;
		var tableCombo = frm.findField("application_id");
		tableCombo.setValue("", obj.link_table);
		// tableCombo.fireEvent("select");

	}
	inp.setValue = function() {
		if (constraintForm.rendered)
			setLinkTableValue();
		else
			constraintForm.on("render", setLinkTableValue, this);
	}
	return inp;
}