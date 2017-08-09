// using("usr.cms.tuijiangaojian");
// usr.cms.cmsGridDefineBtn(btn);
Ext.ns("usr.cms");
usr.cms.tuijiangaojian = function(btn) {
	var text = btn.text;
	var panel = Ext.getCmp(btn.panelId);
	var rec = panel.getSelectionModel().getSelected();
	
	var rec = panel.getSelectionModel().getSelected();
	if (typeof(rec) == 'undefined') {
		if (panel.getStore().getCount() == 1) {
			rec = panel.getStore().getAt(0);
		} else {
			btn.target.type = 0;
			Ext.msg("warn", '请选择要操作的行.'.loc());
			return;
		}
	}
	
	btn.target.type = 1;
	btn.disable();

	panel.param.popupWindowConfig = {
		title : "选择目标位置",
		width : panel.getEl().getHeight() / 2 || 245,
		height : panel.getEl().getWidth() / 2.5 || 500,
		fromPanelConfig : {
			btnId : btn.id,
			pmks : rec.get("pmk"),
			copyFormLanmu : panel.param.exportData
		},
		listeners : {
			"close" : function(me) {
				if (Ext.isDefined(me.fromPanelConfig)) {
					var b = Ext.getCmp(me.fromPanelConfig.btnId);
					if (Ext.isDefined(b) && b.disabled)
						b.enable();
				}
			}
		}
	}
}