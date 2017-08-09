Ext.namespace('dev.ctrl');
using("lib.scripteditor.CodeEditor");

dev.ctrl.ButtonManage = function(params, outterParams) {
	var params = params;
	var pageTypes = {
		item1 : [['new', '新建页面'.loc()], ['edit', '复制编辑页面'.loc()],
				['view', '预览页面'.loc()]],
		item2 : [['list', '列表页面'.loc()]],
		item3 : [['listinput', '列表录入页面'.loc()]],
		item5 : [['chart', '统计图页面'.loc()]],
		item6 : [['new', '新建页面'.loc()], ['edit', '复制编辑页面'.loc()],
				['view', '预览页面'.loc()]],
		item9 : [['singlequery', '单记录查询'.loc()]],
		item10 : [['listquery', '列表查询'.loc()]],
		item11 : [['embed', '外挂程序'.loc()]],
		item12 : [['selectinput', '选择录入'.loc()]],
		item13 : [['crossinput', '交叉录入'.loc()]],
		item14 : [['report', '报表页面'.loc()]],
		item17 : [['integrate', '应用集成'.loc()]],
		item19 : [['search', '搜索引擎'.loc()]],
		item21 : [['new', '新建页面'.loc()], ['edit', '复制编辑页面'.loc()],
				['view', '预览页面'.loc()]],
		item24 : [['batchupdate', '批量更新'.loc()]],
		item27 : [['dataupdate', '数据更新'.loc()]],
		item : [['view', '预览页面'.loc()], ['list', '列表页面'.loc()],
				['new', '新建页面'.loc()], ['edit', '复制编辑页面'.loc()]]
	};
	var pageTypeIndex = {};
	for (var p in pageTypes)
		for (var i = 0; i < pageTypes[p].length; i++)
			pageTypeIndex[pageTypes[p][i][0]] = pageTypes[p][i][1];

	var pageTypeData = (pageTypes["item" + params.prgType] == undefined)
			? pageTypes["item"]
			: pageTypes["item" + params.prgType];
	var contentstr = {
		"new" : [['%save', '保存'.loc()], ['%clear', '清空'.loc()],
				['%return', '返回'.loc()], ['%set', '设置'.loc()],
				['%audit', '申请审核'.loc()], ['%calculate', '计算'.loc()],
				['%define', '自定义'.loc()], ['%favorite', '收藏'.loc()],
				['%cancelfavorite', '取消收藏'.loc()], ['%map', '地图'.loc()],
				['%action', '审批动作'.loc()], ['%close', '关闭'.loc()],
				['%saveclose', '保存并关闭'.loc()]],
		"view" : [['%new', '新建'.loc()], ['%edit', '修改'.loc()],
				['%delete', '删除'.loc()], ['%copy', '复制'.loc()],
				['%return', '返回'.loc()], ['%set', '设置'.loc()],
				['%audit', '申请审核'.loc()], ['%auth', '权限'.loc()],
				['%print', '打印'.loc()], ['%calculate', '计算'.loc()],
				['%define', '自定义'.loc()], ['%favorite', '收藏'.loc()],
				['%cancelfavorite', '取消收藏'.loc()], ['%action', '审批动作'.loc()],
				['%close', '关闭'.loc()], ['%gis', '地图定位'.loc()]],
		"edit" : [['%new', '新建'.loc()], ['%save', '保存'.loc()],
				['%delete', '删除'.loc()], ['%return', '返回'.loc()],
				['%set', '设置'.loc()], ['%audit', '申请审核'.loc()],
				['%print', '打印'.loc()], ['%auth', '权限'.loc()],
				['%calculate', '计算'.loc()], ['%define', '自定义'.loc()],
				['%favorite', '收藏'.loc()], ['%cancelfavorite', '取消收藏'.loc()],
				['%map', '地图'.loc()], ['%action', '审批动作'.loc()],
				['%close', '关闭'.loc()], ['%saveclose', '保存并关闭'.loc()]],
		"list" : [['%new', '新建'.loc()], ['%save', '保存'.loc()],
				['%edit', '修改'.loc()], ['%view', '查看'.loc()],
				['%delete', '删除'.loc()], ['%copy', '复制'.loc()],
				['%batchupdate', '批量更新'.loc()], ['%audit', '申请审核'.loc()],
				['%download', '下载'.loc()], ['%upload', '上传'.loc()],
				['%print', '打印'.loc()], ['%excel', '导出Excel'.loc()],
				['%exceltemplate', '下载数据模板'.loc()],
				['%excelupload', '上传模板数据'.loc()], ['%calculate', '计算'.loc()],
				['%chart', '绘图'.loc()], ['%stat', '统计'.loc()],
				['%define', '自定义'.loc()], ['%favorite', '收藏'.loc()],
				['%cancelfavorite', '取消收藏'.loc()], ['%map', '地图'.loc()],
				['%action', '审批动作'.loc()], ['%return', '返回'.loc()],
				['%updateFinish', '修改完成'.loc()], ['%close', '关闭'.loc()]],
		"report" : [['%excel', '导出Excel'.loc()], ['%pdf', '导出PDF'.loc()],
				['%print', '打印'.loc()], ['%printview', '打印预览'.loc()],
				['%return', '返回'.loc()], ['%calculate', '计算'.loc()],
				['%define', '自定义'.loc()], ['%favorite', '收藏'.loc()],
				['%cancelfavorite', '取消收藏'.loc()], ['%close', '关闭'.loc()]],
		"integrate" : [['%return', '返回'.loc()], ['%define', '自定义'.loc()],
				['%close', '关闭'.loc()]],
		"batchupdate" : [['%save', '保存'.loc()], ['%return', '返回'.loc()],
				['%close', '关闭'.loc()]],
		"singlequery" : [['%excel', '导出Excel'.loc()], ['%print', '打印'.loc()],
				['%define', '自定义'.loc()], ['%favorite', '收藏'.loc()],
				['%cancelfavorite', '取消收藏'.loc()], ['%return', '返回'.loc()],
				['%close', '关闭'.loc()]],
		"listquery" : [['%excel', '导出Excel'.loc()], ['%calculate', '计算'.loc()],
				['%view', '查看'.loc()], ['%new', '新建'.loc()],
				['%edit', '修改'.loc()], ['%delete', '删除'.loc()],
				['%copy', '复制'.loc()], ['%batchupdate', '批量更新'.loc()],
				['%print', '打印'.loc()], ['%define', '自定义'.loc()],
				['%favorite', '收藏'.loc()], ['%cancelfavorite', '取消收藏'.loc()],
				['%map', '地图'.loc()], ['%close', '关闭'.loc()],
				['%return', '返回'.loc()]],
		"selectinput" : [['%save', '保存'.loc()], ['%calculate', '计算'.loc()],
				['%define', '自定义'.loc()], ['%favorite', '收藏'.loc()],
				['%cancelfavorite', '取消收藏'.loc()], ['%close', '关闭'.loc()]],
		"crossinput" : [['%save', '保存'.loc()], ['%excel', '导出Excel'.loc()],
				['%return', '返回'.loc()], ['%audit', '申请审核'.loc()],
				['%action', '审批动作'.loc()], ['%print', '打印'.loc()],
				['%calculate', '计算'.loc()], ['%define', '自定义'.loc()],
				['%favorite', '收藏'.loc()], ['%cancelfavorite', '取消收藏'.loc()],
				['%close', '关闭'.loc()], ['%saveclose', '保存并关闭'.loc()]],
		"listinput" : [['%new', '新建'.loc()], ['%copy', '复制'.loc()],
				['%edit', '修改'.loc()], ['%delete', '删除'.loc()],
				['%excel', '导出Excel'.loc()],
				['%exceltemplate', '下载数据模板'.loc()],
				['%excelupload', '上传模板数据'.loc()], ['%return', '返回'.loc()],
				['%audit', '申请审核'.loc()], ['%action', '审批动作'.loc()],
				['%print', '打印'.loc()], ['%calculate', '计算'.loc()],
				['%define', '自定义'.loc()], ['%favorite', '收藏'.loc()],
				['%cancelfavorite', '取消收藏'.loc()],
				['%updateFinish', '修改完成'.loc()], ['%close', '关闭'.loc()]],
		"chart" : [['%showdata', '查看数据'.loc()], ['%print', '打印'.loc()],
				['%return', '返回'.loc()], ['%define', '自定义'.loc()],
				['%favorite', '收藏'.loc()], ['%cancelfavorite', '取消收藏'.loc()],
				['%set', '设置'.loc()], ['%close', '关闭'.loc()]],
		"search" : [['%calculate', '计算'.loc()], ['%define', '自定义'.loc()],
				['%favorite', '收藏'.loc()], ['%cancelfavorite', '取消收藏'.loc()],
				['%return', '返回'.loc()], ['%close', '关闭'.loc()]],
		"dataupdate" : [['%define', '自定义'.loc()], ['%excel', '导出Excel'.loc()],
				['%refresh', '刷新'.loc()], ['%return', '返回'.loc()],
				['%close', '关闭'.loc()]],
		"embed" : [['%define', '自定义'.loc()], ['%favorite', '收藏'.loc()],
				['%cancelfavorite', '取消收藏'.loc()], ['%return', '返回'.loc()],
				['%close', '关闭'.loc()]]

	};

	var accrodingMap = {
		"%save" : "/themes/icon/common/save.gif",
		"%saveclose" : "/themes/icon/common/save.gif",
		"%return" : "/themes/icon/common/redo.gif",
		"%edit" : "/themes/icon/common/update.gif",
		"%delete" : "/themes/icon/common/delete.gif",
		"%clear" : "/themes/icon/common/clear.gif",
		"%new" : "/themes/icon/common/new.gif",
		"%copy" : "/themes/icon/common/copy.gif",
		"%excel" : "/themes/icon/common/insert_excel.gif",
		"%exceltemplate" : "/themes/icon/common/excel_template.gif",
		"%excelupload" : "/themes/icon/common/excel_upload.gif",
		"%pdf" : "/themes/icon/xp/pdf.gif",
		"%print" : "/themes/icon/common/print.gif",
		"%printview" : "/themes/icon/common/print_view.gif",
		"%showdata" : "/themes/icon/common/list.gif",
		"%favorite" : "/themes/icon/all/star.gif",
		"%cancelfavorite" : "/themes/icon/all/folder_delete.gif",
		"%set" : "/themes/icon/all/cog_edit.gif",
		"%close" : "/themes/icon/all/cancel.gif",
		"%define" : "/themes/icon/all/script_gear.gif",
		"%map" : "/themes/icon/all/map.gif",
		"%batchupdate" : "/themes/icon/xp/update.gif",
		"%refresh" : "/themes/icon/all/selfNode.gif",
		"%updateFinish" : "/themes/icon/all/table_lightning.gif",
		"%gis" : "/themes/icon/probe/GIS.png"
	}

	this.init = function(rec) {
		var temp = contentstr[pageTypeData[0][0]][0];
		var val = {
			button_name : temp[1],
			button_action : temp[0],
			button_class : "",
			button_js : '',
			button_img : accrodingMap[temp[0]],
			page_type : pageTypeData[0][0],
			target_type : ["0", "", "0", '无'.loc(), "", "", "", "", "", ""],
			task_link : "",
			constraint_type : "1"
		}
		if (rec)
			Ext.apply(val, rec.data);

		var fm = form.form;
		temp = fm.findField("pageType");
		temp.setValue(val.page_type);
		temp.fireEvent("select");
		fm.findField("button_name").setValue(val.button_name);
		fm.findField("buttonAction").setValue(val.button_action);
		fm.findField("constraint_type").setValue(val.constraint_type);
		setValueDelay(val.button_action, val.button_class, val);
		picker.setValue(val.button_img);
		targetPanel.setValue(val.target_type, params.parent_id);
		prg_2.setValue(unescape(val.button_js));
	}

	var picker = new lib.IconPicker.IconPicker({
				id : 'ipicker',
				qtip : {
					title : '提示'.loc(),
					dismissDelay : 10000,
					text : '设置在按钮中显示的图标,建议选择16x16的图标'.loc()
				},
				width : 24,
				fieldLabel : '请选择图标'.loc()
			});

	var prgStore = new Ext.data.JsonStore({
				url : '/dev/ctrl/TargetPanel.jcp',
				root : 'items',
				fields : ["value", "text"],
				baseParams : {
					object_id : params.parent_id
				},
				remoteSort : false
			});
	var prg_1 = new Ext.form.ComboBox({
				xtype : 'combo',
				store : prgStore,
				width : 450,
				fieldLabel : '程序'.loc(),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				mode : 'local',
				name : 'button_class'
			});
	var prg_2 = new lib.scripteditor.CodeEditor({
		fieldLabel : '请在此处录入JS脚本:<br><pre style="color:#af5f5f;">(编辑时,按F11键<br>进入全屏,ESC键<br>退出,最长不得超<br>过2000字)</pre>'
				.loc(),
		width : 550,
		labelSeparator : "",
		maxLength : 2000,
		allowFullScreen : true,
		allowFormatter : true,
		height : 80,
		name : 'button_js',
		language : "js"
	});

	this.prgStat = true;
	var setValueDelay = function(val, value, att) {
		if (val == "%define") {
			this.prgStat = false;
			prg_1.hide();
			prg_2.show();

		} else {
			prg_2.hide();
			prg_1.show();
			this.prgStat = true;
			var loaded = function() {

				if (value == "" && prgStore.getCount() > 0)
					value = prgStore.getAt(0).get("value");
				prg_1.setValue(value);
				prgStore.un("load", loaded, prgStore)
			}
			prgStore.on("load", loaded, prgStore)
			if (val == "%calculate") {
				prgStore.load({
							params : {
								type : 'operlog'
							}
						})
			} else if (val == "%audit" || val == "%action") {
				prgStore.load({
							params : {
								type : 'workflow_base'
							}
						})
			} else if (val == "%map") {
				prgStore.load({
							params : {
								type : 'map_base'
							}
						})
			} else {
				prgStore.load({
							params : {
								type : 'buttonCla'
							}
						})
			}
		}
	}

	var formId = Ext.id();

	var targetPanel = new dev.ctrl.TargetPanel({
				parentPanel : formId,
				objectId : params.parent_id
			});

	var form = new Ext.form.FormPanel({
		id : formId,
		labelWidth : 160,
		labelAlign : 'right',
		region : 'center',
		height : 180,
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 0px 0px 0px;',
		items : [

		{
			layout : 'column',
			border : false,
			items : [{
				border : false,
				columnWidth : 0.54,
				layout : 'form',
				items : [{
							xtype : 'combo',
							fieldLabel : '页面类型'.loc(),
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : pageTypeData
									}),
							listeners : {
								select : function() {
									var field = form.form
											.findField("buttonAction");
									var st = field.store;
									var val = this.getValue();
									var data = contentstr[val];
									st.loadData(data);
								}
							},
							hiddenName : 'pageType',
							valueField : 'value',
							value : pageTypeData[0][0],
							displayField : 'text',
							triggerAction : 'all',
							mode : 'local'
						}, {
							xtype : 'textfield',
							fieldLabel : '标题'.loc(),
							name : 'button_name'
						}]
			}, {
				columnWidth : 0.46,
				layout : 'form',
				clear : true,
				border : false,
				items : [{
							xtype : 'combo',
							fieldLabel : '按钮事件'.loc(),
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : contentstr[pageTypeData[0][0]]
									}),
							listeners : {
								select : function(cb, rec) {
									var field = form.form
											.findField("button_name");
									field.setValue(this.getEl().dom.value);
									field = form.form.findField("button_class");
									this.el.dom.title = rec.get("value")
									var val = this.getValue();
									var img = accrodingMap[val];
									if (img != undefined) {
										picker.setValue(img);
									}
									setValueDelay(val, "");
								}
							},
							hiddenName : 'buttonAction',
							valueField : 'value',
							displayField : 'text',
							editable : false,
							triggerAction : 'all',
							mode : 'local'
						}, picker]
			}]
		}, prg_1, prg_2, {
			layout : 'column',
			border : false,
			items : [{
						border : false,
						columnWidth : 0.54,
						hidden : outterParams && outterParams.hideTarget,
						layout : 'form',
						items : targetPanel.getFirstCombo()
					}, {
						border : false,
						columnWidth : 0.46,
						layout : 'form',
						items : {
							xtype : 'combo',
							fieldLabel : '权限约束方式'.loc(),
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '不受权限约束'.loc()],
												['1', '受策略权限约束'.loc()],
												['2', '工作申请页面显示'.loc()]]
									}),
							hiddenName : 'constraint_type',
							valueField : 'value',
							value : "1",
							displayField : 'text',
							triggerAction : 'all',
							mode : 'local'
						}
					}]
		}]
	});

	var fields = ["module_id", "button_name", "button_action", "button_class",
			"button_img", "target_type", "page_type", "workflow_id",
			"button_action_text", "page_type_text", "button_class_text",
			"button_js", "targetText", "seq", "constraint_type"];
	var gRec = Ext.data.Record.create(fields);

	var gstore = new Ext.data.JsonStore({
				url : '/dev/ctrl/ButtonManage.jcp?object_id='
						+ params.parent_id + "&type=columns",
				root : 'items',
				method : 'get',
				autoLoad : true,
				fields : fields
			});
	var targetIDIndex = {
		'0' : 'new',
		'1' : 'view',
		'2' : 'edit',
		'3' : 'list',
		'4' : 'copy'
	};
	var target_typeIndex = {
		'0' : '自身'.loc(),
		'1' : '弹出'.loc(),
		'2' : '多窗口'.loc()
	};
	gstore.on("load", function(st, recs, e) {

				if (st.tzloaded)
					return;
				st.tzloaded = true;
				st.suspendEvents();
				for (var i = 0; i < recs.length; i++) {
					recs[i].set("page_type_text", pageTypeIndex[recs[i]
									.get("page_type")]);
					var arr = contentstr[recs[i].get("page_type")];
					var tmp = recs[i].get("button_action");
					for (var j = 0; j < arr.length; j++) {
						if (arr[j][0] == tmp) {
							recs[i].set("button_action_text", arr[j][1]);
							break;
						}
					}
					recs[i].set("target_typeText", target_typeIndex[recs[i]
									.get("target_type")]);
					tmp = recs[i].get("target_type");
					if (tmp != "") {
						var tmp2 = tmp[2].split(",");
						tmp = "";
						for (var j = 0; j < tmp2.length; j++) {
							if (j > 0)
								tmp += "<br>";
							tmp += (targetIDIndex[tmp2[j]])
									? targetIDIndex[tmp2[j]]
									: tmp2[j];
						}
						recs[i].set("target_idText", tmp);
					}
					recs[i].dirty = false;
				}
				st.resumeEvents();
				st.fireEvent("load", st, recs, e);
				grid.getView().refresh();
			}, this);

	var opratorPlugin = new Ext.grid.oprateColumn({
				id : 'opr',
				header : '编辑'.loc(),
				width : 130,
				dataIndex : 'page_type_text',
				sortable : false
			});
	var grid = new Ext.grid.GridPanel({
				store : gstore,
				border : false,
				stripeRows : true,
				enableHdMenu : false,
				frame : false,
				region : 'center',
				plugins : [opratorPlugin],
				columns : [opratorPlugin, {
							header : '页面'.loc(),
							width : 95,
							sortable : false,
							dataIndex : 'page_type_text'
						}, {
							header : '标题'.loc(),
							width : 120,
							sortable : false,
							dataIndex : 'button_name'
						}, {
							header : '事件'.loc(),
							width : 80,
							sortable : false,
							dataIndex : 'button_action_text'
						}, {
							header : '程序'.loc(),
							width : 120,
							sortable : false,
							dataIndex : 'button_class_text'
						}, {
							header : '对象'.loc(),
							width : 60,
							sortable : false,
							dataIndex : 'target_typeText'
						}, {
							header : '目标'.loc(),
							width : 160,
							sortable : false,
							dataIndex : 'targetText'
						}, {
							header : "状态".loc(),
							width : 60,
							sortable : false,
							dataIndex : 'target_idText'
						}, {
							header : '图片'.loc(),
							width : 60,
							sortable : false,
							dataIndex : 'button_img',
							renderer : function(v) {
								return '<div><img src="/themes/icon' + v
										+ '"></div>';
							}
						}],
				viewConfig : {
					forceFit : true
				},
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				iconCls : 'icon-grid'
			});
	grid.rowEditMark = null;
	grid.on("rowdblclick", function(gd, rowIndex, e) {
				var rec = gd.getStore().getAt(rowIndex);
				this.init(rec);
				gd.getSelectionModel().selectRow(rowIndex);
				gd.rowEditMark = rec;
			}, this);

	var midPanel = new Ext.Panel({
		border : false,
		region : 'east',
		width : 80,
		layout : 'border',
		items : [{
					region : 'center',
					border : false
				}, {
					border : false,
					region : 'south',
					height : 40,
					items : {
						xtype : 'button',
						text : '保存'.loc(),
						cls : 'x-btn-text-icon',
						icon : '/themes/icon/all/add.gif',
						listeners : {
							click : function() {
								var fm = form.form;
								if (!fm.isValid()) {
									Ext.msg("warn", "填写的数据错误,请修改错误后保存");
									return;
								}
								var img = picker.getValue();
								if (!img)
									img = '/common/save.gif';
								var ret = targetPanel.getValue();
								var newVal = {
									target_type : ret,
									targetText : ret[4],
									target_idText : ret[5],
									target_typeText : ret[3],
									module_id : params.parent_id,
									button_name : fm.findField("button_name")
											.getValue(),
									button_action : fm
											.findField("buttonAction")
											.getValue(),
									button_action_text : fm
											.findField("buttonAction").getEl().dom.value,
									button_class : fm.findField("button_class")
											.getValue(),
									button_js : escape(fm
											.findField("button_js").getValue()),
									button_img : img,
									page_type : fm.findField("pageType")
											.getValue(),
									page_type_text : fm.findField("pageType")
											.getEl().dom.value,
									button_class_text : fm
											.findField("button_class").getEl().dom.value,
									constraint_type : fm
											.findField("constraint_type")
											.getValue(),
									seq : gstore.getCount()
								};
								if (grid.rowEditMark != null)
									grid.rowEditMark.data = newVal
								else
									gstore.add(new gRec(newVal));
								grid.rowEditMark = null;
								var view = grid.getView();
								grid.getSelectionModel().clearSelections();
								view.refresh.defer(10, view);
							},
							scope : this
						}
					}
				}]

	});

	this.MainTabPanel = new Ext.Panel({
		id : 'metaTablePanel',
		layout : 'border',
		border : false,
		items : [{
			tbar : [new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon',
				scope : this,
				handler : function() {
					var fm = form.form;
					var storeValue = [];
					var allRecords = grid.getStore().getRange(0);
					for (i = 0; i < allRecords.length; i++)
						storeValue[i] = allRecords[i].data;

					var returnJson = {
						object_id : params.parent_id,
						fields : Ext.encode(storeValue)
					};
					Ext.Ajax.request({
								url : '/dev/ctrl/ButtonManage.jcp',
								params : returnJson,
								callback : function(options, success, response) {
									Ext.msg("info", '保存成功'.loc());
									try {
										params.returnFunction();
									} catch (e) {
									}
								}
							});
				}
			}), new Ext.Toolbar.Button({
						text : '返回'.loc(),
						icon : '/themes/icon/xp/undo.gif',
						cls : 'x-btn-text-icon',
						scope : this,
						handler : function() {
							params.returnFunction();
						}
					})],
			layout : 'border',
			border : false,
			height : 330,
			region : 'north',
			items : [form, midPanel]
		}, grid]
	});
}

