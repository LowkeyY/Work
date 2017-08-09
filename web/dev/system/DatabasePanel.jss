dev.system.DatabasePanel = function(frames, params) {

	this.frames = frames;
	var System = this.frames.get("System");
	var ButtonArray = [];
	this.params = params;

	this.formDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/dev/system/databasecreate.jcp',
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({}, ["object_id",
								"logic_name", "dblink_name", "link_type",
								"db_type", "url", "username", "passwd", "note",
								"lastModifyTime", "lastModifyName"]),
				remoteSort : false
			});

	this.linkTypeDs = new Ext.data.SimpleStore({
				fields : ['typeId', 'typeValue'],
				data : [['0', '静态'.loc()], ['1', '动态'.loc()]]
			});

	this.dbTypeDs = new Ext.data.SimpleStore({
				fields : ['dbtypeId', 'dbtypeValue'],
				data : [['0', 'Oracle'], ['1', 'Mysql'], ['2', 'SqlServer'],
						['3', 'PostGres']]
			});

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'databaseBack',
				text : '返回'.loc(),
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				hidden : true,
				scope : this,
				handler : this.params.retFn
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'databaseSave',
				text : '保存'.loc(),
				state : 'create',
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : false,
				scope : this,
				handler : this.onButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'databaseClear',
				text : '清空'.loc(),
				state : 'create',
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'databaseUpdatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'databaseDelete',
				text : '删除'.loc(),
				icon : '/themes/icon/common/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));

	this.systemForm = new Ext.FormPanel({
		labelWidth : 100,
		labelAlign : 'right',
		id : 'systemDatabase',
		cached : true,
		url : '/dev/system/databasecreate.jcp',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 0.40,
				layout : 'form',
				border : false,
				items : new Ext.form.TextField({
							fieldLabel : '逻辑名称'.loc(),
							name : 'logic_name',
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '数据链逻辑名称中不应有'.loc() + '&,<,>,\",'
									+ '字符'.loc(),
							width : 150,
							maxLength : 50,
							allowBlank : false,
							maxLengthText : '数据链逻辑名称不能超过{0}个字符!'.loc(),
							blankText : '数据链逻辑名称必须提供.'.loc()
						})
			}, {
				columnWidth : 0.60,
				layout : 'form',

				border : false,
				items : new Ext.form.TextField({
							fieldLabel : '连接名称'.loc(),
							name : 'dblink_name',
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '数据库链名称中不应有'.loc() + '&,<,>,\",'
									+ '字符'.loc(),
							width : 150,
							maxLength : 50,
							allowBlank : false,
							maxLengthText : '数据库链名称不能超过{0}个字符!'.loc(),
							blankText : '数据库链名称必须提供.'.loc()
						})
			}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.40,
						layout : 'form',

						border : false,
						items : [new Ext.form.ComboBox({
									fieldLabel : '链接类型'.loc(),
									lazyRender : true,
									name : 'link_type',
									minLength : 1,
									allowBlank : false,
									store : this.linkTypeDs,
									valueField : 'typeId',
									displayField : 'typeValue',
									triggerAction : 'all',
									mode : 'local'
								})]
					}, {
						columnWidth : 0.60,
						layout : 'form',

						border : false,
						items : [new Ext.form.ComboBox({
									fieldLabel : '数据库类型'.loc(),
									lazyRender : true,
									name : 'db_type',
									minLength : 1,
									allowBlank : false,
									store : this.dbTypeDs,
									valueField : 'dbtypeId',
									displayField : 'dbtypeValue',
									triggerAction : 'all',
									mode : 'local'
								})]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 0.40,
				layout : 'form',

				border : false,
				items : [new Ext.form.TextField({
							fieldLabel : '用户名'.loc(),
							name : 'username',
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '用户名中不应有'.loc() + '&,<,>,,\",'
									+ '字符'.loc(),
							width : 150,
							maxLength : 50,
							allowBlank : false,
							maxLengthText : '用户名不能超过{0}个字符!'.loc(),
							blankText : '用户名必须提供.'.loc()
						})]
			}, {
				columnWidth : 0.60,
				layout : 'form',

				border : false,
				items : [new Ext.form.TextField({
							fieldLabel : '密码'.loc(),
							name : 'passwd',
							inputType : 'password',
							width : 150,
							maxLength : 20,
							allowBlank : false,
							maxLengthText : '密码不能超过{0}个字符!'.loc(),
							blankText : '密码必须提供.'.loc()
						})]
			}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 1.0,
						layout : 'form',

						border : false,
						items : [new Ext.form.TextArea({
									fieldLabel : '链接地址'.loc(),
									name : 'url',
									width : 550,
									height : 60,
									allowBlank : false,
									maxLength : 255,
									maxLengthText : '链接地址不能超过{0}个字符!'.loc(),
									blankText : '链接地址必须提供.'.loc()
								})]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 1.0,
						layout : 'form',
						border : false,
						items : [new Ext.form.TextArea({
									fieldLabel : '说明'.loc(),
									name : 'note',
									allowBlank : true,
									width : 550,
									height : 60,
									maxLength : 255,
									maxLengthText : '说明不能超过{0}个字符!'.loc(),
									blankText : '说明必须提供.'.loc()
								})]
					}]
		}],
		tbar : ButtonArray
	});
	this.MainTabPanel = this.systemForm;
};

