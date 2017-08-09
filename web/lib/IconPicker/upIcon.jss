Ext.namespace("lib.IconPicker");
// using("ExternalItems.haiwaizhishigongxiang.HWUpExcelFile");
// ExternalItems.haiwaizhishigongxiang.HWUpExcelFile(btn);

lib.IconPicker.upIcon = function(btn) {
	var panel = Ext.getCmp(btn.panelId);

	if (btn.target && !btn.target_old) {
		var tg = Ext.apply({}, btn.target);
		btn.target_old = tg;
		btn.target.type = 0;
	};
	
	var win = panel.findParentByType(Ext.Window);
	var comboText=win.comboText;
	panel.param.comboText=comboText;
	CPM.doAction({
					url : '/lib/IconPicker/UpIcon.jcp',
					method : 'POST',
					form : panel.form,
					scope : this,
					timeout : 10800000,
					params : panel.param,
					success : function(response, options) {
						var check = response.responseText;
						var ajaxResult = Ext.util.JSON.decode(check);
						if (!ajaxResult.success) {
							Ext.msg("warn", "上传失败。");
							var field;
							if (field = panel.form.findField("EXCEL")) {
								try {
									field.el.dom.value = '';
									field.fileInput.dom.value = "";
								} catch (e) {
								}
							}
						} else {
							var win = panel.findParentByType(Ext.Window);
							win.uploadsuccess = true;
							Ext.msg("info", "上传成功。");
							win.close();
						}
					}
				});
}