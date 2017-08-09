

dev.task.TaskPanel = function(frames, params) {
	this.frames = frames;
	var Task = this.frames.get('Task');
	Task.panelKind = "task";
	this.params = params;

	var retFn = function(main) {
		main.setActiveTab("textTask");
		main.setStatusValue(['任务管理'.loc()]);
	}.createCallback(Task.mainPanel)

	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'clear',
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'updatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'delete',
				text : '删除'.loc(),
				icon : '/themes/icon/xp/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'storedProcedure',
				text : '编辑存储过程'.loc(),
				icon : '/themes/icon/all/page_edit.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				cmethod : 1,
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.logic.storedProcedure");
					Task.panelKind = "sql";
					this.params['method'] = 'task';
					var sqlPanel = this.frames
							.createPanel(new dev.logic.storedProcedure(retFn));
					Task.mainPanel.add(sqlPanel.MainTabPanel);
					Task.mainPanel.setActiveTab(sqlPanel.MainTabPanel);
					sqlPanel.loadData(this.params, Task.mainPanel);
				}
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				text : '设定数据服务参数'.loc(),
				icon : '/themes/icon/all/basket_edit.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				cmethod : 4,
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.logic.DataServiceParam");
					this.params.objectId = this.params.parent_id;
					var mp = Task.mainPanel;
					var name = this.taskForm.form.findField("tasklogic_name")
							.getValue();
					var panel = dev.logic.DataServiceParam(this.params, retFn,
							name);
					mp.add(panel);
					mp.setActiveTab(panel);
					mp.setStatusValue(['设定数据服务参数'.loc()]);
					panel.loadData(this.params);
				}
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				text : '设定数据结构'.loc(),
				icon : '/themes/icon/all/basket_go.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				cmethod : 4,
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.logic.DataServiceMapping");
					this.params.objectId = this.params.parent_id;
					var mp = Task.mainPanel;
					Ext.Ajax.request({
								url : '/dev/logic/DataServiceParam.jcp',
								method : 'GET',
								scope : this,
								params : {
									objectId : this.params.objectId
								},
								success : function(response) {
									var ret = Ext.decode(response.responseText);
									if (ret.success) {
										if (typeof(ret.data) == 'object') {
											var p = new dev.logic.DataServiceMapping(
													this.params,
													retFn,
													ret.data.interface_type != "2");
											mp.add(p.MainTabPanel);
											mp.setActiveTab(p.MainTabPanel);
											mp.setStatusValue(['设定数据结构'.loc()]);
											p.loadData(this.params, mp);
										} else {
											Ext.msg("warn", '请先设定数据服务参数'.loc());
										}
									}
								},
								failure : function() {
								}
							});

				}
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'beanShell',
				text : '编辑BeanShell'.loc(),
				icon : '/themes/icon/all/script.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				cmethod : 2,
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.logic.beanshell");
					Task.panelKind = "beanshell";
					this.params['type'] = 'task';
					var beanPanel = this.frames
							.createPanel(new dev.logic.beanshell(retFn));
					Task.mainPanel.add(beanPanel.MainTabPanel);
					Task.mainPanel.setActiveTab(beanPanel.MainTabPanel);
					beanPanel.loadData(this.params, Task.mainPanel);
				}
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'migrate',
				text : '编辑抽取迁移'.loc(),
				icon : '/themes/icon/all/script.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				cmethod : 3,
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.logic.migrate");
					this.params['type'] = 'task';
					Task.panelKind = "migrate";
					var migPanel = this.frames
							.createPanel(new dev.logic.migrate(this.params,
									retFn));
					Task.mainPanel.add(migPanel.MainTabPanel);
					Task.mainPanel.setActiveTab(migPanel.MainTabPanel);
					migPanel.loadData(this.params, Task.mainPanel);
				}
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'notifyTemplate',
				text : '通知模板'.loc(),
				icon : '/themes/icon/all/script.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				cmethod : 6,
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.logic.notifyTemplate");
					this.params['type'] = 'task';
					Task.panelKind = "notifyTemplate";
					var notifyPanel = this.frames
							.createPanel(new dev.logic.notifyTemplate(
									this.params, retFn, 'task'));
					Task.mainPanel.add(notifyPanel.MainTabPanel);
					Task.mainPanel.setActiveTab(notifyPanel.MainTabPanel);
					notifyPanel.loadData(this.params, Task.mainPanel);
				}
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				text : '设定搜索引擎'.loc(),
				icon : '/themes/icon/all/page_find.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				cmethod : 7,
				scope : this,
				hidden : true,
				handler : function() {
					loadcss("lib.multiselect.Multiselect");
					using("lib.multiselect.Multiselect");
					using("dev.logic.searchIndex");
					this.params.type = 'task';
					this.params.returnFunction = retFn;
					this.params.objectId = this.params.parent_id;
					var p = new dev.logic.searchIndex(this.params);
					Task.mainPanel.add(p.MainTabPanel);
					Task.mainPanel.setActiveTab(p.MainTabPanel);
					p.loadData(this.params, Task.mainPanel);
				}
			}));

	var kindStore = new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : [["0", 'Java类'.loc()], ["1", '存储过程'.loc()],
						["2", 'beanshell'], ["3", '抽取迁移'.loc()],
						["4", '数据服务'.loc()], ["6", '消息通知'.loc()],
						["7", '搜索引擎'.loc()], ["8", '网站萃取'.loc()],
						["9", '数据质控'.loc()]]
			});
	var kindCombo = new Ext.form.ComboBox({
				fieldLabel : '任务方法'.loc(),
				store : kindStore,
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				mode : 'local',
				name : 'task_method'
			});
	var javaClassName = new Ext.form.TextField({
				xtype : 'textfield',
				width : 200,
				fieldLabel : 'Java类名'.loc(),
				name : 'class_name',
				itemCls : 'hide-row',
				maxLength : 256,
				allowBlank : false,
				maxLengthText : 'Java类名不能超过{0}个字符!'.loc(),
				blankText : 'Java类名必须提供.'.loc()
			});

	var searchParams = {};
	searchParams['parent_id'] = this.params['parent_id'];
	searchParams['type'] = 'getSearch';

	var scraperParams = {};
	scraperParams['parent_id'] = this.params['parent_id'];
	scraperParams['type'] = 'getScraper';

	var scraperDS = new Ext.data.JsonStore({
				url : '/dev/task/getTask.jcp',
				baseParams : scraperParams,
				root : 'scrapers',
				fields : ["id", "title"]
			});
	var selectScraper = new Ext.form.ComboBox({
				fieldLabel : '网站萃取'.loc(),
				hiddenName : 'scraper_id',
				typeAhead : false,
				width : 180,
				store : scraperDS,
				allowBlank : true,
				triggerAction : 'all',
				displayField : 'title',
				emptyText : '选择网站萃取'.loc(),
				valueField : 'id'
			});

	var qualityParams = {};
	qualityParams['parent_id'] = this.params['parent_id'];
	qualityParams['type'] = 'getQuality';

	var qualityDS = new Ext.data.JsonStore({
				url : '/dev/task/getTask.jcp',
				baseParams : qualityParams,
				root : 'qualitys',
				autoLoad : true,
				fields : ["id", "title"]
			});
	var selectQuality = new Ext.form.ComboBox({
				fieldLabel : '数据质控'.loc(),
				hiddenName : 'quality_id',
				typeAhead : false,
				width : 180,
				store : qualityDS,
				allowBlank : true,
				triggerAction : 'all',
				displayField : 'title',
				emptyText : '选择质控对象'.loc(),
				valueField : 'id'
			})
	kindCombo.on('select', function() {
				var val = kindCombo.getValue();
				javaClassName.setVisible(val == "0");
				javaClassName.allowBlank = (val != "0");

				selectQuality.setVisible(val == "9");
				selectQuality.allowBlank = (val != "9");
				if (val == "9") {
					qualityDS.load({
								params : Ext.apply(this.params, {
											type : 'getQuality'
										})
							});
				}
				selectScraper.setVisible(val == "8");
				selectScraper.allowBlank = (val != "8");
				if (val == "8") {
					scraperDS.load({
								params : Ext.apply(this.params, {
											type : 'getScraper'
										})
							});
				}
			}, this);

	this.taskForm = new Ext.form.FormPanel({
		border : false,
		id : 'textTask',
		cached : true,
		labelWidth : 120,
		bodyStyle : 'padding:20px 0px 0px 50px;height:100%;width:100%;background:#FFFFFF;',
		tbar : ButtonArray,
		items : [
				{
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [{
							xtype : 'textfield',
							width : 200,
							fieldLabel : '任务名称'.loc(),
							name : 'tasklogic_name',
							maxLength : 24,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '名称中不应有'.loc() + '&,<,>,\",'
									+ '字符'.loc(),
							allowBlank : false,
							maxLengthText : '任务名称不能超过{0}个字符!'.loc(),
							blankText : '任务名称必须提供.'.loc()
						}]
					}, {
						columnWidth : 0.50,
						layout : 'form',

						border : false,
						items : [new Ext.form.RadioGroup({
									fieldLabel : '有日志'.loc(),
									scope : this,
									width : 80,
									items : [{
												boxLabel : '是'.loc(),
												name : 'has_log',
												inputValue : true,
												checked : true
											}, {
												boxLabel : '否'.loc(),
												name : 'has_log',
												inputValue : false
											}]
								})]
					}]
				}, kindCombo, javaClassName,/* selectSearchs, */selectScraper,
				selectQuality, {
					xtype : 'textarea',
					width : '500',
					fieldLabel : '备注'.loc(),
					name : 'task_desc',
					maxLength : 500,
					allowBlank : true,
					maxLengthText : this.fieldLabel + '不能超过{0}个字符!'.loc(),
					blankText : this.fieldLabel + '必须提供.'.loc()
				}]
	});

	this.MainTabPanel = this.taskForm;
};

