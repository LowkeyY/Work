// using("usr.cms.cmsGridDefineBtn");
// usr.cms.cmsGridDefineBtn(btn);

Ext.ns("usr.cms");
usr.cms.cmsGridDefineBtn = function(btn) {
	var text = btn.text;
	var panel = Ext.getCmp(btn.panelId);

	var rec = panel.getSelectionModel().getSelected();
	
	if (typeof(rec) == 'undefined' && text != "复制全部") {
		if (panel.getStore().getCount() == 1) {
			rec = panel.getStore().getAt(0);
		} else {
			btn.target.type = 0;
			Ext.msg("warn", '请选择要操作的行.'.loc());
			return;
		}
	}

	var loadP = Ext.applyIf({
				DataPartMode : 'puredata',
				pageType : "list"
			}, panel.param);
	var baseP = panel.getStore().baseParams;
	if (Ext.isDefined(baseP.export_data)
			|| (Ext.isDefined(baseP.DataPartMode) && baseP.DataPartMode == "data")) {
		delete baseP.export_data;
		panel.getStore().baseParams = Ext.apply(baseP, loadP);
	}
	
	if (text == "发布" || text == "归档") {
		var type = (text == "发布" ? "fabu" : "guidang");
		var progressText = rec.get("biaoti");

		if (type == "guidang" && rec.get("guidang") == "true") {
			Ext.msg("warn", "标题为：\"" + progressText + "\" 的页面已归档。");
			return;
		};
		//临时处理
		rec = (panel.getStore().getCount() == 1 ? rec : panel.getSelectionModel().getSelections());
		var pmks = new Array();
		if (Ext.isArray(rec)) {
			for (var i = 0; i < rec.length; i++) {
				pmks.push(rec[i].get("pmk"));
			}
		} else
			pmks.push(rec.get("pmk"));
		// 结束
		var win = panel.findParentByType(Ext.Window);
		//var pmk = rec.get("pmk");
		var pmk = pmks.join(",");//临时处理
		
		win.getEl().mask("请稍候...");
		Ext.Ajax.request({
			url : '/usr/cms/fabuhuoguidang.jcp',
			params : {
				pmk : pmk,
				type : type,
				fromNode : "gaojian"
			},
			scope : this,
			method : 'Post',
			timeout : 1800000,
			success : function(response, options) {
				win.getEl().unmask();
				var result = Ext.decode(response.responseText);
				if (result.success) {
					if(!Ext.isDefined(result.uuid) && Ext.isDefined(result.msg)){
						panel.getStore().reload({});
						Ext.msg("info", result.msg);
						return;
					}
					var uuid = result.uuid;
					if (uuid == "success") {
						panel.getStore().reload({});
						Ext.msg("info", result.message);
						return;
					}
					var pbar = Ext.Msg.progress("正在" + text, text + "中...",
							progressText);
					var count = 0;

					var fn = function() {
						Ext.Ajax.request({
									url : '/usr/cms/uploadProgress.jcp',
									params : {
										uuid : uuid
									},
									scope : this,
									method : 'Post',
									success : function(response, options) {
										var result = Ext
												.decode(response.responseText);
										if (result.message != ""
												&& result.message != null) {
											clearInterval(interval);
											pbar.updateProgress(1);
											pbar.hide();
											if (result.message == "success") {
												panel.getStore().reload({});
												Ext.msg("info", text + "成功。");
											} else {
												Ext.msg("Error",text+ "失败。原因 ： "+ '<br>'
																		+ result.message);
											}
										} else {
											pbar.updateProgress(count);
											count += 0.1;
											if (count > 1)
												count = 0
										}
									}
								}, this);
					}

					var interval = setInterval(fn.createDelegate(this), 300);
				} else
					Ext.msg("Error", text + "失败。原因 ： " + '<br>'
									+ result.message);
			},
			failure : function() {
				win.getEl().unmask();
				Ext.msg("warn", text + "失败。");
			}
		}, this);
	} else if (text == "定时执行") {
		btn.target.type = 1;
		var module = CPM.getModule(panel.param.programType);
		var p = module.getExportParams(panel, rec, {
					pData : rec.get("pmk"),
					dataId : rec.get("pmk")
				});

		panel.param = Ext.applyIf(p, panel.param);
		btn.disable();

		panel.param.popupWindowConfig = {
			title : "定时执行",
			width : panel.getEl().getWidth() / 2 || 500,
			height : panel.getEl().getHeight() / 2 || 245,
			fromPanelConfig : {
				panelId : btn.panelId,
				btnId : btn.id,
				isCommit : false
			},
			listeners : {
				"close" : function(me) {
					if (Ext.isDefined(me.fromPanelConfig)) {
						var b = Ext.getCmp(me.fromPanelConfig.btnId);
						if (Ext.isDefined(b) && b.disabled)
							b.enable();
						var p = Ext.getCmp(me.fromPanelConfig.panelId);
						if (Ext.isDefined(p) && me.fromPanelConfig.isCommit)
							p.getStore().reload({});
					}
				}
			}
		}
	} else if (text == "复制稿件" || text == "还原到指定栏目") {
		btn.target.type = 1;
		rec = (panel.getStore().getCount() == 1 ? rec : panel.getSelectionModel().getSelections());
		var copyFormLanmu=panel.param.exportData;
		
		var pmks = new Array();
		if (Ext.isArray(rec)) {
			for (var i = 0; i < rec.length; i++) {
				pmks.push(rec[i].get("pmk"));
			}
		} else
			pmks.push(rec.get("pmk"));
		
		btn.disable();
		if(text == "还原到指定栏目"){
			if (Ext.isArray(rec)) {
			for (var i = 0; i < rec.length; i++) {
				copyFormLanmu=rec[i].get("pmk");
			}
		} else
			copyFormLanmu=rec.get("pmk");
		}
		panel.param.popupWindowConfig = {
			title : "选择目标位置",
			width : panel.getEl().getHeight() / 2 || 245,
			height : panel.getEl().getWidth() / 2.5 || 500,
			fromPanelConfig : {
				panelId : btn.panelId,
				btnId : btn.id,
				isCommit : false,
				pmks : pmks,
				copyFormLanmu :copyFormLanmu,
				copyType : "some"
			},
			listeners : {
				"close" : function(me) {
					if (Ext.isDefined(me.fromPanelConfig)) {
						var b = Ext.getCmp(me.fromPanelConfig.btnId);
						if (Ext.isDefined(b) && b.disabled)
							b.enable();
						var p = Ext.getCmp(me.fromPanelConfig.panelId);
						if (Ext.isDefined(p) && me.fromPanelConfig.isCommit)
							p.getStore().reload({});
					}
				}
			}
		}
	} else if (text == "复制全部") {
		if(panel.getStore().getCount() == 0){
			Ext.msg("warn", "没有找到能够复制的数据。");
			btn.target.type = 0;
			return;
		}
		btn.target.type = 1;
		panel.param.popupWindowConfig = {
			title : "选择目标位置",
			width : panel.getEl().getHeight() / 2 || 245,
			height : panel.getEl().getWidth() / 2.5 || 500,
			fromPanelConfig : {
				panelId : btn.panelId,
				btnId : btn.id,
				isCommit : false,
				pmks : [],
				copyFormLanmu : panel.param.exportData,
				copyType : "all"
			},
			listeners : {
				"close" : function(me) {
					if (Ext.isDefined(me.fromPanelConfig)) {
						var b = Ext.getCmp(me.fromPanelConfig.btnId);
						if (Ext.isDefined(b) && b.disabled)
							b.enable();
						var p = Ext.getCmp(me.fromPanelConfig.panelId);
						if (Ext.isDefined(p) && me.fromPanelConfig.isCommit)
							p.getStore().reload({});
					}
				}
			}
		}
	}
}