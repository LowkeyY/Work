

dev.unit.OptionPanel = function() {
	this.editingFlag = false;
	var fm = Ext.form;
	var nativeUnit = new Ext.grid.CheckColumn({
				header : '是否基准量纲'.loc(),
				dataIndex : 'is_native',
				width : 100,
				resizable : false,
				sortable : false
			});
	var metric = new Ext.grid.CheckColumn({
				header : '公制默认单位'.loc(),
				dataIndex : 'metric_default',
				width : 100,
				resizable : false,
				sortable : false
			});
	var imperial = new Ext.grid.CheckColumn({
				header : '英美制默认单位'.loc(),
				dataIndex : 'imperial_default',
				width : 100,
				resizable : false,
				sortable : false
			});

	this.optionName = new fm.TextField({
				width : 260,
				allowBlank : false

			});
	var completeColumn = new dev.unit.CompleteColumn();
	this.cm = new Ext.grid.ColumnModel([completeColumn, nativeUnit, metric,
			imperial, {
				header : '名称'.loc(),
				width : 260,
				dataIndex : 'name',
				resizable : false,
				editor : this.optionName
			}, {
				header : '乘积因子'.loc(),
				width : 150,
				dataIndex : 'factor',
				resizable : false,
				editor : this.optionCode = new fm.NumberField({
							decimalPrecision : -1,
							width : 150,
							allowBlank : false
						})
			}, {
				id : 'desc',
				header : '描述'.loc(),
				dataIndex : 'description',
				resizable : false,
				editor : this.optionDesc = new fm.TextField({
							width : 360
						})
			}]);
	this.cm.defaultSortable = false;
	var headerTpl = new Ext.Template(
			'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
			'<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
			'<tbody><tr class="new-unit-row">',
			'<td><div id="new-unit-icon" ></div></td>',
			'<td class="x-small-editor" id="new-unit-default"  align="center"></td>',
			'<td class="x-small-editor" id="new-unit-metric"  align="center"></td>',
			'<td class="x-small-editor" id="new-unit-imperial"  align="center"></td>',
			'<td class="x-small-editor" id="new-unit-title" align="left"></td>',
			'<td class="x-small-editor" id="new-unit-value"  align="left"></td>',
			'<td class="x-small-editor" id="new-unit-valid" align="left"></td>',
			'</tr></tbody>', "</table>");

	this.Option = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'factor'
			}, {
				name : 'name'
			}, {
				name : 'is_native',
				type : 'boolean'
			}, {
				name : 'metric_default',
				type : 'boolean'
			}, {
				name : 'imperial_default',
				type : 'boolean'
			}, {
				name : 'description'
			}]);
	this.ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/dev/unit/soption.jcp",
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : 'id'
						}, this.Option),
				remoteSort : true
			});

	var ButtonArray = [];
	this.unitPropPanel = new Ext.grid.EditorGridPanel({
				autoScroll : true,
				border : true,
				ds : this.ds,
				cm : this.cm,
				sm : new Ext.grid.RowSelectionModel(),
				autoExpandColumn : 'desc',
				plugins : [completeColumn, nativeUnit, metric, imperial],
				enableColumnHide : false,
				enableColumnMove : false,
				enableHdMenu : false,
				view : new Ext.grid.GridView({
							emptyText : '未设定量纲'.loc(),
							onDataChange : function() {
								this.refresh();
								this.updateHeaderSortState();
								this.syncFocusEl(0);
							},
							templates : {
								header : headerTpl
							}
						}),
				tbar : ButtonArray
			});
	this.unitPropPanel.on('render', function() {
				this.initGrid();
			}, this);
	this.unitPropPanel.on('afteredit', function(e) {
		if (this.editingFlag) {
			var code = e.record.get('factor');
			var value = e.record.get('name');
			var updateParams = {};
			updateParams['type'] = 'updatesave';
			updateParams['id'] = e.record.get('id');
			updateParams['factor'] = code;
			updateParams['name'] = value;
			updateParams['is_native'] = e.record.get('is_native');
			updateParams['metric_default'] = e.record.get('metric_default');
			updateParams['imperial_default'] = e.record.get('imperial_default');
			updateParams['description'] = e.record.get('description');
			updateParams['group_id'] = this.params.group_id;
			Ext.Ajax.request({
						url : '/dev/unit/soption.jcp',
						params : updateParams,
						method : 'post',
						scope : this,
						success : function(response, options) {
							var check = response.responseText;
							var ajaxResult = Ext.util.JSON.decode(check)
							if (!ajaxResult.success) {
								Ext.msg("error", '量纲名称更新!,原因:'.loc()+'<br>'
												+ ajaxResult.message);
							}
						}
					});
		}
	}, this);
	this.MainTabPanel = this.unitPropPanel;
};