dev.task.TaskPanel.prototype = {
	init : function(params) {
		if (this.MainTabPanel.rendered) {
			this.frames.get("Task").mainPanel.setStatusValue(['任务管理'.loc(),
					params.parent_id, '无'.loc(), '无'.loc()]);
		}
	},
	newTask : function(params) {
		this.params = params;
		var form = this.taskForm.form;
		form.reset();
		form.findField('task_method').enable();
		form.findField('task_method').setValue('0');
		form.findField('task_method').fireEvent("select");
		this.toggleToolBar('create');
	},
	editTask : function(method) {
		this.toggleToolBar('edit', method);
	},
	loadData : function(params) {
		this.params.parent_id = params.parent_id;
		var cself = this;
		this.taskForm.load({
					params : params,
					method : 'GET',
					scope : this,
					url : '/dev/task/create.jcp?parent_id=' + params.parent_id
							+ "&rand=" + Math.random(),
					success : function(form, action) {
						var data = Ext.decode(action.response.responseText).data;
						cself.toggleToolBar('edit', data.task_method);
						form.findField('has_log').setValue(data.has_log);
						var task_method = form.findField('task_method');
						task_method.disable();

						if (data.task_method == "8") {
							var combo = form.findField('scraper_id');
							combo.store.once("load", function() {
										combo.setValue(data[combo.hiddenName]);
									}, this);
						} else if (data.task_method == "9") {
							var combo = form.findField('quality_id');
							combo.store.on("load", function() {
										combo.setValue(data["quality_id"]);
									}, this);
						}
						task_method.fireEvent("select");
						form.findField('class_name').allowBlank = (form
								.findField('task_method').getValue() != "0");
						this.frames.get('Task').mainPanel.setStatusValue([
								'任务管理'.loc(), data.task_id,
								data.lastModifyName, data.lastModifyTime]);
					}
				});
	},
	toggleToolBar : function(state, method) {
		if (!method)
			method = 'empty';
		var tempToolBar = this.taskForm.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					if (item.state == state || item.cmethod == method)
						item.show();
				}, tempToolBar.items);
	},
	onButtonClick : function(item) {
		var Task = this.frames.get('Task');
		var frm = this.taskForm.form;
		Task = this.frames.get('Task');
		if (item.btnId == 'clear') {
			frm.reset();
		} else if (item.btnId == 'save') {
			if (frm.isValid()) {
				var saveParams = this.params;
				saveParams['type'] = 'save';
				saveParams['task_method'] = this.taskForm.form
						.findField('task_method').getValue();
				frm.submit({
							url : '/dev/task/create.jcp',
							params : saveParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								Task.navPanel.getTree().loadSubNode(
										action.result.id,
										Task.navPanel.clickEvent);
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'updatesave') {
			var saveParams = this.params;
			saveParams['type'] = 'updatesave';
			if (frm.isValid()) {
				saveParams['task_method'] = this.taskForm.form
						.findField('task_method').getValue();
				frm.submit({
							url : '/dev/task/create.jcp',
							params : saveParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								Task.navPanel.getTree().loadSelfNode(
										action.result.id,
										Task.navPanel.clickEvent);
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'delete') {
			Ext.msg('confirm', '警告:删除任务将不可恢复,确认吗?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = this.params;
					delParams['type'] = 'delete';
					delParams['parent_id'] = this.params.parent_id;
					frm.submit({
								url : '/dev/task/create.jcp',
								params : delParams,
								method : 'POST',
								scope : this,
								success : function(form, action) {
									Task.navPanel
											.getTree()
											.loadParentNode(Task.navPanel.clickEvent);
								},
								failure : function(form, action) {
									Ext.msg("error", '数据提交失败!,原因:'.loc()
													+ '<br>'
													+ action.result.message);
								}
							});
				}
			}.createDelegate(this));
		}
	}
};
