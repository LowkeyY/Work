Ext.ns("usr.cms");

usr.cms.cmsPluginDefineBtn = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	if (Ext.isDefined(btn.target)) {
		btn.target_old = Ext.apply({}, btn.target);
		delete btn.target;
	}
	var frm = panel.form;
	var isPass = false;

	var cols = ["CJ_DIZHI", "CJ_CHAJIANTUBIAO"];
	var message = "";
	Ext.each(cols, function(col) {
				var field = frm.findField(col);
				if (Ext.isDefined(field)) {
					if (field.isVisible()) {
						if (field.getValue() == "") {
							message = (message.length > 0 ? field.fieldLabel.replace("<font color=\"red\">*</font>","")
									+ "、" : field.fieldLabel.replace("<font color=\"red\">*</font>",""))
									+ message;
						}
					}
				}
			});

	if (message.length > 0) {
		Ext.msg("warn", message + "不能为空。");
	}
	if (panel.form.isValid() && message.length == 0) {
		btn.action = "%save";
		panel.param['action'] = btn.action;
		var deferHandel = panel.el.mask.defer(500, panel.el, ["数据处理中....."]);
		var p = Ext.apply({
					_method : (btn.state == 'new') ? 'POST' : 'PUT'
				}, panel.param)
		CPM.doAction({
					form : panel.form,
					params : p,
					method : 'POST',
					timeout : 900000,
					success : function(form, action) {
						clearTimeout(deferHandel);
						panel.el.unmask();
						Ext.msg("info", '保存成功'.loc());
						if (action.result) {
							var r = action.result;
							if (Ext.isFunction(r.callback)
									&& r.callback(panel, form, action) === false) {
								return;
							}

							if (r.dataId) {
								var ps = r.exportInfo.split(",");
								Ext.apply(panel.param, {
											dataId : r.dataId,
											pTab : ps.shift(),
											pItem : ps.join(","),
											pData : r.dataId
										})
							}

							if (btn.target_old.targets) {
								CPM.replaceTarget(panel, panel.ownerCt,
										panel.param, btn.target_old);
							}
						}
					},
					failure : function() {
						clearTimeout(deferHandel);
						panel.el.unmask();
					}
				}, btn);
	}
}