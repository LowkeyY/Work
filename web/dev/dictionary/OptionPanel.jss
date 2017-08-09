Ext.namespace("dev", "dev.dictionary");
dev.dictionary.OptionPanel = function() {

	var ButtonArray = [];
	this.editingFlag = false;

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : false,
				scope : this,
				state : 'create',
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'clear',
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				state : 'create',
				hidden : false,
				handler : this.onButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'updatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				state : 'edit',
				hidden : true,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'delete',
				text : '删除'.loc(),
				icon : '/themes/icon/common/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				state : 'edit',
				hidden : true,
				handler : this.onButtonClick
			}));

	ButtonArray.push(
		'->'
	)
	
	ButtonArray.push(
		new Ext.Toolbar.Button({
			btnId:"Help",
			scope: this,
			disabled : false,
			text:"帮助".loc(),
			icon : '/themes/icon/all/help.gif',
			cls : 'x-btn-text-icon  bmenu',
			hidden : false,
			handler:function(){
				var btn =new Ext.Window({
					title:"帮助文档",
					layout:'fit',
					width:700,	//600
					height:800, //800
					html:"<iframe src='http://localhost:8090/dev/dictionary/Help_contents/help.html' style='width:100%; height:100%;'></iframe>"
				})
				btn.show();
			}
	}));

	this.dictOptionForm = new Ext.FormPanel({
		labelWidth :80,
		labelAlign : 'right',
		url : '/dev/dictionary/option.jcp',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextField({
											fieldLabel : '名称'.loc(),
											name : 'option_name',
											width : 120,
											maxLength : 50,
											allowBlank : false,
											regex : /^[^\<\>\'\"\&]+$/,
											regexText : '名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),
											blankText : '名称必须提供.'.loc(),
											maxLengthText : '名称不能超过{0}个字符!'.loc()
										})]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 1.0,
						layout : 'form',
						border : false,
						items : [new Ext.form.ComboBox({
									fieldLabel : '字典类型'.loc(),
									store : new Ext.data.SimpleStore({
												fields : ["text", "value"],
												data : [['常规单级字典'.loc(), '1'],
														['值长度递增多级字典'.loc(), '2'],
														['等长值两级字典'.loc(), '3']]
											}),
									hiddenName : 'dict_type',
									width : 150,
									valueField : 'value',
									value : '1',
									displayField : 'text',
									triggerAction : 'all',
									listeners : {
										scope : this,
										select : function(obj, rec, index) {

										}
									},
									mode : 'local',
									autoLoad : false
								})]
					}]
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextField({
											fieldLabel : '长度'.loc(),
											name : 'value_length',
											width : 120,
											maxLength : 50,
											allowBlank : true,
											regex : /^\d*(,\d+)*$/,
											regexText : '长度必须是数字或当字典为多级字典时长度为逗号分隔的数字'.loc(),
											maxLengthText : '长度不能超过{0}个字符!'.loc()
										})]
							}]
				}]
	});
	this.formDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/dev/dictionary/option.jcp',
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({}, ["option_name",
								"dict_type", "value_length", "option_id",
								"typeList"]),
				remoteSort : false
			});
	// ------------------------选项---------------------------------------

	var fm = Ext.form;

	var checkColumn = new Ext.grid.CheckColumn({
				header : '可用?'.loc(),
				dataIndex : 'allow_used',
				width : 120,
				resizable : false,
				sortable : false
			});

	var checkColumn1 = new Ext.grid.oneCheckColumn({
				header : '缺省值?'.loc(),
				dataIndex : 'is_default',
				width : 120,
				resizable : false,
				sortable : false
			});

	this.optionIndex = new fm.TextField({
				allowBlank : false
			});
	this.optionName = new fm.TextField({
				allowBlank : false
			});
	var completeColumn = new CompleteColumn();
	this.cm = new Ext.grid.ColumnModel([completeColumn, {
				id : 'index_id',
				header : '序号'.loc(),
				dataIndex : 'index_id',
				width : 150,
				resizable : false,
				editor : this.optionIndex
			}, {
				header : '名称'.loc(),
				dataIndex : 'option_value',
				width : 180,
				resizable : false,
				editor : this.optionName
			}, {
				header : '键值'.loc(),
				dataIndex : 'option_code',
				width : 150,
				resizable : false,
				editor : this.optionCode = new fm.TextField({
							allowBlank : false
						})
			}, checkColumn1, checkColumn]);
	this.cm.defaultSortable = false;
	var headerTpl = new Ext.Template(
			'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
			'<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
			'<tbody><tr class="new-option-row">',
			'<td><div id="new-option-icon" ></div></td>',
			'<td class="x-small-editor" id="new-option-index" align="center"></td>',
			'<td class="x-small-editor" id="new-option-title" align="center"></td>',
			'<td class="x-small-editor" id="new-option-value"  align="center"></td>',
			'<td class="x-small-editor" id="new-option-default"  align="center"></td>',
			'<td class="x-small-editor" id="new-option-valid"  align="center"></td>',
			'</tr></tbody>', "</table>");

	this.Option = Ext.data.Record.create([{
				name : 'index_id'
			}, {
				name : 'option_code'
			}, {
				name : 'option_value'
			}, {
				name : 'is_default'
			}, {
				name : 'allow_used',
				type : 'boolean'
			}]);
	this.ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/dev/dictionary/soption.jcp",
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : 'index_id'
						}, this.Option),
				remoteSort : true
			});
	this.ds.setDefaultSort('index_id', 'asc');

	this.OptionPropPanel = new Ext.grid.EditorGridPanel({
				title : '选项窗口'.loc(),
				region : 'east',
				autoScroll : true,
				width : 700,
				minSize : 180,
				border : true,
				collapsible : false,
				split : true,
				ds : this.ds,
				cm : this.cm,
				sm : new Ext.grid.RowSelectionModel(),
				autoExpandColumn : 'common',
				bodyStyle : 'height:100%;width:100%;',
				frame : false,
				plugins : [completeColumn, checkColumn, checkColumn1],
				clicksToEdit : 1,
				enableColumnHide : false,
				enableColumnMove : false,
				enableHdMenu : false,
				view : this.edtorView = new Ext.grid.GridView({
							forceFit : true,
							onDataChange : function() {
								this.refresh();
								this.updateHeaderSortState();
								this.syncFocusEl(0);
							},
							ignoreAdd : true,
							emptyText : '未设定字典项'.loc(),
							templates : {
								header : headerTpl
							}
						})
			});
	this.OptionPropPanel.on('render', function() {
				this.initGrid();
			}, this);
	this.OptionPropPanel.on('afteredit', function(e) {
				if (this.editingFlag) {
					var code = e.record.get('option_code');
					var value = e.record.get('option_value');
					var index = e.record.get('index_id');
					var selectIndex = e.row;
					var valid = true;
					if (value && code && index) {
						for (var i = 0; i < this.ds.data.length; i++) {
							if (i != selectIndex
									&& index == this.ds.getAt(i).data.index_id) {
								valid = false
								Ext.msg("error", '不能进行字典项更新!,原因:'.loc()+'<br>'+'字典键值不能重复'.loc());
								break;
							}
						}
						for (var i = 0; i < this.ds.data.length; i++) {
							if (i != selectIndex
									&& code == this.ds.getAt(i).data.option_code) {
								valid = false;
								Ext.msg("error", '不能进行字典项更新!,原因:'.loc()+'<br>'+'字典键值不能重复'.loc());
								break;
							}
						}
					}
					if (valid) {
						var rec = e.record;
						var updateParams = {
							type : 'updatesave',
							index_id : (rec.isModified('index_id'))
									? e.originalValue
									: rec.get('index_id'),
							new_index : rec.get('index_id'),
							option_code : code,
							option_value : value,
							is_default : rec.get('is_default'),
							allow_used : rec.get('allow_used'),
							kind_id : this.formDS.baseParams['kind_id'],
							option_id : this.formDS.baseParams['option_id']
						};

						Ext.Ajax.request({
									url : '/dev/dictionary/soption.jcp',
									params : updateParams,
									method : 'post',
									scope : this,
									success : function(response, options) {
										var check = response.responseText;
										var ajaxResult = Ext.util.JSON
												.decode(check)
										if (!ajaxResult.success) {
											Ext
													.msg(
															"error",
															'字典项更新!,原因:'.loc()+'<br>'
																	+ ajaxResult.message);
										}
									}
								});
					}
				}
			}, this);

	// ----------------------选项Panel结束--------------------------------------------------

	this.OptionMainPanel = new Ext.Panel({
				region : 'center',
				autoScroll : false,
				border : false,
				items : [this.dictOptionForm]
			});
	this.OptionMain = new Ext.Panel({
				closable : false,
				layout : 'border',
				id : 'optionPanel',
				cached : false,
				region : 'center',
				border : false,
				bodyStyle : 'padding:0px 0px 0px 0px;height:100%;width:100%;',
				tbar : this.ReportButtonArray,
				items : [this.OptionMainPanel, this.OptionPropPanel],
				tbar : ButtonArray
			});
	this.MainTabPanel = this.OptionMain;
};