dev.system.DatabasePanel.prototype = {
	formCreate : function(params) {
		this.params = params;
		if (this.MainTabPanel.rendered) {
			this.toggleToolBar('create');
			this.frames.get("System").mainPanel
					.setStatusValue(['数据库链接管理'.loc()]);
		}
	},
	formEdit : function() {
		this.toggleToolBar('edit');
	},
	loadData : function(params) {
		this.params = params;
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({
					params : {
						start : 0,
						limit : 1
					}
				});
	},
	toggleToolBar : function(state) {
		var tempToolBar = this.systemForm.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					if (item.state == state)
						item.show();
				}, tempToolBar.items);
	},
	showCreateDatabaseDialog : function(form) {
		var form = new Ext.FormPanel({
					labelWidth : 100,
					labelAlign : 'right',
					url : '/dev/system/databasecreate.jcp',
					method : 'POST',
					border : false,
					bodyStyle : 'padding:20px 0px 0px 0px;background:#FFFFFF;',
					defaultType : 'textfield',
					items : [{
								fieldLabel : '用户名',
								width : 160,
								name : 'rootName'
							}, {
								inputType : 'password',
								width : 160,
								fieldLabel : '密码',
								name : 'rootPass'
							}]

				})
		this.win = new Ext.Window({
			title : '请录入具有创建数据库权限的用户名和密码'.loc(),
			width : 350,
			height : 160,
			scope : this,
			modal : true,
			items : form,
			buttons : [{
				text : '创建'.loc(),
				scope : this,
				form : form,
				handler : function(btn) {
					var fm = this.systemForm.form;
					Ext.Ajax.request({
								url : '/dev/system/databasecreate.jcp',
								params : {
									type : "createschema",
									db_type : fm.findField('db_type')
											.getValue(),
									url : fm.findField('url').getValue(),
									passwd : fm.findField('passwd').getValue(),
									username : fm.findField('username')
											.getValue(),
									rootPass : btn.form.form
											.findField('rootPass').getValue(),
									rootName : btn.form.form
											.findField('rootName').getValue()
								},
								method : 'POST',
								scope : this,
								callback : function(options, success, response) {
									if (success) {
										var json = Ext
												.decode(response.responseText);
										if (!json.success) {
											Ext.msg("warn", "建立失败,原因:"
															+ json.message);
											return;
										}
										Ext.msg("info", "建立成功!");

										this.win.close();
									}
								}
							});
				}
			}, {
				text : '取消'.loc(),
				scope : this,
				handler : function() {
					this.win.close();
				}
			}]
		});
		this.win.show();
	},
	renderForm : function() {
		this.systemForm.form.reset();
		var frm = this.systemForm.form;
		var dss = this.formDS.getAt(0).data;
		frm.findField('logic_name').setValue(dss.logic_name);
		frm.findField('dblink_name').setValue(dss.dblink_name);
		frm.findField('link_type').setValue(dss.link_type);
		frm.findField('db_type').setValue(dss.db_type);
		frm.findField('url').setValue(dss.url);
		frm.findField('username').setValue(dss.username);
		frm.findField('passwd').setValue(dss.passwd);
		frm.findField('note').setValue(dss.note);
		this.frames.get('System').mainPanel.setStatusValue(['数据库连接管理'.loc(),
				dss.object_id, dss.lastModifyName, dss.lastModifyTime]);
	},
	onButtonClick : function(item) {
		var System = this.frames.get("System");
		var frm = this.systemForm.form;
		if (item.btnId == 'databaseSave') {
			var saveParams = this.params;
			saveParams['type'] = 'save';
			saveParams['link_type'] = this.systemForm.form
					.findField('link_type').getValue();
			saveParams['db_type'] = this.systemForm.form.findField('db_type')
					.getValue();
			if (frm.isValid()) {
				frm.submit({
					url : '/dev/system/databasecreate.jcp',
					params : saveParams,
					method : 'post',
					scope : this,
					success : function(form, action) {
						if (action.result.testResult === false) {
							Ext.msg('confirm', "您所建立的数据库连接在服务器上不存在,是否创建该数据库?"
											.loc(), function(answer) {
										if (answer == 'yes') {
											this.showCreateDatabaseDialog(form);
										}
									}.createDelegate(this));
						} else {
							System.navPanel.getTree().loadSubNode(
									action.result.id,
									System.navPanel.clickEvent);
						}
					},
					failure : function(form, action) {
						Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
										+ action.result.message);
					}
				});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'databaseClear') {
			this.systemForm.form.reset();
		} else if (item.btnId == 'databaseDelete') {
			Ext.msg('confirm', '警告:删除将导致您的数据不可恢复,确认吗?'.loc(), function(answer) {
				if (answer == 'yes') {
					Ext.msg('confirm', '请再次确认是否删除数据库链接?'.loc(),
							function(answer) {
								if (answer == 'yes') {
									var delParams = this.params;
									delParams['type'] = 'delete';
									frm.submit({
										url : '/dev/system/databasecreate.jcp',
										params : delParams,
										method : 'post',
										scope : this,
										success : function(form, action) {
											System.navPanel
													.getTree()
													.loadParentNode(System.navPanel.clickEvent);
										},
										failure : function(form, action) {
											Ext
													.msg(
															"error",
															'数据提交失败,原因:'.loc()
																	+ '<br>'
																	+ action.result.message);
										}
									});
								}
							}.createDelegate(this));
				}
			}.createDelegate(this), this);
		} else if (item.btnId == 'databaseUpdatesave') {
			if (frm.isValid()) {
				var updateParams = this.params;
				updateParams['type'] = 'updatesave';
				updateParams['link_type'] = this.systemForm.form
						.findField('link_type').getValue();
				updateParams['db_type'] = this.systemForm.form
						.findField('db_type').getValue();
				frm.submit({
					url : '/dev/system/databasecreate.jcp',
					params : updateParams,
					method : 'post',
					scope : this,
					success : function(form, action) {
						if (action.result.testResult === false) {
							Ext.msg('confirm', "您所建立的数据库连接在服务器上不存在,是否创建该数据库?"
											.loc(), function(answer) {
										if (answer == 'yes') {
											this.showCreateDatabaseDialog(form);
										}
									}.createDelegate(this));
						} else {
							System.navPanel.getTree().loadSelfNode(
									action.result.id,
									System.navPanel.clickEvent);
						}
					},
					failure : function(form, action) {
						Ext.msg("error", '数据提交失败,原因:'.loc() + '<br>'
										+ action.result.message);
					}
				});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		}
	}
}