dev.unit.OptionPanel.prototype = {
	initGrid : function() {
		var optionTitle = new Ext.form.TextField({
			width : 258,
			renderTo : 'new-unit-title',
			qtip : {
				title : '提示'.loc(),
				dismissDelay : 10000,
				text : '填写单位的名称,如果是上标,请用&lt;sup&gt;标签将要变为上标的字符括起来,如'.loc()+'km<sup>2</sup>'+'要填写'.loc()+'km&lt;sup&gt;2&lt;/sup&gt;'
			}
		});
		var optionCode = new Ext.form.NumberField({
					decimalPrecision : -1,
					width : 148,
					qtip : {
						title : '提示'.loc(),
						dismissDelay : 10000,
						text : '表示一个当前单位等于多少个基准单位'.loc()
					},
					renderTo : 'new-unit-value'
				});
		var optionDefault = new Ext.form.Checkbox({
					renderTo : 'new-unit-default',
					checked : false,
					qtip : {
						title : '提示'.loc(),
						dismissDelay : 10000,
						text : '是否是当前单位组中的基准量纲,如果一个组中没有设定基准量纲,则此组中的各个单位不可换算.'.loc()
					}
				});
		var metricDefault = new Ext.form.Checkbox({
					renderTo : 'new-unit-metric',
					checked : false,
					qtip : {
						title : '提示'.loc(),
						dismissDelay : 10000,
						text : '是否是当前单位组中的公制单位默认量纲,如果用户使用公制单位,则默认选中此量纲.'.loc()
					}
				});
		var imperialDefault = new Ext.form.Checkbox({
					renderTo : 'new-unit-imperial',
					checked : false,
					qtip : {
						title : '提示'.loc(),
						dismissDelay : 10000,
						text : '是否是当前单位组中的英制单位默认量纲,如果用户使用英制单位,则默认选中此量纲,美制与此相同.'.loc()
					}
				});
		var optionValid = new Ext.form.TextField({
					width : 358,
					qtip : {
						title : '提示'.loc(),
						dismissDelay : 10000,
						text : '用于描述这个单位的功能,可以不填'.loc()
					},
					renderTo : 'new-unit-valid'
				});
		var cm1 = this.unitPropPanel.getColumnModel();
		var addIcon = Ext.get('new-unit-icon');
		addIcon.addListener('click', function() {

					if (optionTitle.getValue() == ''
							|| optionCode.getValue() == '') {
						Ext.msg("error", '不能进行量纲名称更新!,原因'.loc()+':<br>'+'量纲名称与乘积因子不能为空'.loc());
						return;
					}
					if (this.editingFlag) {
						var saveParams = {};
						saveParams['type'] = 'save';
						saveParams['name'] = optionTitle.getValue();
						saveParams['factor'] = optionCode.getValue();
						saveParams['is_native'] = optionDefault.getValue();
						saveParams['description'] = optionValid.getValue();
						saveParams['metric_default'] = metricDefault.getValue();
						saveParams['group_id'] = this.params.group_id;
						saveParams['imperial_default'] = imperialDefault
								.getValue();
						Ext.Ajax.request({
									url : '/dev/unit/soption.jcp',
									params : saveParams,
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
															'量纲名称更新!,原因:'.loc()+'<br>'
																	+ ajaxResult.message);
										} else {
											optionTitle.setValue('');
											optionCode.setValue('');
											optionDefault.setValue('false');
											metricDefault.setValue('false');
											imperialDefault.setValue('false');
											optionValid.setValue('');
											this.ds.load({
														params : {
															start : 0,
															limit : 100
														}
													});
										}
									}
								});
					} else {
						this.ds.add(new this.Option({
									id : Math.random(),
									name : optionTitle.getValue(),
									factor : optionCode.getValue(),
									is_native : optionDefault.getValue(),
									metric_default : metricDefault.getValue(),
									imperial_default : imperialDefault
											.getValue(),
									description : optionValid.getValue()
								}));
						optionTitle.setValue('');
						optionCode.setValue('');
						optionDefault.setValue('false');
						metricDefault.setValue('false');
						imperialDefault.setValue('false');
					}
				}, this);
		this.unitPropPanel.resetEditor = function() {
			optionTitle.setValue('');
			optionCode.setValue('');
			optionDefault.setValue('false');
			metricDefault.setValue('false');
			imperialDefault.setValue('false');
		}
	},
	init : function(params) {
		this.params = params;
		this.unitPropPanel.group_id = params.group_id;
		this.ds.removeAll();
	},
	formEdit : function(params) {
		this.params = params;
		this.unitPropPanel.group_id = params.group_id;
		this.editingFlag = true;
		this.unitPropPanel.editingFlag = true;
	},
	loadData : function(params) {
		this.ds.baseParams = params;
		this.ds.load({
					params : {
						start : 0,
						limit : 100
					}
				});
		this.unitPropPanel.resetEditor();
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
				updateParams['id'] = record.get('id');
				updateParams['factor'] = record.get('factor');
				updateParams['name'] = record.get('name');
				updateParams['is_native'] = record.get('is_native');
				updateParams['metric_default'] = record.get('metric_default');
				updateParams['imperial_default'] = record.get('imperial_default');
				updateParams['description'] = record.get('description');
				updateParams['group_id'] = this.grid.group_id;
				Ext.Ajax.request({
							url : '/dev/unit/soption.jcp',
							params : updateParams,
							method : 'post',
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check)
								if (!ajaxResult.success) {
									Ext.msg("error", '量纲更新失败!,原因:'.loc()+'<br>'
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
dev.unit.CompleteColumn = function() {
	var grid;

	function getRecord(t) {
		var index = grid.getView().findRowIndex(t);
		return grid.store.getAt(index);
	}
	function onMouseDown(e, t) {
		if (Ext.fly(t).hasClass('option-check')) {
			if (grid.editingFlag) {
				if (grid.store.getCount() == 1) {
					Ext.msg("error", '一个分类至少留一个量纲'.loc());
					return;
				}
				var record = getRecord(t);
				var delParams = {};
				delParams['type'] = 'delete';
				delParams['id'] = record.get('id');
				Ext.Ajax.request({
							url : '/dev/unit/soption.jcp',
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
				width : 40,
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
};