dev.dictionary.OptionPanel.prototype = {
	initGrid : function() {
		var optionIndex = new Ext.form.TextField({
					width : 90,
					renderTo : 'new-option-index'
				});
		var optionTitle = new Ext.form.TextField({
					width : 110,
					renderTo : 'new-option-title'
				});
		var optionCode = new Ext.form.TextField({
					width : 90,
					renderTo : 'new-option-value'
				});
		var optionDefault = new Ext.form.Checkbox({
					renderTo : 'new-option-default',
					checked : false
				});
		var optionValid = new Ext.form.Checkbox({
					renderTo : 'new-option-valid',
					checked : true
				});
		var cm1 = this.OptionPropPanel.getColumnModel();
		var addIcon = Ext.get('new-option-icon');
		addIcon.addListener('click', function() {
			var valid = true;
			if (optionIndex.getValue() && optionTitle.getValue()
					&& optionCode.getValue()) {
				for (var i = 0; i < this.ds.data.length; i++) {
					if (optionCode.getValue() == this.ds.getAt(i).data.option_code) {
						valid = false;
						Ext.msg("error", '不能进行字典项更新!,原因:'.loc()+'<br>'+'字典键值不能重复'.loc());
						break;
					}
				}
				for (var i = 0; i < this.ds.data.length; i++) {
					if (optionIndex.getValue() == this.ds.getAt(i).data.index_id) {
						valid = false;
						Ext.msg("error", '不能进行字典项更新!,原因:'.loc()+'<br>'+'字典顺序号不能重复'.loc());
						break;
					}
				}
			} else {
				valid = false;
				Ext.msg("error", '不能进行字典项更新!,原因:'.loc()+'<br>'+'字典项,字典键值,顺序号不能为空'.loc());
			}
			if (valid) {
				if (this.editingFlag) {
					var saveParams = {};
					saveParams['type'] = 'save';
					saveParams['index_id'] = optionIndex.getValue();
					saveParams['option_value'] = optionTitle.getValue();
					saveParams['kind_id'] = this.formDS.baseParams['kind_id'];
					saveParams['option_id'] = this.formDS.baseParams['option_id'];
					saveParams['option_code'] = optionCode.getValue();
					saveParams['is_default'] = optionDefault.getValue();
					saveParams['allow_used'] = optionValid.getValue();
					Ext.Ajax.request({
								url : '/dev/dictionary/soption.jcp',
								params : saveParams,
								method : 'post',
								scope : this,
								success : function(response, options) {
									var check = response.responseText;
									var ajaxResult = Ext.util.JSON
											.decode(check)
									if (!ajaxResult.success) {
										Ext.msg("error", '字典项更新!,原因:'.loc()+'<br>'
														+ ajaxResult.message);
									} else {
										optionIndex.setValue(this.ds.getCount()
												* 10 + 10);
										optionTitle.setValue('');
										optionCode.setValue('');
										optionDefault.setValue('false');
										optionValid.setValue('true');
										this.ds.baseParams = this.formDS.baseParams;
										this.ds.load({
													params : {
														start : 0,
														limit : 0
													}
												});
									}
								}
							});
				} else {
					this.ds.add(new this.Option({
								index_id : optionIndex.getValue(),
								option_value : optionTitle.getValue(),
								option_code : optionCode.getValue(),
								is_default : optionDefault.getValue(),
								allow_used : optionValid.getValue()
							}));
					optionIndex.setValue(this.ds.getCount() * 10 + 10);
					optionTitle.setValue('');
					optionCode.setValue('');
					optionDefault.setValue('false');
					optionValid.setValue('true');
				}
			}
		}, this);
		this.OptionPropPanel.resetEditor = function() {
			optionIndex.setValue(this.ds.getCount() * 10 + 10);
			optionTitle.setValue('');
			optionCode.setValue('');
			optionDefault.setValue('false');
			optionValid.setValue('true');
		}.createDelegate(this)
	},
	init : function(params) {
		this.params = params;
		if (this.MainTabPanel.rendered) {
			this.toggleToolBar('create');
			this.dictOptionForm.form.reset();
			this.editingFlag = false;
			this.OptionPropPanel.editingFlag = false;
			this.ds.removeAll();
			this.OptionPropPanel.resetEditor();
			this.frames.get("Dictionary").mainPanel.setStatusValue(['字典管理'.loc()]);
		}
	},
	formEdit : function() {
		this.toggleToolBar('edit');
		this.editingFlag = true;
		this.OptionPropPanel.editingFlag = true;
	},
	loadData : function(params) {
		this.formDS.baseParams = params;
		this.formDS.baseParams['type'] = 'edit';
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({
					params : {
						start : 0,
						limit : 1
					}
				});
		this.ds.baseParams = params;
		this.ds.load({
					params : {
						start : 0,
						limit : 0
					}
				});
		/*
		 * this.OptionPropPanel.resetEditor();
		 */
	},
	toggleToolBar : function(state) {
		var tempToolBar = this.OptionMain.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					item.enable();
					if (item.state == state)
						item.show();
				}, tempToolBar.items);
	},
	disableToolBar : function(state) {
		var tempToolBar = this.OptionMain.getTopToolbar();
		tempToolBar.items.each(function(item) {
					if (item.btnId !="bangzhu") {
						item.disable();
					}
				}, tempToolBar.items);
	},
	renderForm : function() {
		var frm = this.dictOptionForm.form;
		var dss = this.formDS.getAt(0).data;
		frm.findField('option_name').setValue(dss.option_name);
		frm.findField('value_length').setValue(dss.value_length);
		frm.findField('dict_type').setValue(dss.dict_type);
		this.frames.get("Dictionary").mainPanel.setStatusValue(['字典管理'.loc(),
				dss.option_id]);
	},
	onButtonClick : function(item) {
		var frm = this.dictOptionForm.form;
		var Dictionary = this.frames.get('Dictionary');
		if (item.btnId == 'save') {
			var saveParams = this.frames.get('params');
			saveParams['type'] = 'save';

			if (this.ds.data.length == 0) {
				Ext.msg("error", '不能进行字典设定!,必须至少设定一个字典项'.loc());
				return;
			}
			var indexValueArray = new Array();
			var optionValueArray = new Array();
			var optionCodeArray = new Array();
			var isDefaultArray = new Array();
			var allowUsedArray = new Array();

			this.ds.each(function(rec) {
						indexValueArray.push(rec.get("index_id"));
						optionValueArray.push(rec.get("option_value"));
						optionCodeArray.push(rec.get("option_code"));
						isDefaultArray.push(rec.get("is_default"));
						allowUsedArray.push(rec.get("allow_used"));
					});

			saveParams['index_id'] = indexValueArray;
			saveParams['option_value'] = optionValueArray;
			saveParams['option_code'] = optionCodeArray;
			saveParams['is_default'] = isDefaultArray;
			saveParams['allow_used'] = allowUsedArray;

			if (frm.isValid()) {
				frm.submit({
							url : '/dev/dictionary/option.jcp',
							params : saveParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								var editParams = {};
								editParams['type'] = 'edit';
								editParams['option_id'] = action.result.option_id;
								Dictionary.navPanel.getTree().loadSubNode(
										action.result.option_id,
										Dictionary.navPanel.clickEvent);
								Ext.msg('info', '数据保存成功!'.loc());
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc()+'<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'clear') {
			this.dictOptionForm.form.reset();
		} else if (item.btnId == 'delete') {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = this.formDS.baseParams;
					delParams['type'] = 'delete';
					this.dictOptionForm.form.submit({
						url : '/dev/dictionary/option.jcp',
						params : delParams,
						method : 'post',
						scope : this,
						success : function(form, action) {
							Dictionary.navPanel
									.getTree()
									.loadParentNode(Dictionary.navPanel.clickEvent);
						},
						failure : function(form, action) {
							Ext.msg("error", '数据删除失败!,原因:'.loc()+'<br>'
											+ action.result.message);
						}
					});
				}
			}.createDelegate(this));
		} else if (item.btnId == 'updatesave') {
			if (frm.isValid()) {
				var updateParams = this.formDS.baseParams;
				updateParams['type'] = 'updatesave';
				frm.submit({
							url : '/dev/dictionary/option.jcp',
							params : updateParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								Dictionary.navPanel.getTree().loadSelfNode(
										action.result.option_id,
										Dictionary.navPanel.clickEvent);
								Ext.msg('info', '数据更新成功!'.loc());
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败,原因:'.loc()+'<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		}
	}
};
Ext.grid.oneCheckColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.oneCheckColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onOneMouseDown, this);
				}, this);
	},
	onOneMouseDown : function(e, t) {
		if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
			e.stopEvent();
			var index = this.grid.getView().findRowIndex(t);
			var st = this.grid.store;
			var record = st.getAt(index);
			if (record.data[this.dataIndex] == 'true'
					|| record.data[this.dataIndex]) {
				record.set(this.dataIndex, false);
				record.data[this.dataIndex] = false;
			} else {
				for (var i = 0; i < st.getCount(); i++) {
					st.getAt(i).set(this.dataIndex, false);
					st.getAt(i).data[this.dataIndex] = false;
				}
				record.set(this.dataIndex, true);
				record.data[this.dataIndex] = true;
			}
			if (this.grid.editingFlag) {
				var updateParams = {};
				updateParams['type'] = 'updatesave';
				updateParams['option_id'] = this.grid.store.baseParams['option_id'];
				updateParams['kind_id'] = this.grid.store.baseParams['kind_id'];
				updateParams['index_id'] = record.get('index_id');
				updateParams['option_code'] = record.get('option_code');
				updateParams['option_value'] = record.get('option_value');
				updateParams['is_default'] = record.get('is_default');
				updateParams['allow_used'] = record.get('allow_used');

				Ext.Ajax.request({
							url : '/dev/dictionary/soption.jcp',
							params : updateParams,
							method : 'post',
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check);
								if (!ajaxResult.success) {
									Ext.msg("error", '字典项更新!,原因:'.loc()+'<br>'
													+ ajaxResult.message);
								}
							}
						});
			}
		}
	},
	renderer : function(v, p, record) {
		var checked = false;
		if (v == 'true' || v == '1' || v == 'on' || v == 'y')
			checked = true;
		p.css += ' x-grid3-check-col-td';
		return '<div class="x-grid3-check-col' + (checked ? '-on' : '')
				+ ' x-grid3-cc-' + this.id + '">&#160;</div>';
	}
};
Ext.grid.CheckColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},
	onMouseDown : function(e, t) {
		if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
			e.stopEvent();
			var index = this.grid.getView().findRowIndex(t);
			var st = this.grid.store;
			var record = st.getAt(index);
			var canPass = false;
			for (var i = 0; i < st.getCount(); i++) {
				if (i == index)
					continue;
				if (st.getAt(i).data.allow_used == 'true') {
					canPass = true;
					break;
				}
			}
			if (!canPass) {
				Ext.msg("error", '一个字典至少有一项可用'.loc());
				record.set("allow_used", true);
				return;
			}
			if (record.data[this.dataIndex] == 'true'
					|| record.data[this.dataIndex]) {
				record.set(this.dataIndex, false);
				record.data[this.dataIndex] = false;
			} else {
				record.set(this.dataIndex, true);
				record.data[this.dataIndex] = true;
			}
			if (this.grid.editingFlag) {
				var updateParams = {};
				updateParams['type'] = 'updatesave';
				updateParams['kind_id'] = this.grid.store.baseParams['kind_id'];
				updateParams['index_id'] = record.get('index_id');
				updateParams['option_code'] = record.get('option_code');
				updateParams['option_value'] = record.get('option_value');
				updateParams['is_default'] = record.get('is_default');
				updateParams['allow_used'] = record.get('allow_used');
				Ext.Ajax.request({
							url : '/dev/dictionary/soption.jcp',
							params : updateParams,
							method : 'post',
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check)
								if (!ajaxResult.success) {
									Ext.msg("error", '字典项更新!,原因:'.loc()+'<br>'
													+ ajaxResult.message);
								}
							}
						});
			}
		}
	},
	renderer : function(v, p, record) {
		var checked = false;
		if (v == 'true' || v == '1' || v == 'on' || v == 'y')
			checked = true;
		p.css += ' x-grid3-check-col-td';
		return '<div class="x-grid3-check-col' + (checked ? '-on' : '')
				+ ' x-grid3-cc-' + this.id + '">&#160;</div>';
	}
};
CompleteColumn = function() {
	var grid;
	function getRecord(t) {
		var index = grid.getView().findRowIndex(t);
		return grid.store.getAt(index);
	}
	function onMouseDown(e, t) {
		if (Ext.fly(t).hasClass('option-check')) {
			if (grid.editingFlag) {
				if (grid.store.getCount() == 1) {
					Ext.msg("error", '一个字典至少留一个选项'.loc());
					return;
				}
				var record = getRecord(t);
				var delParams = {};
				delParams['type'] = 'delete';
				delParams['index_id'] = record.get('index_id');
				delParams['option_id'] = grid.store.baseParams['option_id']
				delParams['kind_id'] = grid.store.baseParams['kind_id'];
				Ext.Ajax.request({
							url : '/dev/dictionary/soption.jcp',
							params : delParams,
							method : 'post',
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check)
								if (ajaxResult.success) {
									grid.store.remove(record);
								} else {
									Ext.msg("error", '数据删除失败!,原因:'.loc()+'<br>'
													+ ajaxResult.message);
								}
							}
						});
			} else {
				var record = getRecord(t);
				grid.store.remove(record);
			}
		}
	}
	Ext.apply(this, {
				width : 22,
				header : '<div class="option-col-hd"></div>',
				fixed : true,
				id : 'option-col',
				renderer : function() {
					return '<div class="option-check"></div>';
				},
				init : function(xg) {
					grid = xg;
					grid.on('render', function() {
								var view = grid.getView();
								view.mainBody.on('mousedown', onMouseDown);
							});
				}
			});
}