Ext.grid.oprateColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.oprateColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},

	onMouseDown : function(e, t) {
		if (t.className && t.className.indexOf('bm-') != -1) {
			e.stopEvent();
			var name = t.className;
			var st;
			var index = this.grid.getView().findRowIndex(t);
			if (name.indexOf("delete") != -1) {
				st = this.grid.getStore();
				var rec = st.getAt(index);
				st.remove(rec);
				if (this.grid.rowEditMark == rec)
					this.grid.rowEditMark = null;
				var view = this.grid.getView();
				view.refresh.defer(10, view);
			} else if (name.indexOf("up") != -1) {
				st = this.grid.getStore();
				var f = st.getAt(index).get("seq");
				st.getAt(index).set("seq", st.getAt(index - 1).get("seq"))
				st.getAt(index - 1).set("seq", f);
				st.sort("seq", "asc");
			} else if (name.indexOf("down") != -1) {
				st = this.grid.getStore();
				var f = st.getAt(index).get("seq");
				st.getAt(index).set("seq", st.getAt(index + 1).get("seq"))
				st.getAt(index + 1).set("seq", f);
				st.sort("seq", "asc");
			} else if (name.indexOf("edit") != -1) {
				this.grid.fireEvent("rowdblclick", this.grid, index);
			}
		}
	},
	renderer : function(v, p, record, rowIndex, colIndex, st) {

		var editTitle = '点击此按钮或双击行进行编辑'.loc();
		var deleteTitle = '删除'.loc();
		var bmup = '上移'.loc();
		var bmdown = '下移'.loc();

		var count = st.getCount();
		var event = " onmouseover='Ext.get(this).addClass(\"bm-over\")' onmouseout='Ext.get(this).removeClass(\"bm-over\")' ";
		var retVal = '<img ' + event + ' class="bm-edit" title="' + editTitle
				+ '" src="/themes/icon/all/pencil.gif">';
		retVal += '<img ' + event + ' class="bm-delete" title="' + deleteTitle
				+ '" src="/themes/icon/common/del.gif">';
		if (rowIndex != 0)
			retVal += '<img ' + event + ' class="bm-up" title="' + bmup
					+ '"   src="/themes/icon/all/arrow_up.gif">';
		if (rowIndex != count - 1)
			retVal += '<img ' + event + ' class="bm-down" title="' + bmdown
					+ '" src="/themes/icon/all/arrow_down.gif">';
		return '<div style="height:18px">' + retVal + '</div>';
	}
};
