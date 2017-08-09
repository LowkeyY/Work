Ext.ns("ExternalItems.haiwaizhishigongxiang")

ExternalItems.haiwaizhishigongxiang.FilePushOrMoveConfirm = function(btn) {
	var panel = Ext.getCmp(btn.panelId), frm = panel.form , win = panel.findParentByType(Ext.Window);
	if (frm && win && frm.isValid() && win.pmks) {
		var types = frm.findField('TARGET_POSITION').getValue(),
			targetSpaceId = frm.findField('SELECT_SPACE').getValue(),
			targetNodeId = frm.findField('SELECT_NODE').getValue(),
			newFilePath = frm.findField('NEW_FILE_PATH').getValue();
		Ext.msg("confirm", "确认"+(types == "0" ? "移动":"推送")+"?", function(answer) {
			if (answer == 'yes') {
				win.el.mask('操作中...');
				Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/FilePushOrMoveConfirm.jcp',
					params : {
						'types' : types,
						'targetSpaceId' : targetSpaceId,
						'targetNodeId' : targetNodeId,
						'newFilePath' : newFilePath,
						'pmks' : win.pmks,
						'exportData' : panel.param.exportData
					},
					method : 'post',
					scope : this,
					success : function(response, options) {
						win.el.unmask();
						var result = Ext.decode(response.responseText);
						if (result.success) {
							Ext.msg(result.type , result.message);
							if(result.type == "info"){
								var p = Ext.getCmp(win.panelId);
								if(p && p.store)
									p.store.reload();
							}
							win.close();
						}
					},
					failure: function(response, opts) {
						win.el.unmask();
					}
				});
			}
		});
	}
}