dev.database.ConstraintPanel = function(object_id, parent_id, frames, retFn) {
	var object_id = object_id;
	this.parent_id = parent_id;
	this.frames = frames;
	var MetaTable = this.frames.get('MetaTable');
	var ButtonArray = [];
	this.params = {};
	MetaTable.mainPanel.setStatusValue(['约束管理'.loc()]);
	ButtonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/common/repeal.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : retFn
			}));
	var saveButton = new Ext.Toolbar.Button({
		text : '保存'.loc(),
		icon : '/themes/icon/xp/save.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : true,
		scope : this,
		hidden : false,
		handler : function() {
			var returnJson = this.inPanel.getJson();
			if (returnJson == null)
				return false;
			returnJson.object_id = object_id;
			if (returnJson.fields == "[]") {
				Ext.msg("error", '数据提交失败,原因:'.loc()+'<br>'+'至少选择一列!'.loc());
				return false;
			}
			var tp = this.CTYPE;
			var cname = this.CNAME;
			Ext.Ajax.request({
				url : '/dev/database/constraint.jcp',
				params : returnJson,
				success : function(response, options) {
					var ajaxResult = Ext.util.JSON
							.decode(response.responseText);
					if (ajaxResult.success) {
						var node = constraintTree.getNodeById(tp);
						constraintTree.getLoader().load(node, function() {
							node.leaf = false;
							node.expand();
							var subNodes = node.childNodes;
							for (var i = 0; i < subNodes.length; i++) {
								if (subNodes[i].id == ajaxResult.constraintName) {
									subNodes[i].select();
									constraintTree.fireEvent("click",
											subNodes[i]);
								}
							}
						});

					} else {
						var node = constraintTree.getNodeById(cname);
						constraintTree.fireEvent("click", node);
						Ext.msg("error", '数据提交失败,原因:'.loc()+'<br>' + ajaxResult.message);
					}
				}
			});
		}
	})
	ButtonArray.push(saveButton);
	var savButton = new Ext.Toolbar.Button({
		text : '保存描述'.loc(),
		icon : '/themes/icon/common/saves.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : true,
		scope : this,
		hidden : false,
		handler : function() {
			var returnJson = this.inPanel.getJson();
			if (returnJson == null)
				return false;
			returnJson.object_id = object_id;
			returnJson.onlyMeta = true;
			if (returnJson.fields == "[]") {
				Ext.msg("error", '数据提交失败,原因:'.loc()+'<br>'+'至少选择一列!'.loc());
				return false;
			}
			var tp = this.CTYPE;
			var cname = this.CNAME;
			Ext.Ajax.request({
				url : '/dev/database/constraint.jcp',
				params : returnJson,
				success : function(response, options) {
					var ajaxResult = Ext.util.JSON
							.decode(response.responseText);
					if (ajaxResult.success) {
						var node = constraintTree.getNodeById(tp);
						constraintTree.getLoader().load(node,function() {
							node.leaf = false;
							node.expand();
							var subNodes = node.childNodes;
							for (var i = 0; i < subNodes.length; i++) {
								if (subNodes[i].id == ajaxResult.constraintName) {
									subNodes[i].select();
									constraintTree.fireEvent("click",
											subNodes[i]);
								}
							}
						});
					} else {
						var node = constraintTree.getNodeById(cname);
						constraintTree.fireEvent("click", node);
						Ext.msg("error", '数据提交失败,原因:'.loc()+'<br>' + ajaxResult.message);
					}
				}
			});
		}
	})
	ButtonArray.push(savButton);
	var delButton = new Ext.Toolbar.Button({
		text : '删除'.loc(),
		icon : '/themes/icon/xp/delete.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		state : 'create',
		scope : this,
		hidden : true,
		handler : function() {
			var tp = this.CTYPE;
			Ext.Ajax.request({
				url : '/dev/database/constraint.jcp?type=' + tp + '&object_id='
						+ object_id + '&constraint_name=' + this.CNAME + '&'
						+ Math.random(),
				method : 'get',
				scope : this,
				callback : function(options, success, response) {
					try {
						var node = constraintTree.getNodeById(this.CNAME).parentNode;
						constraintTree.getLoader().load(node);
						node.leaf = true;
						node.expanded = false;
						constraintTree.fireEvent("click", node);
					} catch (e) {
					}
				}
			});
		}
	});
	ButtonArray.push(delButton);

	var delDescButton = new Ext.Toolbar.Button({
		text : '删除描述'.loc(),
		icon : '/themes/icon/all/table_delete.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		state : 'create',
		scope : this,
		hidden : true,
		handler : function() {
			var tp = this.CTYPE;
			Ext.Ajax.request({
				url : '/dev/database/constraint.jcp?type=' + tp
						+ '&onlyMeta=true&object_id=' + object_id
						+ '&constraint_name=' + this.CNAME + '&'
						+ Math.random(),
				method : 'get',
				scope : this,
				callback : function(options, success, response) {
					try {
						var node = constraintTree.getNodeById(this.CNAME).parentNode;
						constraintTree.getLoader().load(node);
						node.leaf = true;
						node.expanded = false;
						constraintTree.fireEvent("click", node);
					} catch (e) {
					}
				}
			});
		}
	});
	ButtonArray.push(delDescButton);

	var constraintTree = new Ext.tree.TreePanel({
				lines : false,
				animate : true,
				autoScroll : true,
				draggable : false,
				region : 'west',
				style : 'padding:0px 0px 0px 0px;',
				bodyStyle : 'padding:5px 0px 0px 5px;',
				width : 200,
				containerScroll : true,
				root : new Ext.tree.AsyncTreeNode({
							text : '所有约束'.loc(),
							draggable : false,
							expanded : true,
							id : '0',
							icon : "/themes/icon/all/plugin.gif"
						}),
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/dev/database/constraintTree.jcp?',
							requestMethod : "GET",
							baseParams : {
								object_id : object_id
							}
						})
			})
	this.inPanel = new dev.database.ConstraintColumnPanel('P', 0, object_id);
	var formPanel = new Ext.Panel({
				layout : 'fit',
				region : 'center',
				style : 'padding:0px 0px 0px 0px;',
				wdith : 400,
				border : false,
				labelWidth:150,
				items : this.inPanel
			});
	constraintTree.on("click", function(node, e) {
		if (node.id == '0')
			return;
		var type = node.attributes.type;
		this.CTYPE = type;
		this.CNAME = node.id;

		delDescButton.setVisible(node.id.length > 1);
		delButton.setVisible(node.id.length > 1);
		saveButton.setVisible(node.id.length < 2);
		savButton.setVisible(node.id.length < 2);

		if (type == 'P') {
			if (!node.isLeaf()) {
				if (!node.isExpanded()) {
					var fuc = function(node) {
						constraintTree.fireEvent("click", node.firstChild, e);
						node.un("expand", fuc, constraintTree);
					}
					node.on("expand", fuc, constraintTree);
					node.expand();
				} else {
					constraintTree.fireEvent("click", node.firstChild, e);
				}
				return;
			} else {
				savButton.setDisabled(false);
				saveButton.setDisabled(false);
			}
		} else if (type == 'F' || type == 'R') {
			savButton.setDisabled(false);
			saveButton.setDisabled(false);
			if (node.id.length > 1) {
				Ext.Ajax.request({
							url : '/dev/database/getConstraintName.jcp',
							params : {
								constraint_name : node.id,
								object_id : object_id
							},
							callback : function(ops, success, response) {
								if (response.responseText.length > 1) {
									var obj = Ext.decode(response.responseText);
									this.inPanel.obj = obj;
									this.inPanel.setValue();
								}
							},
							scope : this
						});
			}
		} else {
			savButton.setDisabled(false);
			saveButton.setDisabled(false);
		}
		formPanel.remove(this.inPanel);
		try {
			this.inPanel.destroy();
		} catch (e) {
		}
		this.inPanel = new dev.database.ConstraintColumnPanel(type, node.id,
				object_id);
		formPanel.add(this.inPanel);
		formPanel.doLayout();
	}, this)
	this.MainTabPanel = new Ext.Panel({
				id : 'dev.database.ConstraintPanel',
				// title : '约束管理',
				tbar : ButtonArray,
				layout : 'border',
				border : false,
				items : [constraintTree, formPanel]
			});
};
