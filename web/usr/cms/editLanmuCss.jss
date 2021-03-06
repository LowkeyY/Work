Ext.ns("usr.cms");
using("lib.ColorField.ColorField");

usr.cms.editLanmuCss = function(element, isPlus , editTemplate) {
	if (!element || !isPlus)
		return "";
		
	var baseType = {
		// 可编辑字体大小
		0 : {
			"fieldLabel" : "字体大小",
			"name" : "font-size",
			"xtype" : "numberfield"
		},
		// 可编辑字体颜色
		1 : {
			"fieldLabel" : "字体颜色",
			"name" : "color",
			"xtype" : "colorfield"
		},
		// 可编辑字体风格
		2 : {
			"fieldLabel" : "字体风格",
			"name" : "font-style",
			"hiddenName" : "font-style",
			"xtype" : "combo",
			"store" : new Ext.data.SimpleStore({
						"fields" : ['value', 'text'],
						"data" : [["normal", "正常"], ["italic", "斜体"]]
					}),
			"editable" : false,
			"mode" : "local",
			"displayField" : "text",
			"valueField" : "value",
			"triggerAction" : "all"
		},
		3 : {
			"fieldLabel" : "字体加粗",
			"name" : "font-weight",
			"hiddenName" : "font-weight",
			"xtype" : "combo",
			"store" : new Ext.data.SimpleStore({
						"fields" : ['value', 'text'],
						"data" : [["normal", "正常"], ["bold", "加粗"]]
					}),
			"editable" : false,
			"mode" : "local",
			"displayField" : "text",
			"valueField" : "value",
			"triggerAction" : "all"
		} // 可编辑字体加粗
	}, isELDefined = function(el) {
		var reg = /^A_(vm.+?)$/, rs, key, value, defindeCol = ["A_vmeditlm",
				"A_vmtitle", "A_vmtype", "className"];
		for (var i = 0; i < defindeCol.length; i++) {
			var rs = reg.exec(defindeCol[i]);
			key = rs ? el["attributes"][rs[1]] : el[defindeCol[i]];
			if (!key)
				return false;
			value = rs ? el["attributes"][rs[1]].value : key;
			if (!(value && value.length))
				return false;
		}
		return true;
	}
	var elid , title, type, applyto, cn, sets = [],  dfo = {
		"xtype" : "textfield",
		"fieldLabel" : "",
		"hideLabel" : true,
		"hidden" : true
	};
	Ext.each(element.getElementsByTagName("*"), function(el) {
		if (isELDefined(el)) {
			elid = el.id ,title = el.attributes.vmtitle.value, type = el.attributes.vmtype.value, cn = el.className, applyto = (el.attributes.vmapply && el.attributes.vmapply.value) || "";
			var items = [], key, item;
			for (var i = 0; i < type.length; i++) {
				key = type.charAt(i);
				if (baseType[key])
					items.push(Ext.apply({
						"setFSELStyle" : (new usr.cms.editLanmuCss()).setFSELStyle,
						"listeners" : {
							"change" : function(me) {
								var fs = me.findParentByType("fieldset") , fselid , fsatv;
								if(fs){
									fselid = fs.ELID , fsatv = fs.ELApplyto;
									if(fselid){
										var setEl = document.getElementById(fselid) , fsv = fs.getFSValue();
										me.setFSELStyle(setEl , fsv , fsatv ? fsatv.split(",") : "");
										
										if(fsv){
											if(!Ext.isDefined(fs.loadData.loadAddCss))
												fs.loadData.loadAddCss = {};
											fs.loadData.loadAddCss[fselid] = fsatv ? Ext.apply(fsv , {"applyto" : fsatv}) : fsv;
										}
									}
								}
							}
						}
					}, baseType[key]))
			}
			if (items.length) {
				sets.push({
							xtype : 'fieldset',
							title : title,
							collapsible : true,
							ELID : elid,
							ELApplyto : applyto,
							loadData : editTemplate.propertyLoadDatas,
							getFSValue : function(){
								var obj = {} , hasValue = false;
								Ext.each(this.find("hidden" , false) , function(filed){
									if(filed.getValue()){
										hasValue = true;
										obj[filed.name] = filed.getValue() + (/-size$/i.test(filed.name) ? "px" : "");
									}
								})
								return hasValue ? this.ELApplyto ? Ext.apply(obj , {"applyto" : this.ELApplyto}) : obj : "";
							},
							setFSValue : function(obj){
								if (Ext.isObject(obj)) {
									Ext.each(this.find("hidden", false), function(filed) {
										if (Ext.isDefined(obj[filed.name]))
											filed.setValue(obj[filed.name].match(/px$/i) ? obj[filed.name].replace(/px$/i , "") : obj[filed.name])
									})
								}
							},
							defaults : {
								width : 120
							},
							defaultType : 'textfield',
							items : items,
							listeners : {
								"afterrender" : function(me){
									var ld = me.loadData , fselid = me.ELID;
									if(Ext.isDefined(ld.loadAddCss) && fselid && Ext.isDefined(ld.loadAddCss[fselid]))
										me.setFSValue(ld.loadAddCss[fselid])
								}
							}
						});
			}
		}
	});
	var cid = Ext.id();
	return sets.length ? {
		xtype : 'form',
		labelWidth : 120,
		scope : editTemplate,
		trackResetOnLoad : true,
		id : cid,
		autoScroll : true,
		bodyStyle : 'padding:25px 25px 0',
		width : 240,
		items : sets,
		loadData : editTemplate.propertyLoadDatas,
		lanmuid : editTemplate.param.dataId || "",
		listeners : {
			afterrender : function(comp) {
				var w;
				if (w = comp.findParentByType(Ext.Window)) {
					w.el.dom.style.textAlign = 'left';
					w.setWidth(360);
				}
			}
		},
		buttons : [{
					text : '保存',
					panelId : cid,
					handler : function(btn) {
						var panel = Ext.getCmp(btn.panelId), parentWindow = panel.findParentByType(Ext.Window) , paramsObj = {}, values = {}, hasV = false;
						if(!panel.form.isDirty()){
							Ext.msg("info", '无修改项。'.loc());
							return;
						};
						parentWindow.body.mask("正在保存，请稍后...");
						Ext.each(panel.findByType("fieldset"), function(fs) {
							var prop = fs.ELID , value = fs.getFSValue();
							if(prop && value){
								hasV = true;
								values[prop] = value;
							}
						});
							
						if(hasV){
							panel.loadData.loadAddCss = Ext.apply(panel.loadData.loadAddCss || {} , values);
							paramsObj["loadAddCss"] = Ext.encode(panel.loadData.loadAddCss);
							Ext.Ajax.request({
								url : "/usr/cms/editTemplateLoad.jcp",
								params : Ext.apply({
									dataId : panel.scope.param["dataId"],
									formJson : Ext.encode(["loadAddCss"])
								}, paramsObj),
								scope : this,
								method : "Post",
								success : function(form, action) {
									parentWindow.close();
									panel.scope.markPanel.removeAll();
									panel.scope.doPreview();
									Ext.msg("info", "保存成功。");
								},
								failure : function(form, action) {
									parentWindow.body.unmask();
									switch (action.failureType) {
										case Ext.form.Action.CLIENT_INVALID :
											Ext.msg("error", "表单错误，请刷新页面重试。");
											break;
										case Ext.form.Action.CONNECT_FAILURE :
											Ext.msg("error", "连接失败，请刷新页面重试。");
											break;
										case Ext.form.Action.SERVER_INVALID :
											Ext.msg("error", action.result.msg);
									}
								}
							}, this);					
						}else{
							parentWindow.body.unmask();
							Ext.msg("info", "无提交数据。");
						}
					}
				}, {
					text : '还原',
					panelId : cid,
					handler : function(btn) {
						var panel = Ext.getCmp(btn.panelId) , parentWindow = panel.findParentByType(Ext.Window);
						panel.scope.markPanel.removeAll();
						panel.scope.doPreview();
						parentWindow.close();
					}
				}, {
					text : '还原为初始设置',
					panelId : cid,
					handler : function(btn) {
						var panel = Ext.getCmp(btn.panelId) , parentWindow = panel.findParentByType(Ext.Window);
						parentWindow.body.mask("正在还原初始设置，请稍后...");
						Ext.Ajax.request({
							url : "/usr/cms/editTemplateLoad.jcp",
							params : {
								dataId : panel.scope.param["dataId"],
								formJson : Ext.encode(["loadAddCss"]),
								loadAddCss : Ext.encode({})
							},
							scope : this,
							method : "Post",
							success : function(form, action) {
								parentWindow.close();
								Ext.msg("confirm", "已完成修改，是否重载页面？",
												function(btns) {
													if (btns == "yes") {
														this.markPanel.removeAll();
														this.doPreview();
													}
								}.createDelegate(panel.scope));
							},
							failure : function(form, action) {
								parentWindow.body.unmask();
								switch (action.failureType) {
									case Ext.form.Action.CLIENT_INVALID :
										Ext.msg("error", "表单错误，请刷新页面重试。");
										break;
									case Ext.form.Action.CONNECT_FAILURE :
										Ext.msg("error", "连接失败，请刷新页面重试。");
										break;
									case Ext.form.Action.SERVER_INVALID :
										Ext.msg("error", action.result.msg);
								}
							}
						}, this);	
					}
				}]
	} : "";
}
usr.cms.editLanmuCss.prototype = {
	setFSELStyle : function(el, stv, tns) {
		if (!el || !stv)
			return;
		var fel = Ext.fly(el);
		if(!fel)
			return;
		if (tns && tns.length)
			Ext.each(tns, function(tn) {
						if (tn == "me")
							fel.setStyle(stv);
						else
							fel.select(tn).setStyle(stv);
					})
		else
			fel.setStyle(stv);
	},
	setFSELStyleByObject : function(obj){
		if(Ext.isObject(obj)){
			for(prop in obj){
				var v = obj[prop];
				this.setFSELStyle(prop , v , v["applyto"] ? v["applyto"].split(",") : "");
			}
		}
	}
}