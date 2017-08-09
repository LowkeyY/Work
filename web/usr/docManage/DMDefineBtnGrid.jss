Ext.ns("usr.docManage");

usr.docManage.DMDefineBtnGrid = function(btn) {

	var panel = Ext.getCmp(btn.panelId);
	
	switch(btn.text){
		case "发起发文" : 
			btn.target.type = 1;
			btn.disable();
			
			panel.param.popupWindowConfig = {
				title : btn.text,
				modal : true,
				width : panel.getEl().getWidth() / 1.4 || 700,
				height : panel.getEl().getHeight() / 1.4 || 350,
				fromPanelConfig : {
					btnId : btn.id,
					panelId : btn.panelId
				},
				listeners : {
					"close" : function(me) {
						if (Ext.isDefined(me.fromPanelConfig)) {
							var b = Ext.getCmp(me.fromPanelConfig.btnId);
							if (Ext.isDefined(b) && b.disabled)
								b.enable();
							if(Ext.isDefined(me.fromPanelConfig.hasTarget)){
								var p = Ext.getCmp(me.fromPanelConfig.panelId);
								p.findParentByType(Ext.Window).hasPanelDataConfig = {
									"dataId" : me.fromPanelConfig.hasTarget.dataId,
									"exportInfo" : me.fromPanelConfig.hasTarget.exportInfo
								};
								CPM.replaceTarget( p, p.ownerCt, p.param,me.fromPanelConfig.hasTarget );
								delete me.fromPanelConfig.hasTarget;
							}
						}
					}
				}
			}
			break;
		case "修改" :
			if(Ext.isDefined(btn.target)){
				btn.target_old = Ext.apply({},btn.target);
				delete btn.target;
			}
			var rec = panel.getSelectionModel().getSelected();
			if (typeof(rec) == 'undefined') {
				if (panel.getStore().getCount() == 1) {
					rec = panel.getStore().getAt(0);
				} else {
					Ext.msg("warn", '请选择要编辑的行.'.loc());
					return;
				}
			}
			if(rec.get("ZHT")!="未提交审批"){
				Ext.msg("warn", '只有 \"未提交审批\" 的公文可以修改。');
				return;
			}
			panel.param.popupWindowConfig = {
				title : btn.text,
				modal : true,
				width : panel.getEl().getWidth() / 1.4 || 700,
				height : panel.getEl().getHeight() / 1.4 || 350
			}
			var module = CPM.getModule(panel.param.programType);
			var p = module.getExportParams(panel, rec, {
						pData : rec.get("pmk"),
						dataId : rec.get("pmk")
					});
			var p = Ext.applyIf(p, panel.param);
			CPM.replaceTarget(panel, panel.ownerCt, p, btn.target_old);
			break;
		case "分发" :
			if(Ext.isDefined(btn.target)){
				btn.target_old = Ext.apply({},btn.target);
				delete btn.target;
			}
			var rec = panel.getSelectionModel().getSelected();
			if (typeof(rec) == 'undefined') {
				if (panel.getStore().getCount() == 1) {
					rec = panel.getStore().getAt(0);
				} else {
					Ext.msg("warn", '请选择要编辑的行.'.loc());
					return;
				}
			}
			if(rec.get("ZHT")!="审批结束"){
				Ext.msg("warn", '只有 \"审批结束\" 的公文可以分发。');
				return;
			}
			panel.param.popupWindowConfig = {
				title : btn.text,
				modal : true,
				width : panel.getEl().getWidth() / 1.4 || 700,
				height : panel.getEl().getHeight() / 1.4 || 350
			};
			var module = CPM.getModule(panel.param.programType);
			var p = module.getExportParams(panel, rec, {
						pData : rec.get("pmk"),
						dataId : rec.get("pmk")
					});
			var p = Ext.applyIf(p, panel.param);
			CPM.replaceTarget(panel, panel.ownerCt, p, btn.target_old);
			break;
	}
}