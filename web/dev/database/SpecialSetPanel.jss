dev.database.SpecialSetPanel = function(cfg, type, objectId) {
	var pre = "L" + type + "_";;
	var content = [];
	var height = 150;
	var width = 300;
	if (type == '1') {// 字典
		if (!cfg.option_id)
			cfg.option_id = 0;
		height = 120;
		width = 400;
		var loader = new Ext.tree.TreeLoader({
					dataUrl : '/dev/database/dictTree.jcp?',
					requestMethod : "GET",
					baseParams : {}
				})
		loader.on("beforeload", function(treeLoader, node) {
					this.baseParams.level = node.attributes.level;
				}, loader);
		var dictCombo = new lib.ComboTree.ComboTree({
					fieldLabel : '所有字典'.loc(),
					id : pre + 'option_id',
					width : 200,
					queryParam : "type",
					mode : 'remot',
					root : new Ext.tree.AsyncTreeNode({
								text : '所有选项'.loc(),
								draggable : false,
								id : '0',
								level : 0,
								icon : "/themes/icon/all/plugin.gif"
							}),
					loader : loader
				});
		Ext.Ajax.request({
					url : '/dev/database/dictTree.jcp?',
					method : 'post',
					params : {
						node : cfg.option_id
					},
					callback : function(options, success, response) {
						if (response.responseText.length > 12) {
							var o = Ext.decode(response.responseText);
							dictCombo.setValue(o.id, o.name);
						}
					}
				});
		content.push(dictCombo);
	} else if (type == 'AutoIncrease') {// 自增
		content.push({
					fieldLabel : '起始值'.loc(),
					id : pre + 'start',
					value : cfg.start
				}, {
					fieldLabel : '自增量'.loc(),
					id : pre + 'step',
					value : cfg.step
				});
	} else if (type == '25') {// 应用集成
		using("lib.ComboRemote.ComboRemote");
		content.push({
					xtype : 'comboremote',
					root:'items',
					store : new Ext.data.JsonStore({
								root : 'datas',
								fields : ["text", "value"],
								url : '/dev/database/SpecialSetPanel.jcp',
								autoLoad : true,
								baseParams : {
									type : 'integrateId',
									objectId : objectId
								}
							}),
					fieldLabel : '选择应用集成'.loc(),
					id : pre + 'INTEGRATE_ID',
					value : cfg.INTEGRATE_ID,
					width : 150,
					valueField : 'value',
					displayField : 'text',
					triggerAction : 'all'
				});
	}
	var mPanel = new Ext.form.FormPanel({
		method : 'post',
		labelWidth : 100,
		labelAlign : 'right',
		region : 'center',
		height : 250,
		method : 'POST',
		border : false,
		defaultType : 'textfield',
		bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;height:250px;background:#FFFFFF;',
		items : content
	});
	var saveButtonClick = function() {
		var frm = mPanel.form;
		if (frm.isValid()) {
			var fm = mPanel.form;
			var field;
			for (var i in cfg) {
				field = fm.findField(pre + i);
				if (field)
					cfg[i] = field.getValue();
			}
			win.close();
		} else {
			Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
		}
	}
	var win = new Ext.Window({
				title : '特殊选项参数设置'.loc(),
				layout : 'fit',
				width : width,
				height : height,
				plain : true,
				modal : true,
				resizable : false,
				items : [mPanel],
				buttons : [{
							text : '保存'.loc(),
							scope : this,
							handler : saveButtonClick
						}, {
							text : '取消'.loc(),
							scope : this,
							handler : function() {
								win.close()
							}
						}]
			});
	return win;
};
