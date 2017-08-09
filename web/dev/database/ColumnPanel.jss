using("lib.ComboTree.ComboTree");
using("lib.SelectUnit.SelectUnit");
dev.database.ColumnPanel = function(seq, object_id, itemid, isNew, config,
		frames) {
	var MetaTable = frames.get('MetaTable');
	var dataTypeStore = new Ext.data.SimpleStore({
				fields : ['text'],
				data : [["varchar"], ["int"], ["float"], ["date"], ["clob"],
						["blob"], ["geometry"]]
			});
	var decimalEditor = new Ext.form.TextField({
		fieldLabel : '小数位'.loc(),
		tabIndex : 129,
		allowBlank : true,
		width : 40,
		id : 'in_decimal_digits',
		style : 'text-align:left;ime-mode:disabled;'
			// ,regex : new RegExp("^[1-9]\d*"),
			// regexText : "长度只能填写大于0的正数"
		});
	var typeEditor = new Ext.form.ComboBox({
				fieldLabel : '数据类型'.loc(),
				tabIndex : 127,
				allowBlank : false,
				store : dataTypeStore,
				valueField : 'text',
				displayField : 'text',
				triggerAction : 'all',
				id : 'in_data_type',
				clearTrigger : false,
				mode : 'local',
				value : 'varchar',
				width : 80
			});

	var unitEditor = new lib.SelectUnit.SelectUnit({
				width : 200,
				fieldLabel : '单位'.loc(),
				id : 'in_unit',
				tabIndex : 140,
				objectId : object_id
			});

	var specialDS = new Ext.data.JsonStore({
				url : '/dev/database/specialSetTree.jcp',
				root : 'items',
				fields : ["text", "value"]
			});
	var specialSetCombo = new Ext.form.ComboBox({
				fieldLabel : '特殊选项'.loc(),
				tabIndex : 129,
				allowBlank : true,
				id : 'in_special_set',
				store : specialDS,
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				clearTrigger : false,
				mode : 'local'
			});

	var makeSureDefaultCfg = function(cfg, testField, defaultConfig) {
		if (!cfg[testField])
			Ext.apply(cfg, defaultConfig);
	}

	specialSetCombo.on("select", function(obj, rec, idx) {
				var val = rec.get("value");
				if (val == '1') {
					makeSureDefaultCfg(config, "option_id", {
								option_id : ''
							});
					var win = new dev.database.SpecialSetPanel(config, val,
							object_id);
					win.show();
					win.getEl().setStyle("z-index", 11000);
				} else if (val == '21' || val == '22') {
					lengthEditor.setValue(36);
				} else if (val == '2') {
					makeSureDefaultCfg(config, "start", {
								start : 0,
								step : 1
							});
				} else if (val == '25') {
					makeSureDefaultCfg(config, "INTEGRATE_ID", {
								INTEGRATE_ID : ''
							});
					var win = new dev.database.SpecialSetPanel(config, val,
							object_id);
					win.show();
					win.getEl().setStyle("z-index", 11000);
				}
			}, this);

	var fm = Ext.form;
	var lengthEditor = new fm.NumberField({
				fieldLabel : '长度'.loc(),
				tabIndex : 128,
				id : 'in_length',
				allowBlank : false,
				style : 'text-align:left;ime-mode:disabled;',
				regex : new RegExp("^[1-9]\d*"),
				regexText : '长度只能填写大于0的正数'.loc()

			});
	typeEditor.on("select", function() {
				var val = this.getValue();
				if (this.oldValue != val) {
					if (val == 'date' || val == 'clob' || val == 'blob'
							|| val == 'geometry') {
						var rel = 16;
						if (val == 'date')
							rel = 8;
						lengthEditor.setValue(rel);
						lengthEditor.disable();
					} else {
						lengthEditor.setValue(10);
						lengthEditor.enable();
					}

					decimalEditor.setDisabled(val != 'float');
					specialSetCombo.setValue("");
					try {
						specialDS.load({
									params : {
										type : val
									},
									method : 'post'
								});
					} catch (e) {
					}
					this.oldValue = val;
				}
			});
	var lnameField = new fm.TextField({
				fieldLabel : '逻辑名称'.loc(),
				tabIndex : 125,
				regex:/^\S*$/,
				regexText:'逻辑名称中不能包含空格',//列表查询中有空格无法作为列名称
				id : 'in_lname',
				allowBlank : false,
				blankText : '逻辑名称必须填写'.loc()
			});
	var pnameField = new fm.TextField({
				fieldLabel : '物理名称'.loc(),
				tabIndex : 126,
				blankText : '物理名称必须填写'.loc(),
				id : 'in_pname',
				allowBlank : false,
				style : 'ime-mode:disabled;',
				regex : new RegExp("^[a-zA-Z][0-9a-zA-Z_]*$"),
				regexText : '物理名称只能由数字,字母,下划线组成并且首字符不能为数字'.loc()
			});
	lnameField.on("change", function() {
		var val = lnameField.getValue();
			// if(val!="")
			// pnameField.setValue(getPinyin(val));
		});

	var mPanel = new Ext.form.FormPanel({
		method : 'post',
		labelWidth : 150,
		labelAlign : 'right',
		region : 'center',
		height : 250,
		method : 'POST',
		border : false,
		defaultType : 'textfield',
		bodyStyle : 'padding:20px 0px 10px 0px;height:100%;width:100%;height:250px;background:#FFFFFF;',
		items : [lnameField, pnameField, typeEditor, lengthEditor,
				decimalEditor, {
					xtype : 'checkbox',
					fieldLabel : '必填'.loc(),
					width : 10,
					id : 'in_not_null',
					style : 'align:left;'
				}, {
					xtype : 'checkbox',
					fieldLabel : '标识'.loc(),
					width : 10,
					id : 'in_signed',
					checked : (config.signflag == 'true')
				}, specialSetCombo, {
					fieldLabel : '默认值'.loc(),
					width : 150,
					tabIndex : 139,
					id : 'in_default_value',
					allowBlank : true,
					style : 'text-align:left;'
				}, unitEditor, {
					xtype : 'textarea',
					fieldLabel : '提示'.loc(),
					width : 200,
					height : 100,
					tabIndex : 139,
					id : 'in_annotation',
					allowBlank : true
				}, {
					xtype : 'hidden',
					id : 'id'
				}, {
					xtype : 'hidden',
					id : 'object_id',
					value : object_id
				}, {
					xtype : 'hidden',
					id : 'in_serial',
					value : seq
				}, {
					xtype : 'hidden',
					id : 'isNew',
					value : isNew
				}]

	});
	if (!isNew) {
		mPanel.on("render", function() {
					mPanel.load({
								method : 'get',
								url : '/dev/database/table.jcp',
								params : {
									itemid : itemid,
									submitType : 'column',
									object_id : object_id
								},
								success : function(fm, act) {
									var data = act.result.data;
									if (data.cfg) {
										Ext.apply(config, data.cfg);
										if (config.ANNOTATION) {
											fm
													.findField("in_annotation")
													.setValue(config.ANNOTATION);
										}
									}
									typeEditor.fireEvent("select");
									lengthEditor.setValue(data.in_length);
									var val = data.in_special_set;
									var fn = function() {
										specialSetCombo.setValue(val);
										specialSetCombo.store.un("load", fn);
									}
									specialSetCombo.store.on("load", fn);
									specialDS.load({
												params : {
													type : data.in_data_type
												},
												method : 'post'
											});
								}
							});
				});
	} else {
		specialDS.load({
					params : {
						type : 'varchar'
					},
					method : 'post'
				});
	}
	var metadataOnly = new Ext.form.Checkbox({

	})
	var saveButtonClick = function() {
		var frm = mPanel.form;
		var msg = dev.database.KeyWord.getKeyWordMsg(pnameField.getValue());
		if (msg != "") {
			msg = '物理列名是'.loc() + msg + '关键字,请更改物理列名!'.loc()
			pnameField.markInvalid(msg);
			Ext.msg("error", msg);
			return false;
		}
		if (frm.isValid()) {
			var saveParams = {};
			saveParams['type'] = 'save';
			saveParams.in_special_set = frm.findField("in_special_set")
					.getValue();
			saveParams.in_data_type = frm.findField("in_data_type").getValue();
			saveParams.in_unit = frm.findField("in_unit").getValue();
			if (frm.findField("in_signed").getValue()) {
				if (!config)
					config = {};
				config.signflag = true;
			} else if (config.signflag) {
				config.signflag = false;
			}
			var anno = frm.findField("in_annotation").getValue();
			if (anno.trim() != "") {
				if (!config)
					config = {};
				config.ANNOTATION = anno;
			}
			if (typeof(config) == 'object') {
				saveParams['cfg'] = Ext.encode(config);
			}
			saveParams['metadataOnly'] = metadataOnly.getValue();
			frm.submit({
				url : '/dev/database/table.jcp',
				params : saveParams,
				method : 'post',
				scope : this,
				success : function(form, action) {
					var cForm = MetaTable.metaTablePanel.columnForm;
					if (cForm) {
						var st = MetaTable.metaTablePanel.columnForm.getStore();
						var idx = st.indexOf(cForm.selModel.getSelected());
						
						delete cForm.getView().scrollToTopTask;
						var scrolltop=cForm.getView().scrollToTop;
						cForm.getView().scrollToTop = function() {};
						
						st.load({
									params : {
										object_id : object_id,
										submitType : 'columns'
									},
									method : 'get',
									callback : function() {
										cForm.selModel.selectRow(idx);
										cForm.getView().scrollToTop=scrolltop;
									}
								});
					} else {
						Ext.msg("info", '操作成功,但服务器通讯错误,请刷新页面查看结果'.loc());
					}
					win.close();
				},
				failure : function(form, action) {
					Ext.msg("error", '数据提交失败!,原因:'.loc()+'<br>' + action.result.message);
				}
			});
		} else {
			Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
		}
	}
	var win = new Ext.Window({
				title : isNew ? '新建列'.loc() : '修改列'.loc(),
				layout : 'fit',
				width : 430,
				height : 480,
				plain : true,
				modal : true,
				resizable : false,
				items : [mPanel],
				buttonAlign : "left",
				buttons : [metadataOnly, '只'.loc() + ((isNew) ? '添加'.loc() : '修改'.loc()) + '元数据'.loc(),
						"->", {
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
